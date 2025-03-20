import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePdf } from "~/lib/utils/pdf-reports";

const reportTypeSchema = z.enum([
  'students',
  'employees',
  'classes',
  'subjects'
]);

export const ReportRouter = createTRPCRouter({
  generateReport: publicProcedure
    .input(z.object({ reportType: reportTypeSchema }))
    .output(z.object({ 
      pdf: z.custom<Uint8Array>(data => data instanceof Uint8Array) 
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { reportType } = input;
        const title = `${reportType} Report`;

        const headers: string[] = [];

        switch (reportType) {
          case 'students': {
            const dbData = await ctx.db.students.findMany({
              select: {
                studentId: true,
                studentName: true,
                registrationNumber: true,
                admissionNumber: true,
                dateOfBirth: true,
                gender: true,
                fatherName: true,
                studentMobile: true,
                isAssign: true
              }
            });

            const studentData = dbData.map(student => ({
              ...student,
              status: student.isAssign ? 'Assigned' : 'Unassigned'
            }));

            headers.push(
              'ID',
              'Student Name',
              'Reg Number',
              'Adm Number',
              'Birth Date',
              'Gender',
              'Father Name',
              'Contact',
              'Status'
            );

            const pdf = await generatePdf(studentData, headers, title);
            return { pdf };
          }

          case 'employees': {
            const dbData = await ctx.db.employees.findMany({
              select: {
                employeeId: true,
                employeeName: true,
                designation: true,
              }
            });

            headers.push(
              'Employee ID',
              'Name',
              'Designation',
              'Salary',
              'Contact',
              'Join Date'
            );

            const pdf = await generatePdf(dbData, headers, title);
            return { pdf };
          }

          default:
            throw new Error('Invalid report type');
        }
      } catch (error) {
        console.error('Report generation failed:', error);
        throw new Error('Failed to generate report');
      }
    }),
});