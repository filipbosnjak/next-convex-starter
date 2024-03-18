import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {api} from "@/convex/_generated/api";
import {fetchQuery} from "convex/nextjs";

export const credentialsProvider = CredentialsProvider({
  type: "credentials",
  id: "credentials",
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" },
  },
  //@ts-ignore
  async authorize(credentials, request) {
    try {
      const foundUser = await fetchQuery(api.users.getUser, {username: credentials?.email || ""})
      if (foundUser) {
        // compare the password from the form with the stored password
        const passwordsMatch = await bcrypt.compare(
          credentials?.password || "",
          foundUser?.password || "",
        );
        if (!passwordsMatch) {
          console.log("passwords don't match");
          return null;
        }
        return {
          email: foundUser.email,
          name: foundUser.username,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log("error: ", error);
    }
    return { error: "No user found" };
  },
});
