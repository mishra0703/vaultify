import bcrypt from "bcrypt";
import User from "@/app/models/User";
import connectDB from "@/db/connectDb";

export async function POST(req) {
  try {
    const { data } = await req.json();
    const { name, email, password } = data;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
