import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"
import { generatePdf } from "~/lib/utils/pdf-reports"

const employeeSchema = z.object({
  employeeName: z.string().min(2).max(100),
  fatherName: z.string().min(2).max(100),
  gender: z.enum(["MALE", "FEMALE", "CUSTOM"]),
  dob: z.string(),
  cnic: z.string().length(15),
  maritalStatus: z.enum(["Married", "Unmarried", "Widow", "Divorced"]),
  doj: z.string(),
  designation: z.enum(["Principal", "Admin", "Head", "Clerk", "Teacher", "Worker"]),
  residentialAddress: z.string(),
  mobileNo: z.string().max(13),
  additionalContact: z.string().max(13).optional(),
  education: z.string().min(2).max(100),
  profilePic: z.string().optional(),
  cv: z.string().optional(),
})

export const EmployeeRouter = createTRPCRouter({
  getEmployees: publicProcedure.query(async ({ ctx }) => {
    try {
      const employees = await ctx.db.employees.findMany()
      return employees
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      })
    }
  }),

  getUnAllocateEmployees: publicProcedure.query(async ({ ctx }) => {
    try {
      const employees = await ctx.db.employees.findMany({
        where: {
          isAssign: false
        }
      })
      return employees
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Something went wrong.",
      })
    }
  }),

  createEmployee: publicProcedure.input(employeeSchema).mutation(async ({ ctx, input }) => {
    try {
      // Generate registration number
      const currentYear = new Date().getFullYear().toString().slice(-2)
      const latestEmployee = await ctx.db.employees.findFirst({
        where: {
          registrationNumber: {
            startsWith: `MSNF${currentYear}`,
          },
        },
        orderBy: {
          registrationNumber: "desc",
        },
      })
      let newRegNumber
      if (latestEmployee) {
        const latestNumber = Number.parseInt(latestEmployee.registrationNumber.slice(-3))
        newRegNumber = `MSNF${currentYear}${(latestNumber + 1).toString().padStart(3, "0")}`
      } else {
        newRegNumber = `MSNF${currentYear}001`
      }

      // Generate admission number
      const latestAdmission = await ctx.db.employees.findFirst({
        orderBy: {
          admissionNumber: "desc",
        },
      })
      let newAdmissionNumber
      if (latestAdmission) {
        const latestNumber = Number.parseInt(latestAdmission.admissionNumber.slice(-3))
        newAdmissionNumber = `${currentYear}${(latestNumber + 1).toString().padStart(3, "0")}`
      } else {
        newAdmissionNumber = `${currentYear}001`
      }

      const newEmployee = await ctx.db.employees.create({
        data: {
          ...input,
          registrationNumber: newRegNumber,
          admissionNumber: newAdmissionNumber,
        },
      })
      return newEmployee
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      })
    }
  }),

  deleteEmployeesByIds: publicProcedure
    .input(
      z.object({
        employeeIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.employees.deleteMany({
          where: {
            employeeId: {
              in: input.employeeIds,
            },
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        })
      }
    }),

  getEmployeesByDesignation: publicProcedure
    .input(
      z.object({
        designation: z.enum(["Principal", "Admin", "Head", "Clerk", "Teacher", "Worker"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.employees.findMany({
          where: {
            designation: input.designation,
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        })
      }
    }),

    generateEmployeeReport: publicProcedure
  .query(async ({ ctx }) => {
    const employees = await ctx.db.employees.findMany()
    return {
      pdf: await generatePdf(
        employees,
        ['EmployeeId', 'EmployeeName', 'Designation', 'RegistrationNumber'],
        'Employee Report'
      )
    }
  }),
})


