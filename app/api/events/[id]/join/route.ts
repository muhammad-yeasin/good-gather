import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to join this event." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { db } = await getDb();

    // Fetch the event
    let event = null;
    try {
      if (ObjectId.isValid(id) && id.length === 24) {
        event = await db.collection("events").findOne({
          $or: [{ _id: new ObjectId(id) }, { _id: id }],
        });
      } else {
        event = await db.collection("events").findOne({ _id: id });
      }
    } catch {
      event = await db.collection("events").findOne({ _id: id });
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if already joined
    const existingJoin = await db.collection("joined_events").findOne({
      eventId: id,
      userEmail: user.email,
    });

    if (existingJoin) {
      return NextResponse.json(
        { message: "You have already joined this event." },
        { status: 200 }
      );
    }

    const joinRecord = {
      eventId: id,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      userEmail: user.email,
      userName: user.name,
      userPhoto: user.photoURL,
      joinedAt: new Date().toISOString(),
    };

    await db.collection("joined_events").insertOne(joinRecord);

    return NextResponse.json(
      { message: "Successfully joined event!", joined: true },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to join event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await getDb();

    await db.collection("joined_events").deleteOne({
      eventId: id,
      userEmail: user.email,
    });

    return NextResponse.json({ message: "Left event successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to leave event" },
      { status: 500 }
    );
  }
}

