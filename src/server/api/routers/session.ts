import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const SessionRouter = createTRPCRouter({
  getActiveSession: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.sessions.findFirst({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      console.error("Error in getActiveSession:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve active session.",
      });
    }
  }),

  getSessions: publicProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.db.sessions.findMany({
        orderBy: { sessionFrom: "desc" },
      });
      return sessions;
    } catch (error) {
      console.error("Error in getSessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve sessions.",
      });
    }
  }),

  getGroupedSessions: publicProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.db.sessions.findMany({
        orderBy: { sessionFrom: "desc" },
      });
      const groupedSessions = new Map<string, SessionProps[]>();

      sessions.forEach((sessionData) => {
        const key = new Date(sessionData.sessionFrom).getFullYear().toString();
        const existingData = groupedSessions.get(key) ?? [];
        groupedSessions.set(key, [...existingData, { ...sessionData, isActive: false }]);
      });

      return Array.from(groupedSessions, ([year, sessions]) => ({
        year,
        sessions,
      }));
    } catch (error) {
      console.error("Error in getGroupedSessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve grouped sessions.",
      });
    }
  }),

  createSession: publicProcedure
    .input(
      z.object({
        sessionName: z.string(),
        sessionFrom: z.string(),
        sessionTo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.sessions.create({
          data: {
            sessionName: input.sessionName,
            sessionFrom: input.sessionFrom,
            sessionTo: input.sessionTo,
          },
        });
      } catch (error) {
        console.error("Error in createSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create session.",
        });
      }
    }),

  deleteSessionsByIds: publicProcedure
    .input(
      z.object({
        sessionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.sessions.deleteMany({
          where: {
            sessionId: {
              in: input.sessionIds,
            },
          },
        });
      } catch (error) {
        console.error("Error in deleteSessionsByIds:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete sessions.",
        });
      }
    }),

  setActiveSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Deactivate all existing active sessions
        await ctx.db.sessions.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        // Activate the specified session
        return await ctx.db.sessions.update({
          where: { sessionId: input.sessionId },
          data: { isActive: true },
        });
      } catch (error) {
        console.error("Error in setActiveSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set active session.",
        });
      }
    }),
});