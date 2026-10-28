import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signJwtToken, verifyJwtToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.all?.join("/") || "";

  // 1. Sign up / Registration
  if (path === "sign-up/email" || path === "register") {
    try {
      const body = await req.json();
      const { name, email, password, photoURL } = body;

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required." },
          { status: 400 }
        );
      }

      // Password Validation: uppercase, lowercase, min 6 characters
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const isMinLength = password.length >= 6;

      if (!hasUppercase || !hasLowercase || !isMinLength) {
        return NextResponse.json(
          {
            error:
              "Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.",
          },
          { status: 400 }
        );
      }

      const { db } = await getDb();
      const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection("users").insertOne(newUser);
      const userId = result.insertedId ? result.insertedId.toString() : "user-" + Date.now();

      const sessionUser = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
      };

      const token = await signJwtToken(sessionUser);

      const response = NextResponse.json({
        user: sessionUser,
        message: "User registered successfully!",
      });

      response.cookies.set("goodgather_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || "Registration failed" },
        { status: 500 }
      );
    }
  }

  // 2. Sign in / Login
  if (path === "sign-in/email" || path === "login") {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required." },
          { status: 400 }
        );
      }

      const { db } = await getDb();
      const user = await db.collection("users").findOne({ email: email.toLowerCase() });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const sessionUser = {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };

      const token = await signJwtToken(sessionUser);

      const response = NextResponse.json({
        user: sessionUser,
        message: "Signed in successfully!",
      });

      response.cookies.set("goodgather_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || "Login failed" },
        { status: 500 }
      );
    }
  }

  // 3. Sign out / Logout
  if (path === "sign-out" || path === "logout") {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("goodgather_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.all?.join("/") || "";

  // Get current user session
  if (path === "get-session" || path === "session" || path === "me") {
    const token = req.cookies.get("goodgather_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const sessionUser = await verifyJwtToken(token);
    return NextResponse.json({ user: sessionUser });
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

