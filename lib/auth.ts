import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { cookies } from "next/headers";
import { verifyJwtToken, SessionUser } from "./jwt";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/goodgather";
const client = new MongoClient(uri);
const db = client.db();

// Standard BetterAuth configuration with MongoDB Adapter and JWT Plugin
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "goodgather_social_service_jwt_secret_token_2026_hermione",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      photoURL: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
      },
    }),
  ],
});

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("goodgather_token")?.value;
    if (!token) return null;
    return await verifyJwtToken(token);
  } catch (error) {
    return null;
  }
}

