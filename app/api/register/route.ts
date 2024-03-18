import { NextRequest, NextResponse } from "next/server";
import { RegisterInput } from "@/app/register/components/RegisterAuthForm";
import bcrypt from "bcrypt";
import {api} from "@/convex/_generated/api";
import {fetchMutation, fetchQuery} from "convex/nextjs";

export type RegisterResponse = {
  message: string;
};
export async function POST(
  req: NextRequest,
  res: NextResponse<RegisterResponse>,
) {
  const userInput = (await req.json()) as RegisterInput;
  console.log(userInput)
  const foundUser = await fetchQuery(api.users.getUser, {username: userInput?.email || ""})
  if (foundUser) {
    console.log(`User already exists: ${foundUser.email}`);
    return Response.json(
      {
        message: "User already exists",
      },
      {
        status: 400,
      },
    );
  } else {
    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    await fetchMutation(api.users.createUser, {
      username: userInput.email,
      password: hashedPassword,
      email: userInput.email,
    });
    console.log("user created");
    return Response.json(
      {
        message: "User created",
      },
      {
        status: 200,
      },
    );
  }
}
