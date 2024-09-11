import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
export const current = query({
  args: {},
  handler: async (c) => {
    const userId = await getAuthUserId(c);
    if (null === userId) {
      return null;
    }

    return await c.db.get(userId);
  },
});
