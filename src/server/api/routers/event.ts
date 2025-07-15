import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { prisma } from "../../prisma"
import {
  CreateEventSchema,
  UpdateEventSchema,
  EventQuerySchema,
  DeleteEventSchema,
  AddAttendeeSchema,
  UpdateAttendeeStatusSchema,
} from "../../validations/event"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  // Create a new event
  create: publicProcedure.input(CreateEventSchema).mutation(async ({ input }) => {
    const { reminders, tagIds, ...eventData } = input

    try {
      const event = await prisma.event.create({
        data: {
          ...eventData,
          date: new Date(input.date),
          recurrenceEnd: input.recurrenceEnd ? new Date(input.recurrenceEnd) : null,
          // For now, we'll use a default creator - in real app, get from auth context
          creatorId: "default-user-id",
          reminders: {
            create: reminders.map((reminder) => ({
              type: reminder.type,
              value: reminder.value,
            })),
          },
          tags: {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          },
        },
        include: {
          creator: true,
          attendees: {
            include: {
              user: true,
            },
          },
          reminders: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      return event
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create event",
      })
    }
  }),

  // Get events with filtering
  list: publicProcedure.input(EventQuerySchema).query(async ({ input }) => {
    const { startDate, endDate, type, priority, status, creatorId, search, limit, offset } = input

    try {
      const where: any = {}

      // Date range filter
      if (startDate || endDate) {
        where.date = {}
        if (startDate) where.date.gte = new Date(startDate)
        if (endDate) where.date.lte = new Date(endDate)
      }

      // Other filters
      if (type) where.type = type
      if (priority) where.priority = priority
      if (status) where.status = status
      if (creatorId) where.creatorId = creatorId

      // Search filter
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ]
      }

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          include: {
            creator: true,
            attendees: {
              include: {
                user: true,
              },
            },
            reminders: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
          take: limit,
          skip: offset,
        }),
        prisma.event.count({ where }),
      ])

      return {
        events,
        total,
        hasMore: offset + limit < total,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch events",
      })
    }
  }),

  // Get single event by ID
  getById: publicProcedure.input(z.object({ id: z.string().cuid() })).query(async ({ input }) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: input.id },
        include: {
          creator: true,
          attendees: {
            include: {
              user: true,
            },
          },
          reminders: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }

      return event
    } catch (error) {
      if (error instanceof TRPCError) throw error

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch event",
      })
    }
  }),

  // Update an event
  update: publicProcedure.input(UpdateEventSchema).mutation(async ({ input }) => {
    const { id, reminders, tagIds, ...updateData } = input

    try {
      // Check if event exists
      const existingEvent = await prisma.event.findUnique({
        where: { id },
      })

      if (!existingEvent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }

      const event = await prisma.event.update({
        where: { id },
        data: {
          ...updateData,
          date: updateData.date ? new Date(updateData.date) : undefined,
          recurrenceEnd: updateData.recurrenceEnd ? new Date(updateData.recurrenceEnd) : undefined,
          // Handle reminders update
          ...(reminders && {
            reminders: {
              deleteMany: {},
              create: reminders.map((reminder) => ({
                type: reminder.type,
                value: reminder.value,
              })),
            },
          }),
          // Handle tags update
          ...(tagIds && {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            },
          }),
        },
        include: {
          creator: true,
          attendees: {
            include: {
              user: true,
            },
          },
          reminders: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      return event
    } catch (error) {
      if (error instanceof TRPCError) throw error

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update event",
      })
    }
  }),

  // Delete an event
  delete: publicProcedure.input(DeleteEventSchema).mutation(async ({ input }) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: input.id },
      })

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }

      await prisma.event.delete({
        where: { id: input.id },
      })

      return { success: true }
    } catch (error) {
      if (error instanceof TRPCError) throw error

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete event",
      })
    }
  }),

  // Add attendee to event
  addAttendee: publicProcedure.input(AddAttendeeSchema).mutation(async ({ input }) => {
    try {
      const attendee = await prisma.eventAttendee.create({
        data: input,
        include: {
          user: true,
          event: true,
        },
      })

      return attendee
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to add attendee",
      })
    }
  }),

  // Update attendee status
  updateAttendeeStatus: publicProcedure.input(UpdateAttendeeStatusSchema).mutation(async ({ input }) => {
    try {
      const attendee = await prisma.eventAttendee.update({
        where: {
          eventId_userId: {
            eventId: input.eventId,
            userId: input.userId,
          },
        },
        data: {
          status: input.status,
        },
        include: {
          user: true,
          event: true,
        },
      })

      return attendee
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update attendee status",
      })
    }
  }),

  // Get events for a specific date range (for calendar view)
  getForDateRange: publicProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        userId: z.string().cuid().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const where: any = {
          date: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        }

        if (input.userId) {
          where.OR = [{ creatorId: input.userId }, { attendees: { some: { userId: input.userId } } }]
        }

        const events = await prisma.event.findMany({
          where,
          include: {
            creator: true,
            attendees: {
              include: {
                user: true,
              },
            },
            reminders: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
        })

        return events
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch events for date range",
        })
      }
    }),
})
