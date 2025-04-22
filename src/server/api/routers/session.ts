import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// Define SessionProps interface directly here since the import isn't working
interface SessionProps {
  sessionId: string;
  sessionName: string;
  sessionFrom: Date | string;
  sessionTo: Date | string;
  isActive: boolean;
}

export const SessionRouter = createTRPCRouter({
  getActiveSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const session = await ctx.db.sessions.findFirst({
        where: { isActive: true },
        select: {
          sessionId: true,
          sessionName: true,
          sessionFrom: true,
          sessionTo: true,
          isActive: true,
        },
      });
      return session ? {
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        sessionFrom: session.sessionFrom,
        sessionTo: session.sessionTo,
        isActive: session.isActive,
      } : null;
    } catch (error) {
      console.error("Error in getActiveSession:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve active session",
      });
    }
  }),

  getSessions: publicProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await ctx.db.sessions.findMany({
        orderBy: { sessionFrom: "desc" },
        select: {
          sessionId: true,
          sessionName: true,
          sessionFrom: true,
          sessionTo: true,
          isActive: true,
        },
      });
      return sessions.map(s => ({
        sessionId: s.sessionId,
        sessionName: s.sessionName,
        sessionFrom: s.sessionFrom,
        sessionTo: s.sessionTo,
        isActive: s.isActive,
      }));
    } catch (error) {
      console.error("Error in getSessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve sessions",
      });
    }
  }),

  getGroupedSessions: publicProcedure.query(
    async ({ ctx }) => {
      try {
        const sessions = await ctx.db.sessions.findMany({
          orderBy: { sessionFrom: "desc" },
          select: {
            sessionId: true,
            sessionName: true,
            sessionFrom: true,
            sessionTo: true,
            isActive: true,
          },
        });

        const groupedSessions = sessions.reduce((acc, session) => {
          const sessionFromDate = new Date(session.sessionFrom);
          const year = sessionFromDate.getFullYear().toString();
          const existing = acc.get(year) ?? [];
          acc.set(year, [...existing, {
            sessionId: session.sessionId,
            sessionName: session.sessionName,
            sessionFrom: session.sessionFrom,
            sessionTo: session.sessionTo,
            isActive: session.isActive,
          }]);
          return acc;
        }, new Map<string, SessionProps[]>());

        return Array.from(groupedSessions, ([year, sessions]) => ({
          year,
          sessions: sessions.map(s => s),
        }));
      } catch (error) {
        console.error("Error in getGroupedSessions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve grouped sessions",
        });
      }
    }
  ),

  createSession: publicProcedure
    .input(
      z.object({
        sessionName: z.string().min(1, "Session name is required"),
        sessionFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
        sessionTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newSession = await ctx.db.sessions.create({
          data: {
            sessionName: input.sessionName,
            sessionFrom: new Date(input.sessionFrom).toISOString(),
            sessionTo: new Date(input.sessionTo).toISOString(),
            isActive: false,
          },
          select: {
            sessionId: true,
            sessionName: true,
            sessionFrom: true,
            sessionTo: true,
            isActive: true,
          }
        });
        return {
          sessionId: newSession.sessionId,
          sessionName: newSession.sessionName,
          sessionFrom: newSession.sessionFrom,
          sessionTo: newSession.sessionTo,
          isActive: newSession.isActive,
        };
      } catch (error) {
        console.error("Error in createSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create session",
        });
      }
    }),

  deleteSessionsByIds: publicProcedure
    .input(z.object({ sessionIds: z.array(z.string().cuid()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.sessions.deleteMany({
          where: { sessionId: { in: input.sessionIds } },
        });
        return { count: result.count };
      } catch (error) {
        console.error("Error in deleteSessionsByIds:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete sessions",
        });
      }
    }),

  setActiveSession: publicProcedure
    .input(z.object({ sessionId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.sessions.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });

        const activatedSession = await ctx.db.sessions.update({
          where: { sessionId: input.sessionId },
          data: { isActive: true },
          select: {
            sessionId: true,
            sessionName: true,
            sessionFrom: true,
            sessionTo: true,
            isActive: true,
          },
        });

        return {
          sessionId: activatedSession.sessionId,
          sessionName: activatedSession.sessionName,
          sessionFrom: activatedSession.sessionFrom,
          sessionTo: activatedSession.sessionTo,
          isActive: activatedSession.isActive,
        };
      } catch (error) {
        console.error("Error in setActiveSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set active session",
        });
      }
    }),
});