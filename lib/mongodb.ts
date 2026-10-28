import { MongoClient, Db } from "mongodb";
import fs from "fs";
import path from "path";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/goodgather";
const options = {
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 2000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let isConnectedToMongo = false;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _fallbackStore: Record<string, any[]> | undefined;
}

// Fallback seed data in case MongoDB server is offline
const INITIAL_SEED_EVENTS = [
  {
    _id: "seed-event-1",
    title: "Winter Clothes Distribution",
    description: "Collecting and distributing warm clothes, jackets, sweaters, and shawls to underprivileged families, rickshaw pullers, and children facing harsh winter.",
    eventType: "Donation",
    thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    location: "Mirpur 10, Dhaka",
    date: "2026-11-15",
    userEmail: "organizer@goodgather.org",
    userName: "Mirpur Youth Volunteers",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-2",
    title: "Blanket Distribution for the Needy",
    description: "Night-time blanket distribution drive across pavement dwellers, orphanages, and senior citizens across Mohammadpur and adjacent areas.",
    eventType: "Donation",
    thumbnail: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    location: "Mohammadpur, Dhaka",
    date: "2026-11-20",
    userEmail: "aid@goodgather.org",
    userName: "Mohammadpur Care Circle",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-3",
    title: "Dhanmondi Lake Clean-Up Campaign",
    description: "Join us this Saturday morning with gloves, bags, and tools to clear plastic waste from walkways and lake borders.",
    eventType: "Cleanup",
    thumbnail: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    location: "Dhanmondi Lake, Dhaka",
    date: "2026-11-25",
    userEmail: "eco@goodgather.org",
    userName: "Green Dhaka Youth",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-4",
    title: "Urban Tree Plantation Drive",
    description: "Planting 500 fruit and timber saplings along school compounds and roadside pathways to boost greenery and combat urban heat.",
    eventType: "Plantation",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    location: "Sector 11, Uttara, Dhaka",
    date: "2026-12-01",
    userEmail: "green@goodgather.org",
    userName: "Uttara Eco Club",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-5",
    title: "Community Free Health & Eye Camp",
    description: "Providing basic health checkups, blood sugar screenings, and eyeglasses to underprivileged residents with certified volunteer doctors.",
    eventType: "Health Camp",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    location: "Kawran Bazar, Dhaka",
    date: "2026-12-05",
    userEmail: "health@goodgather.org",
    userName: "Community Medical Aid",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-6",
    title: "Slum Children Book & Stationery Drive",
    description: "Distributing notebooks, pencils, school bags, and storybooks to primary school children living in Rayerbazar area.",
    eventType: "Education",
    thumbnail: "https://images.unsplash.com/photo-1497633762267-9d1f1e4a5fb6?auto=format&fit=crop&w=800&q=80",
    location: "Rayerbazar, Dhaka",
    date: "2026-12-10",
    userEmail: "educate@goodgather.org",
    userName: "Hope for All",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seed-event-7",
    title: "Old Town Food Relief & Meal Sharing",
    description: "Cooking and sharing 800 freshly prepared hot meals for homeless individuals and day laborers in Old Dhaka.",
    eventType: "Donation",
    thumbnail: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=800&q=80",
    location: "Sadarghat, Old Dhaka",
    date: "2026-12-15",
    userEmail: "food@goodgather.org",
    userName: "Old Dhaka Warmth",
    createdAt: new Date().toISOString(),
  },
];

// In-memory / JSON persistence fallback
function getFallbackStore(): Record<string, any[]> {
  if (!global._fallbackStore) {
    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "db.json");
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        global._fallbackStore = JSON.parse(content);
      } catch {
        global._fallbackStore = { events: [...INITIAL_SEED_EVENTS], users: [], joined_events: [] };
      }
    } else {
      global._fallbackStore = { events: [...INITIAL_SEED_EVENTS], users: [], joined_events: [] };
    }
  }
  return global._fallbackStore!;
}

function saveFallbackStore() {
  try {
    const dataDir = path.join(process.cwd(), ".data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, "db.json");
    fs.writeFileSync(filePath, JSON.stringify(global._fallbackStore, null, 2));
  } catch (err) {
    console.error("Failed to persist fallback store:", err);
  }
}

class FallbackCursor {
  private items: any[];

  constructor(items: any[]) {
    this.items = [...items];
  }

  sort(sortCriteria: Record<string, 1 | -1>) {
    const keys = Object.keys(sortCriteria);
    if (keys.length > 0) {
      const key = keys[0];
      const direction = sortCriteria[key];
      this.items.sort((a, b) => {
        if (a[key] < b[key]) return direction === 1 ? -1 : 1;
        if (a[key] > b[key]) return direction === 1 ? 1 : -1;
        return 0;
      });
    }
    return this;
  }

  limit(count: number) {
    this.items = this.items.slice(0, count);
    return this;
  }

  async toArray() {
    return this.items;
  }
}

class FallbackCollection {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  private getList(): any[] {
    const store = getFallbackStore();
    if (!store[this.name]) {
      store[this.name] = [];
    }
    return store[this.name];
  }

  find(filter: Record<string, any> = {}) {
    let list = this.getList();
    if (Object.keys(filter).length > 0) {
      list = list.filter((item) => {
        for (const [key, val] of Object.entries(filter)) {
          if (val && typeof val === "object") {
            if ("$gte" in val && item[key] < val.$gte) return false;
            if ("$gt" in val && item[key] <= val.$gt) return false;
            if ("$lte" in val && item[key] > val.$lte) return false;
            if ("$lt" in val && item[key] >= val.$lt) return false;
            if ("$regex" in val) {
              const regex = new RegExp(val.$regex, val.$options || "i");
              if (!regex.test(item[key] || "")) return false;
            }
          } else if (item[key] !== val) {
            return false;
          }
        }
        return true;
      });
    }
    return new FallbackCursor(list);
  }

  async findOne(filter: Record<string, any> = {}) {
    const cursor = this.find(filter);
    const results = await cursor.toArray();
    return results[0] || null;
  }

  async insertOne(doc: any) {
    const list = this.getList();
    const newDoc = {
      ...doc,
      _id: doc._id || "id-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8),
    };
    list.unshift(newDoc);
    saveFallbackStore();
    return { insertedId: newDoc._id, acknowledged: true };
  }

  async updateOne(filter: Record<string, any>, update: any) {
    const list = this.getList();
    const index = list.findIndex((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) return false;
      }
      return true;
    });

    if (index !== -1) {
      if (update.$set) {
        list[index] = { ...list[index], ...update.$set };
      } else {
        list[index] = { ...list[index], ...update };
      }
      saveFallbackStore();
      return { modifiedCount: 1, matchedCount: 1, acknowledged: true };
    }
    return { modifiedCount: 0, matchedCount: 0, acknowledged: true };
  }

  async updateMany(filter: Record<string, any>, update: any) {
    const list = this.getList();
    let modifiedCount = 0;
    list.forEach((item, index) => {
      let match = true;
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) {
          match = false;
          break;
        }
      }
      if (match) {
        if (update.$set) {
          list[index] = { ...list[index], ...update.$set };
        } else {
          list[index] = { ...list[index], ...update };
        }
        modifiedCount++;
      }
    });
    if (modifiedCount > 0) {
      saveFallbackStore();
    }
    return { modifiedCount, acknowledged: true };
  }

  async deleteOne(filter: Record<string, any>) {
    const store = getFallbackStore();
    const list = this.getList();
    const index = list.findIndex((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) return false;
      }
      return true;
    });

    if (index !== -1) {
      list.splice(index, 1);
      store[this.name] = list;
      saveFallbackStore();
      return { deletedCount: 1, acknowledged: true };
    }
    return { deletedCount: 0, acknowledged: true };
  }

  async deleteMany(filter: Record<string, any>) {
    const store = getFallbackStore();
    const list = this.getList();
    const remaining = list.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] === val) return false;
      }
      return true;
    });
    const deletedCount = list.length - remaining.length;
    store[this.name] = remaining;
    if (deletedCount > 0) {
      saveFallbackStore();
    }
    return { deletedCount, acknowledged: true };
  }

  async countDocuments(filter: Record<string, any> = {}) {
    const items = await this.find(filter).toArray();
    return items.length;
  }
}

class FallbackDb {
  collection(name: string) {
    return new FallbackCollection(name);
  }
}

export async function getDb(): Promise<{ db: any; isNativeMongo: boolean }> {
  try {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    const connectedClient = await clientPromise;
    // Ping to verify actual connectivity
    await connectedClient.db().command({ ping: 1 });
    isConnectedToMongo = true;
    const db = connectedClient.db();

    // Seed events if collection is empty
    const count = await db.collection("events").countDocuments();
    if (count === 0) {
      await db.collection("events").insertMany(INITIAL_SEED_EVENTS as any);
    }

    return { db, isNativeMongo: true };
  } catch (error) {
    // If local/remote mongo server is not reachable, gracefully fallback to persisted store
    return { db: new FallbackDb() as unknown as Db, isNativeMongo: false };
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  try {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    const c = await clientPromise;
    await c.db().command({ ping: 1 });
    return c;
  } catch {
    return null;
  }
}
