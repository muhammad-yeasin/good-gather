import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { isFutureDate } from "@/lib/utils";
import { ObjectId } from "mongodb";

function createIdQuery(id: string) {
  try {
    if (ObjectId.isValid(id) && id.length === 24) {
      return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    }
  } catch {}
  return { _id: id };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await getDb();

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

    // Attendees count & check if current user joined
    const currentUser = await getCurrentUser();
    const joinedRecords = await db
      .collection("joined_events")
      .find({ eventId: id })
      .toArray();

    const isJoined = currentUser
      ? joinedRecords.some((r: any) => r.userEmail === currentUser.email)
      : false;

    return NextResponse.json({
      event,
      isJoined,
      attendeesCount: joinedRecords.length,
      attendees: joinedRecords.map((r: any) => ({
        userName: r.userName,
        userPhoto: r.userPhoto,
        joinedAt: r.joinedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, eventType, thumbnail, location, date } = body;

    // Validation
    if (!title || !description || !eventType || !thumbnail || !location || !date) {
      return NextResponse.json(
        { error: "All fields are required for updating the event." },
        { status: 400 }
      );
    }

    if (!isFutureDate(date)) {
      return NextResponse.json(
        { error: "Event date must be in the future. Past dates are not allowed." },
        { status: 400 }
      );
    }

    const { db } = await getDb();

    // Check existing event & verify ownership
    let existing = null;
    try {
      if (ObjectId.isValid(id) && id.length === 24) {
        existing = await db.collection("events").findOne({
          $or: [{ _id: new ObjectId(id) }, { _id: id }],
        });
      } else {
        existing = await db.collection("events").findOne({ _id: id });
      }
    } catch {
      existing = await db.collection("events").findOne({ _id: id });
    }

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (existing.userEmail !== user.email) {
      return NextResponse.json(
        { error: "Forbidden. You can only update events you created." },
        { status: 403 }
      );
    }

    const updateDoc = {
      title: title.trim(),
      description: description.trim(),
      eventType,
      thumbnail: thumbnail.trim(),
      location: location.trim(),
      date,
      updatedAt: new Date().toISOString(),
    };

    let filter: any = { _id: existing._id };
    await db.collection("events").updateOne(filter, { $set: updateDoc });

    // Also update any denormalized event info in joined_events
    try {
      await db.collection("joined_events").updateMany(
        { eventId: id },
        {
          $set: {
            eventTitle: updateDoc.title,
            eventDate: updateDoc.date,
            eventLocation: updateDoc.location,
            eventType: updateDoc.eventType,
            thumbnail: updateDoc.thumbnail,
          },
        }
      );
    } catch {}

    return NextResponse.json({
      message: "Event updated successfully!",
      event: { ...existing, ...updateDoc },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update event" },
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

    let existing = null;
    try {
      if (ObjectId.isValid(id) && id.length === 24) {
        existing = await db.collection("events").findOne({
          $or: [{ _id: new ObjectId(id) }, { _id: id }],
        });
      } else {
        existing = await db.collection("events").findOne({ _id: id });
      }
    } catch {
      existing = await db.collection("events").findOne({ _id: id });
    }

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (existing.userEmail !== user.email) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete events you created." },
        { status: 403 }
      );
    }

    await db.collection("events").deleteOne({ _id: existing._id });
    await db.collection("joined_events").deleteMany({ eventId: id });

    return NextResponse.json({ message: "Event deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete event" },
      { status: 500 }
    );
  }
}

