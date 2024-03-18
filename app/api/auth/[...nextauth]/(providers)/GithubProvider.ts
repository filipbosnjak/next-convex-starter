import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import { TokenSetParameters } from "openid-client";
import {fetchMutation, fetchQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";

export const githubProvider = GitHubProvider({
  profile: async (profile: GithubProfile, tokens: TokenSetParameters) => {
    // Connect to the database
    // Check if a user exists in the database
    // If so, return the user object
    // If not, create a new user object and save it to the database
    // Return the user object

    const foundUser = await fetchQuery(api.users.getUser, {username: profile?.email || ""})

    if (foundUser) {
      return {
        id: foundUser._id.toString() || "",
        name: foundUser.username,
        email: foundUser.email,
        image: profile.avatar_url,
      };
    } else {
      const newUser = await fetchMutation(api.users.createUser,{
        username: profile?.email || "",
        password: "github",
        email: profile?.email || "",

      })

      return {
        id: newUser?._id.toString() || "",
        name: newUser?.username,
        email: newUser?.email,
        image: profile.avatar_url,
      };
    }
  },
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
});
