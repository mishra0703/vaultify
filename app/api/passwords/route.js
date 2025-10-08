import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import Data from "@/app/models/Data";
import connectDB from "@/db/connectDb";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_SECRET;

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const passwords = await Data.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    const decryptedPasswords = passwords.map((pwd) => ({
      ...pwd.toObject(),
      password: CryptoJS.AES.decrypt(pwd.password, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      ),
    }));

    return Response.json(
      { success: true, data: decryptedPasswords },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url, username, password, remarks } = await req.json();

    if (!url || !username || !password) {
      return Response.json(
        { success: false, message: "URL, username, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      SECRET_KEY
    ).toString();

    const newPassword = await Data.create({
      userId: session.user.id,
      url,
      username,
      password: encryptedPassword,
      remarks: remarks || "",
    });

    const responseData = {
      ...newPassword.toObject(),
      password: password,
    };

    return Response.json(
      { success: true, data: responseData },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Password ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedPassword = await Data.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedPassword) {
      return Response.json(
        { success: false, message: "Password not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Password deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = body.id || body._id;
    const { url, username, password, remarks } = body;

    if (!id || !url || !username || !password) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      SECRET_KEY
    ).toString();

    const updated = await Data.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        url,
        username,
        password: encryptedPassword,
        remarks: remarks || "",
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { success: false, message: "Password not found" },
        { status: 404 }
      );
    }

    const responseData = {
      ...updated.toObject(),
      password,
    };

    return Response.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
