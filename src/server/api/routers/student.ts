import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { generatePdf } from "~/lib/pdf-reports";
import { type Prisma } from "@prisma/client";
import { type Student } from "~/types/index";

// Helper types moved to the top
type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const studentSchema = z.object({
  studentMobile: z.string().min(11, "Invalid mobile number").max(15),
  fatherMobile: z.string().min(11, "Invalid mobile number").max(15),
  studentName: z.string().min(3, "Name too short").max(100),
  gender: z.enum(["MALE", "FEMALE", "CUSTOM"]),
  dateOfBirth: z.string().regex(dateRegex, "Invalid date format (YYYY-MM-DD)"),
  fatherName: z.string().min(3, "Name too short").max(100),
  studentCNIC: z.string().regex(cnicRegex, "Invalid CNIC format"),
  fatherCNIC: z.string().regex(cnicRegex, "Invalid CNIC format"),
  fatherProfession: z.string().max(100).optional(),
  bloodGroup: z.string().max(3).optional(),
  guardianName: z.string().max(100).optional(),
  caste: z.string().max(50),
  currentAddress: z.string().min(5, "Address too short").max(200),
  permanentAddress: z.string().min(5, "Address too short").max(500),
  medicalProblem: z.string().max(500).optional(),
  profilePic: z.string().url("Invalid URL format").optional(),
});

type StudentReportData = {
  studentId: string;
  studentName: string;
  registrationNumber: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  studentCNIC: string;
  fatherCNIC: string;
  class: string;
  section: string;
  session: string;
};

export const StudentRouter = createTRPCRouter({
  getStudents: publicProcedure.query(async ({ ctx }) => {
    try {
      const students = await ctx.db.students.findMany({
        select: {
          studentId: true,
          registrationNumber: true,
          studentMobile: true,
          fatherMobile: true,
          admissionNumber: true,
          studentName: true,
          gender: true,
          dateOfBirth: true,
          fatherName: true,
          studentCNIC: true,
          fatherCNIC: true,
          fatherProfession: true,
          bloodGroup: true,
          guardianName: true,
          caste: true,
          currentAddress: true,
          permanentAddress: true,
          medicalProblem: true,
          profilePic: true,
          isAssign: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      return students as Student[];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve students",
      });
    }
  }),
  

  getUnAllocateStudents: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
      }),
    )
    .query<{ data: Student[]; meta: PaginationMeta }>(
      async ({ ctx, input }) => {
        try {
          const where: Prisma.StudentsWhereInput = {
            isAssign: false,
            OR: input.searchTerm
              ? [
                  {
                    studentName: {
                      contains: input.searchTerm,
                      mode: "insensitive",
                    },
                  },
                  {
                    fatherName: {
                      contains: input.searchTerm,
                      mode: "insensitive",
                    },
                  },
                  {
                    admissionNumber: {
                      contains: input.searchTerm,
                      mode: "insensitive",
                    },
                  },
                ]
              : undefined,
          };

          const [students, total] = await Promise.all([
            ctx.db.students.findMany({
              where,
              skip: (input.page - 1) * input.pageSize,
              take: input.pageSize,
              orderBy: { createdAt: "desc" },
              select: {
                studentId: true,
                studentName: true,
                admissionNumber: true,
                fatherName: true,
                studentMobile: true,
                createdAt: true,
              },
            }),
            ctx.db.students.count({ where }),
          ]);

          return {
            data: students as Student[],
            meta: {
              total,
              page: input.page,
              pageSize: input.pageSize,
              totalPages: Math.ceil(total / input.pageSize),
            },
          };
        } catch (error) {
          console.error("Error fetching unallocated students:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch unassigned students",
          });
        }
      },
    ),

    createStudent: publicProcedure
    .input(studentSchema)
    .mutation<Student>(async ({ ctx, input }) => {
      try {
        const currentYear = new Date().getFullYear().toString().slice(-2);

        // Transaction for generating numbers safely
        const [newRegNumber, newAdmissionNumber] = await ctx.db.$transaction([
          ctx.db.students.findFirst({
            where: { registrationNumber: { startsWith: `MSNS${currentYear}` } },
            orderBy: { registrationNumber: "desc" },
            select: { registrationNumber: true },
          }),
          ctx.db.students.findFirst({
            where: { admissionNumber: { startsWith: `S${currentYear}` } },
            orderBy: { admissionNumber: "desc" },
            select: { admissionNumber: true },
          }),
        ]);

        const regNumberSequence = newRegNumber
          ? parseInt(newRegNumber.registrationNumber.slice(-4)) + 1
          : 1;
        const admissionNumberSequence = newAdmissionNumber
          ? parseInt(newAdmissionNumber.admissionNumber.slice(-3)) + 1
          : 1;

        const createdStudent = await ctx.db.students.create({
          data: {
            ...input,
            registrationNumber: `MSNS${currentYear}${regNumberSequence
              .toString()
              .padStart(4, "0")}`,
            admissionNumber: `S${currentYear}${admissionNumberSequence
              .toString()
              .padStart(3, "0")}`,
            dateOfBirth: input.dateOfBirth, // Already validated format
            updatedAt: new Date(), // Added required field
          },
          select: {
            studentId: true,
            registrationNumber: true,
            admissionNumber: true,
            studentName: true,
            createdAt: true,
          },
        });

        return createdStudent as Student;
      } catch (error) {
        console.error("Error creating student:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create student record",
        });
      }
    }),

  deleteStudentsByIds: publicProcedure
    .input(z.object({ studentIds: z.array(z.string().cuid()) }))
    .mutation<{ count: number }>(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.students.deleteMany({
          where: { studentId: { in: input.studentIds } },
        });
        return { count: result.count };
      } catch (error) {
        console.error("Error deleting students:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete students",
        });
      }
    }),

generateStudentReport: publicProcedure.query<{
    pdf: string;
    filename: string;
  }>(async ({ ctx }) => {
    const students = await ctx.db.students.findMany({
      select: {
        studentId: true,
        studentName: true,
        registrationNumber: true,
        admissionNumber: true,
        dateOfBirth: true,
        gender: true,
        fatherName: true,
        studentCNIC: true,
        fatherCNIC: true,
        StudentClass: {
          select: {
            Grades: { select: { grade: true, section: true } },
            Sessions: { select: { sessionName: true } },
          },
        },
      },
    });

    const reportData: StudentReportData[] = students.map((student) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      registrationNumber: student.registrationNumber,
      admissionNumber: student.admissionNumber,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      fatherName: student.fatherName,
      studentCNIC: student.studentCNIC,
      fatherCNIC: student.fatherCNIC,
      class: student.StudentClass[0]?.Grades?.grade ?? "N/A",
      section: student.StudentClass[0]?.Grades?.section ?? "N/A",
      session: student.StudentClass[0]?.Sessions?.sessionName ?? "N/A",
    }));

    const headers = [
      { key: "studentId", label: "Student ID" },
      { key: "studentName", label: "Name" },
      { key: "registrationNumber", label: "Registration #" },
      { key: "admissionNumber", label: "Admission #" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
      { key: "fatherName", label: "Father's Name" },
      { key: "studentCNIC", label: "Student CNIC" },
      { key: "fatherCNIC", label: "Father's CNIC" },
      { key: "class", label: "Class" },
      { key: "section", label: "Section" },
      { key: "session", label: "Session" },
    ];

    const pdfBuffer = await generatePdf(
      reportData,
      headers,
      "Student Directory Report",
    );

    return {
      pdf: Buffer.from(pdfBuffer).toString("base64"),
      filename: `student-report-${Date.now()}.pdf`,
    };
  }),
});
