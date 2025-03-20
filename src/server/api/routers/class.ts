import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ClassCategory, type classes as PrismaClass } from "@prisma/client";
import { generatePdf } from "~/lib/utils/pdf-reports";

type ClassProps = PrismaClass;

export const ClassRouter = createTRPCRouter({
  getClasses: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.classes.findMany();
    } catch (error) {
      console.error("Error in getClasses:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve classes." });
    }
  }),

  getGroupedClasses: publicProcedure.query(async ({ ctx }) => {
    try {
      const classes = await ctx.db.classes.findMany();
      const groupedClasses: Record<ClassCategory, ClassProps[]> = {
        Montessori: [],
        Primary: [],
        Middle: [],
        SSC_I: [],
        SSC_II: [],
      };

      classes.forEach((classData) => {
        groupedClasses[classData.category]?.push(classData);
      });

      return groupedClasses;
    } catch (error) {
      console.error("Error in getGroupedClasses:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve grouped classes." });
    }
  }),

  createClass: publicProcedure
    .input(
      z.object({
        grade: z.string(),
        section: z.enum(["ROSE", "TULIP"]).optional(),
        category: z.nativeEnum(ClassCategory),
        fee: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.classes.create({
          data: input,
        });
      } catch (error) {
        console.error("Error in createClass:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create class." });
      }
    }),

  deleteClassesByIds: publicProcedure
    .input(z.object({ classIds: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.classes.deleteMany({
          where: { classId: { in: input.classIds } },
        });
      } catch (error) {
        console.error("Error in deleteClassesByIds:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete classes." });
      }
    }),

    // Add to ClassRouter
generateClassReport: publicProcedure
.query(async ({ ctx }) => {
  const classes = await ctx.db.classes.findMany()
  return {
    pdf: await generatePdf(
      classes,
      ['ClassId', 'Grade', 'Section', 'Category', 'Fee'],
      'Class Report'
    )
  }
}),
});
