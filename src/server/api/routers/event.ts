import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { type Prisma } from '@prisma/client';
import { AttendeeStatusSchema, CreateEventSchema, EventStatusSchema, UpdateEventSchema } from '~/lib/event-schemas';
import { safeTransformEventForDatabase, safeTransformEventForFrontend } from '~/lib/event-helpers';

export const EventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateEventSchema)
    .mutation(async ({ ctx, input }) => {
      const eventData = safeTransformEventForDatabase(input);
      const event = await ctx.db.event.create({
        data: {
          ...eventData,
          User: { connect: { id: input.creatorId } },
          tags: input.tagIds
            ? {
                create: input.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
          reminders: input.reminders
            ? {
                create: input.reminders.map((reminder) => ({
                  type: reminder.type,
                  minutesBefore: reminder.value,
                })),
              }
            : undefined,
          attendees: input.attendees
            ? {
                create: input.attendees.map((attendee) => ({
                  user: { connect: { id: attendee.userId } },
                  status: attendee.status,
                })),
              }
            : undefined,
        },
        include: {
          User: true,
          tags: { include: { tag: true } },
          attendees: { include: { user: true } },
          reminders: true,
        },
      });
      return safeTransformEventForFrontend(event);
    }),

  update: protectedProcedure
    .input(UpdateEventSchema)
    .mutation(async ({ ctx, input }) => {
      const eventData = safeTransformEventForDatabase(input);
      const event = await ctx.db.event.update({
        where: { id: input.id },
        data: {
          ...eventData,
          User: { connect: { id: input.creatorId } },
          tags: input.tagIds
            ? {
                deleteMany: {},
                create: input.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
          reminders: input.reminders
            ? {
                deleteMany: {},
                create: input.reminders.map((reminder) => ({
                  type: reminder.type,
                  minutesBefore: reminder.value,
                })),
              }
            : undefined,
          attendees: input.attendees
            ? {
                deleteMany: {},
                create: input.attendees.map((attendee) => ({
                  user: { connect: { id: attendee.userId } },
                  status: attendee.status,
                })),
              }
            : undefined,
        },
        include: {
          User: true,
          tags: { include: { tag: true } },
          attendees: { include: { user: true } },
          reminders: true,
        },
      });
      return safeTransformEventForFrontend(event);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
        include: {
          User: true,
          tags: { include: { tag: true } },
          attendees: { include: { user: true } },
          reminders: true,
        },
      });
      if (!event) {
        throw new Error('Event not found');
      }
      return safeTransformEventForFrontend(event);
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: EventStatusSchema.optional(),
        offset: z.number().int().nonnegative().default(0),
        limit: z.number().int().positive().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.EventWhereInput = {
        AND: [
          input.search
            ? {
                OR: [
                  { title: { contains: input.search, mode: 'insensitive' } },
                  { description: { contains: input.search, mode: 'insensitive' } },
                  { location: { contains: input.search, mode: 'insensitive' } },
                ],
              }
            : {},
          input.status ? { status: input.status } : {},
        ],
      };

      const [events, total] = await Promise.all([
        ctx.db.event.findMany({
          where,
          include: {
            User: true,
            tags: { include: { tag: true } },
            attendees: { include: { user: true } },
            reminders: true,
          },
          skip: input.offset,
          take: input.limit,
        }),
        ctx.db.event.count({ where }),
      ]);

      return {
        events: events.map(safeTransformEventForFrontend),
        total,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.event.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  updateAttendeeStatus: protectedProcedure
    .input(
      z.object({
        eventId: z.string().min(1),
        userId: z.string().min(1),
        status: AttendeeStatusSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attendee = await ctx.db.attendee.upsert({
        where: {
          eventId_userId: { eventId: input.eventId, userId: input.userId },
        },
        update: { status: input.status },
        create: {
          eventId: input.eventId,
          userId: input.userId,
          status: input.status,
        },
        include: { user: true },
      });
      return { userId: attendee.userId, status: attendee.status };
    }),

  createTag: protectedProcedure
    .input(z.object({ name: z.string().min(1), color: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tag = await ctx.db.tag.create({
        data: { name: input.name, color: input.color },
      });
      return { id: tag.id, name: tag.name, color: tag.color };
    }),

  getTags: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.tag.findMany();
  }),
});