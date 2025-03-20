import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const AlotmentRouter = createTRPCRouter({
  addToClass: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        studentId: z.string(),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.classes.findUniqueOrThrow({ where: { classId: input.classId }});
      await ctx.db.students.findUniqueOrThrow({ where: { studentId: input.studentId }});
      await ctx.db.sessions.findUniqueOrThrow({ where: { sessionId: input.sessionId }});

      try {
        await ctx.db.students.update({
          where: { studentId: input.studentId },
          data: { isAssign: true },
        });

        await ctx.db.studentClass.create({
          data: {
            classId: input.classId,
            studentId: input.studentId,
            sessionId: input.sessionId,
          },
        });
      } catch (error) {
        console.error("Error adding to class:", error);
        throw new Error("Unable to add student to class.");
      }
    }),

  getStudentsInClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.studentClass.findMany({
          where: { classId: input.classId },
          include: {
            class: true,
            student: true,
            session: true,
          },
        });
        return data;
      } catch (error) {
        console.error("Error fetching students in class:", error);
        throw new Error("Unable to fetch students for the class.");
      }
    }),

    getStudentsByClassAndSession: publicProcedure
    .input(z.object({ classId: z.string(), sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.studentClass.findMany({
          where: { classId: input.classId, sessionId: input.sessionId },
          include: {
            class: true,
            student: true,
            session: true,
          },
        });
        return data;
      } catch (error) {
        console.error("Error fetching students in class:", error);
        throw new Error("Unable to fetch students for the class.");
      }
    }),
    

    deleteStudentsFromClass: publicProcedure
  .input(z.object({
    studentIds: z.array(z.string()),
    classId: z.string(),
    sessionId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      return ctx.db.$transaction(async (tx) => {
        // First find the studentClass IDs to delete
        const studentClasses = await tx.studentClass.findMany({
          where: {
            studentId: { in: input.studentIds },
            classId: input.classId,
            sessionId: input.sessionId,
          },
          select: { scId: true }
        });

        const studentClassIds = studentClasses.map(studentClasses => studentClasses.scId);

        // Delete dependent FeeStudentClass records first
        await tx.feeStudentClass.deleteMany({
          where: {
            studentClassId: { in: studentClassIds }
          }
        });

        // Then remove student-class associations
        await tx.studentClass.deleteMany({
          where: {
            studentId: { in: input.studentIds },
            classId: input.classId,
            sessionId: input.sessionId,
          },
        });

        // Update student assignment status
        await tx.students.updateMany({
          where: { studentId: { in: input.studentIds } },
          data: { isAssign: false },
        });

        return { 
          success: true, 
          message: `Successfully removed ${input.studentIds.length} students from class` 
        };
      });
    } catch (error) {
      console.error("Error removing students:", error);
      throw new Error("Failed to remove students from class. Please verify the provided information.");
    }
  }),
});