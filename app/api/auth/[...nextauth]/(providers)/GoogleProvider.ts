import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import {fetchMutation, fetchQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {User} from "next-auth";

export const googleProvider = GoogleProvider({
  //Google provider - if the user exists, return the user, if not, create a new user
  async profile(profile: GoogleProfile) {

    const foundUser = await fetchQuery(api.users.getUser, {username: profile?.email || ""})

    if (foundUser) {
      return {
        id: foundUser._id.toString(),
        name: foundUser.username,
        email: foundUser.email,
        image: profile.picture,
      } as User;
    } else {
      const newUser = await fetchMutation(api.users.createUser,{
        username: profile?.email || "",
        password: "google",
        email: profile?.email || "",
      });

      return {
        id: newUser?._id.toString() || "",
        username: profile?.email || "",
        password: "google",
        email: profile?.email || "",
        image: profile.picture,
      };
    }
  },
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
});
