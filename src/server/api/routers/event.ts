import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { 
  CreateEventSchema,
  EventQuerySchema,
  DeleteEventSchema,
  AddAttendeeSchema,
  UpdateAttendeeStatusSchema,
  CreateTagSchema,
  UpdateTagSchema,
  EventTypeSchema,
  PrioritySchema} from "../schemas/event";

export const EventRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(CreateEventSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Convert date/time strings to Date objects
        const startDateTime = new Date(`${input.date}T${input.startTime}:00`);
        const endDateTime = new Date(`${input.date}T${input.endTime}:00`);
        
        // Create event with related data
        const event = await ctx.db.event.create({
          data: {
            title: input.title,
            description: input.description,
            startDateTime,
            endDateTime,
            timezone: input.timezone,
            location: input.location,
            isOnline: input.isOnline,
            type: input.type,
            priority: input.priority,
            status: input.status,
            recurring: input.recurring,
            recurrenceEnd: input.recurrenceEnd ? new Date(input.recurrenceEnd) : null,
            maxAttendees: input.maxAttendees,
            isPublic: input.isPublic,
            notes: input.notes,
            
            // Handle tags
            tags: {
              connect: input.tagIds.map(id => ({ id }))
            },
            
            // Handle reminders
            reminders: {
              create: input.reminders.map(reminder => ({
                type: reminder.type,
                minutesBefore: reminder.value,
              }))
            }
          },
        });
        
        return event;
      } catch (error) {
        console.error("Error creating event:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create event",
        });
      }
    }),

  getEvents: publicProcedure
    .input(EventQuerySchema)
    .query(async ({ ctx, input }) => {
      try {
        const where: any = {};
        
        // Date range filtering
        if (input.startDate && input.endDate) {
          where.startDateTime = {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          };
        }
        
        // Other filters
        if (input.type) where.type = input.type;
        if (input.priority) where.priority = input.priority;
        if (input.status) where.status = input.status;
        if (input.creatorId) where.creatorId = input.creatorId;
        
        // Text search
        if (input.search) {
          where.OR = [
            { title: { contains: input.search, mode: 'insensitive' } },
            { description: { contains: input.search, mode: 'insensitive' } },
            { location: { contains: input.search, mode: 'insensitive' } },
          ];
        }
        
        const events = await ctx.db.event.findMany({
          where,
          skip: input.offset,
          take: input.limit,
          include: {
            tags: true,
            attendees: true,
            reminders: true,
          },
          orderBy: {
            startDateTime: 'asc',
          },
        });
        
        return events;
      } catch (error) {
        console.error("Error fetching events:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve events",
        });
      }
    }),

  deleteEvent: publicProcedure
    .input(DeleteEventSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Delete related records first
        await ctx.db.$transaction([
          ctx.db.reminder.deleteMany({ where: { eventId: input.id } }),
          ctx.db.attendee.deleteMany({ where: { eventId: input.id } }),
          ctx.db.eventTag.deleteMany({ where: { eventId: input.id } }),
        ]);
        
        // Then delete the event
        const deletedEvent = await ctx.db.event.delete({
          where: { id: input.id },
        });
        
        return deletedEvent;
      } catch (error) {
        console.error("Error deleting event:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete event",
        });
      }
    }),

  addAttendee: publicProcedure
    .input(AddAttendeeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check event exists
        const event = await ctx.db.event.findUnique({
          where: { id: input.eventId },
          select: { maxAttendees: true, _count: { select: { attendees: true } } },
        });
        
        if (!event) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
          });
        }
        
        // Check capacity
        if (event.maxAttendees && event._count.attendees >= event.maxAttendees) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event is at full capacity",
          });
        }
        
        // Add attendee
        const attendee = await ctx.db.attendee.upsert({
          where: {
            eventId_userId: {
              eventId: input.eventId,
              userId: input.userId,
            },
          },
          update: { status: input.status },
          create: {
            status: input.status,
            event: { connect: { id: input.eventId } },
            user: { connect: { id: input.userId } },
          },
        });
        
        return attendee;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error adding attendee:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add attendee",
        });
      }
    }),

  updateAttendeeStatus: publicProcedure
    .input(UpdateAttendeeStatusSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const attendee = await ctx.db.attendee.update({
          where: {
            eventId_userId: {
              eventId: input.eventId,
              userId: input.userId,
            },
          },
          data: { status: input.status },
        });
        
        if (!attendee) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Attendee record not found",
          });
        }
        
        return attendee;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error("Error updating attendee status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update attendee status",
        });
      }
    }),

  createTag: publicProcedure
    .input(CreateTagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.db.tag.create({
          data: {
            name: input.name,
            color: input.color,
          },
        });
        
        return tag;
      } catch (error) {
        console.error("Error creating tag:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tag",
        });
      }
    }),

  updateTag: publicProcedure
    .input(UpdateTagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const tag = await ctx.db.tag.update({
          where: { id: input.id },
          data: {
            name: input.name,
            color: input.color,
          },
        });
        
        return tag;
      } catch (error) {
        console.error("Error updating tag:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update tag",
        });
      }
    }),

  // Additional useful procedures
  getEventTypes: publicProcedure.query(() => {
    return EventTypeSchema.options;
  }),

  getPriorityLevels: publicProcedure.query(() => {
    return PrioritySchema.options;
  }),
});