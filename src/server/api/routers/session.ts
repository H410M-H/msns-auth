import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { type AcademicSession } from "~/app/types"; // Updated import

export const SessionRouter = createTRPCRouter({
  getActiveSession: publicProcedure.query<AcademicSession | null>(async ({ ctx }) => {
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
      return session ? { ...session } : null;
    } catch (error) {
      console.error("Error in getActiveSession:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve active session",
      });
    }
  }),

  getSessions: publicProcedure.query<AcademicSession[]>(async ({ ctx }) => {
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
      return sessions.map(s => ({ ...s }));
    } catch (error) {
      console.error("Error in getSessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve sessions",
      });
    }
  }),

  getGroupedSessions: publicProcedure.query<{ year: string; sessions: AcademicSession[] }[]>(
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
          const year = new Date(session.sessionFrom).getFullYear().toString();
          const existing = acc.get(year) ?? [];
          acc.set(year, [...existing, session]);
          return acc;
        }, new Map<string, AcademicSession[]>());
  
        return Array.from(groupedSessions, ([year, sessions]) => ({
          year,
          sessions: sessions.map(s => ({ ...s })),
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
        sessionFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
        sessionTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
      })
    )
    .mutation<AcademicSession>(async ({ ctx, input }) => {
      try {
        const newSession = await ctx.db.sessions.create({
          data: {
            sessionName: input.sessionName,
            sessionFrom: input.sessionFrom,
            sessionTo: input.sessionTo,
            isActive: false,
          },
        });
        return { ...newSession };
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
    .mutation<{ count: number }>(async ({ ctx, input }) => {
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
    .mutation<AcademicSession>(async ({ ctx, input }) => {
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

        return activatedSession as AcademicSession;
      } catch (error) {
        console.error("Error in setActiveSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set active session",
        });
      }
    }),
});