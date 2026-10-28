import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await getDb();
    const myEvents = await db
      .collection("events")
      .find({ userEmail: user.email })
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json({ events: myEvents });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch manage events" },
      { status: 500 }
    );
  }
}

