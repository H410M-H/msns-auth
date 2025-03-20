// subject.ts
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const subjectSchema = z.object({
  subjectId: z.string(),
  subjectName: z.string(),
  book: z.string().nullish(),
  description: z.string().nullish(),
});

export const SubjectRouter = createTRPCRouter({
  createSubject: publicProcedure
    .input(
      z.object({
        subjectName: z.string().min(2, "Subject name must be at least 2 characters"),
        book: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .output(subjectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.subject.create({
          data: {
            subjectName: input.subjectName,
            book: input.book ?? null,
            description: input.description ?? null,
          },
        });
      } catch (error) {
        console.error("Error creating subject:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subject",
        });
      }
    }),

  deleteSubject: publicProcedure
    .input(z.object({ subjectId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.subject.delete({
          where: { subjectId: input.subjectId },
        });
      } catch (error) {
        console.error("Error deleting subject:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete subject",
        });
      }
    }),

  getAllSubjects: publicProcedure
    .output(z.array(subjectSchema))
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.subject.findMany({
          orderBy: { subjectName: "asc" },
        });
      } catch (error) {
        console.error("Error fetching subjects:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch subjects",
        });
      }
    }),
    
    
    //Remove SubjectFromClass


  assignSubjectToClass: publicProcedure
    .input(
      z.object({
        classId: z.string().min(1),
        subjectId: z.string().min(1),
        employeeId: z.string().min(1),
        sessionId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.classSubject.create({
          data: {
            classId: input.classId,
            subjectId: input.subjectId,
            employeeId: input.employeeId,
            sessionId: input.sessionId,
          },
        });
      } catch (error) {
        console.error("Error assigning subject:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assign subject to class",
        });
      }
    }),

  getSubjectsByClass: publicProcedure
    .input(
      z.object({
        classId: z.string().min(1),
        sessionId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.classSubject.findMany({
          where: {
            classId: input.classId,
            sessionId: input.sessionId,
          },
          include: {
            subject: true,
            employee: true,
            class: true,
            session: true,
          },
        });
      } catch (error) {
        console.error("Error fetching class subjects:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch class subjects",
        });
      }
    }),
    removeSubjectFromClass: publicProcedure
    .input(
      z.object({
        csId: z.string().min(1, "Assignment ID is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.classSubject.delete({
          where: {
            csId: input.csId,
          },
        });
        return { success: true, message: "Subject removed from class successfully" };
      } catch (error) {
        console.error("Error removing subject from class:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove subject from class",
        });
      }
    }),
});