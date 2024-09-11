import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  return Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
};

export const create = mutation({
  args: { name: v.string() },
  handler: async (c, { name }) => {
    const userId = await getAuthUserId(c);
    if (!userId) throw new Error("Unauthorized");
    const joinCode = generateCode();
    const workspaceId = await c.db.insert("workspaces", {
      name,
      userId,
      joinCode,
    });

    await c.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (c) => {
    const userId = await getAuthUserId(c);
    if (!userId) return [];

    const members = await c.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((m) => m.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await c.db.get(workspaceId);
      if (workspace) workspaces.push(workspace);
    }
    return workspaces;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (c, { id }) => {
    const userId = await getAuthUserId(c);
    if (!userId) throw new Error("Unauthorized");

    const member = await c.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", id).eq("userId", userId)
      ).unique;

    if (!member) return null;
    return await c.db.get(id);
  },
});
