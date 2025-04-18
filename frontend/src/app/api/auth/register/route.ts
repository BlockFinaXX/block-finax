import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, passwordHash });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return NextResponse.json({ token, user: newUser });
}
