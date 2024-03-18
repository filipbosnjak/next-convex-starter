import {internalMutation, internalQuery, mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const getAllUsers = query({
  args: {},
  handler: async (ctx, args) => {
    return ctx.db.query("users").collect();
  },
})

export const getUser = query({
  args: {username: v.string()},
  handler: async (ctx, args) => {
    return ctx.db.query("users")
      .filter(user => user.eq(user.field("username"), args.username))
      .first();
  }
})

export const createUser = mutation({
  args: { username: v.string(), password: v.string(), email: v.string() },
  handler: async (ctx, {username, password, email}) => {
    const usrId = await ctx.db.insert("users", { username: username, password, email, tokenIdentifier: crypto.randomUUID() });
    return await ctx.db.get(usrId)
  },
});

