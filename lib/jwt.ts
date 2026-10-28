import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "goodgather_social_service_jwt_secret_token_2026_hermione"
);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

export async function signJwtToken(payload: SessionUser): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyJwtToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: (payload.id as string) || (payload.sub as string),
      name: payload.name as string,
      email: payload.email as string,
      photoURL: (payload.photoURL as string) || (payload.image as string) || "",
    };
  } catch (error) {
    return null;
  }
}

