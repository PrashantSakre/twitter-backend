import { Elysia } from "elysia";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authPlugin = new Elysia({ name: "auth" }).derive(
  ({ headers, set }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("No or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId?: string };
      if (!payload.userId) {
        set.status = 401;
        throw new Error("Missing userId in token");
      }

      return { user: payload };
    } catch (e) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }
  },
);

export const generateToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
