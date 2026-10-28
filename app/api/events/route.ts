import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { isFutureDate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const upcomingOnly = searchParams.get("upcomingOnly") === "true";
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const { db } = await getDb();
    const filter: Record<string, any> = {};

    if (upcomingOnly) {
      const todayStr = new Date().toISOString().split("T")[0];
      filter.date = { $gte: todayStr };
    }

    if (type && type !== "All") {
      filter.eventType = type;
    }

    if (search && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    let cursor = db.collection("events").find(filter).sort({ date: 1 });

    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        cursor = cursor.limit(limit);
      }
    }

    const events = await cursor.toArray();
    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create an event." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, eventType, thumbnail, location, date } = body;

    // Validation
    if (!title || !description || !eventType || !thumbnail || !location || !date) {
      return NextResponse.json(
        { error: "All fields are required to create an event." },
        { status: 400 }
      );
    }

    if (!isFutureDate(date)) {
      return NextResponse.json(
        { error: "Event date must be in the future. Past dates are not allowed." },
        { status: 400 }
      );
    }

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      date,
      userEmail: user.email,
      userName: user.name,
      userPhoto: user.photoURL,
      createdAt: new Date().toISOString(),
    };

    const { db } = await getDb();
    const result = await db.collection("events").insertOne(newEvent);

    return NextResponse.json(
      {
        message: "Event created successfully!",
        event: { ...newEvent, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

