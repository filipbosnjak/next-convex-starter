import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    from: v.id("users"),
    to: v.id("users"),
    subject: v.string(),
    read: v.boolean(),
    body: v.string(),
    labels: v.array(v.string()),
    user: v.id("users"),
  }),
  users: defineTable({
    email: v.optional(v.string()),
    username: v.string(),
    password: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
