"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import EventModal from "./event-modal"
import EventColorLegend from "./event-color-legend"
import SampleEvents from "./sample-events"
import EventDetailsModal, { type EventDetails } from "./event-details-modal"
import CalendarDateCell from "./calender-date-cell"
import { getEventsForDate } from "./event-utils"
import DateEventsModal from "./date-events-modal"


// Sample events data - in a real app, this would come from your data store
const SAMPLE_EVENTS_DATA: EventDetails[] = [
  {
    id: 1,
    title: "Team Standup",
    description: "Daily standup meeting to discuss progress, blockers, and plan for the day.",
    type: "meeting",
    date: "2025-07-05",
    startTime: "09:00",
    endTime: "09:30",
    location: "Conference Room A",
    attendees: 8,
    priority: "medium",
    recurring: "daily",
    organizer: "Sarah Johnson",
    status: "confirmed",
    reminders: ["15 minutes before", "5 minutes before"],
    notes: "Please prepare your updates beforehand.",
  },
  {
    id: 2,
    title: "React Workshop",
    description: "Comprehensive workshop covering React hooks, state management, and best practices.",
    type: "workshop",
    date: "2025-07-05",
    startTime: "14:00",
    endTime: "17:00",
    location: "Training Center",
    attendees: 25,
    priority: "high",
    recurring: "none",
    organizer: "Mike Chen",
    status: "confirmed",
    reminders: ["1 day before", "1 hour before"],
    notes: "Bring your laptop with Node.js installed.",
  },
  {
    id: 3,
    title: "Tech Conference 2025",
    description: "Annual technology conference featuring keynote speakers and technical sessions.",
    type: "conference",
    date: "2025-07-06",
    startTime: "09:00",
    endTime: "18:00",
    location: "Convention Center",
    attendees: 500,
    priority: "high",
    recurring: "yearly",
    organizer: "Event Team",
    status: "confirmed",
    reminders: ["1 week before", "1 day before", "2 hours before"],
    notes: "Registration required. Lunch provided.",
  },
  {
    id: 4,
    title: "Security Training",
    description: "Mandatory cybersecurity training covering phishing awareness and data protection.",
    type: "training",
    date: "2025-07-07",
    startTime: "10:00",
    endTime: "12:00",
    location: "Online",
    attendees: 50,
    priority: "urgent",
    recurring: "none",
    organizer: "IT Security Team",
    status: "confirmed",
    reminders: ["3 days before", "1 day before", "30 minutes before"],
    notes: "Attendance is mandatory for all employees.",
  },
  {
    id: 5,
    title: "Product Demo Webinar",
    description: "Live demonstration of our new product features and capabilities.",
    type: "webinar",
    date: "2025-07-08",
    startTime: "15:00",
    endTime: "16:00",
    location: "Zoom",
    attendees: 100,
    priority: "medium",
    recurring: "monthly",
    organizer: "Product Team",
    status: "confirmed",
    reminders: ["1 day before", "1 hour before"],
    notes: "Recording will be available for those who cannot attend live.",
  },
  {
    id: 6,
    title: "Team Happy Hour",
    description: "Monthly team social event to celebrate achievements and strengthen team bonds.",
    type: "social",
    date: "2025-07-09",
    startTime: "17:00",
    endTime: "19:00",
    location: "Local Pub",
    attendees: 15,
    priority: "low",
    recurring: "monthly",
    organizer: "HR Team",
    status: "tentative",
    reminders: ["2 days before"],
    notes: "Optional attendance. Please RSVP by July 7th.",
  },
  {
    id: 7,
    title: "Client Meeting",
    description: "Quarterly review meeting with our biggest client.",
    type: "meeting",
    date: "2025-07-10",
    startTime: "11:00",
    endTime: "12:30",
    location: "Client Office",
    attendees: 6,
    priority: "high",
    recurring: "none",
    organizer: "Account Manager",
    status: "confirmed",
    reminders: ["1 day before", "2 hours before"],
    notes: "Bring quarterly reports and project updates.",
  },
  {
    id: 8,
    title: "Design Review",
    description: "Review of new UI designs for the mobile app.",
    type: "meeting",
    date: "2025-07-10",
    startTime: "14:00",
    endTime: "15:30",
    location: "Design Studio",
    attendees: 4,
    priority: "medium",
    recurring: "none",
    organizer: "Design Lead",
    status: "confirmed",
    reminders: ["1 hour before"],
    notes: "Please review the mockups beforehand.",
  },
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 5)) // July 5, 2025
  const [selectedDate, setSelectedDate] = useState(5)
  const [courseFilter, setCourseFilter] = useState("all")
  const [timelineFilter, setTimelineFilter] = useState("next-7-days")
  const [sortBy, setSortBy] = useState("dates")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventDetails | null>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [dateEventsModalOpen, setDateEventsModalOpen] = useState(false)
  const [selectedDateForEvents, setSelectedDateForEvents] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (date: Date) => {
    setSelectedDateForEvents(date)
    setDateEventsModalOpen(true)
  }

  const handleEventClickFromDate = (event: EventDetails) => {
    setSelectedEventDetails(event)
    setDateEventsModalOpen(false)
    setIsEventDetailsOpen(true)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

      days.push(
        <CalendarDateCell
          key={day}
          day={day}
          date={cellDate}
          isSelected={isSelected}
          events={SAMPLE_EVENTS_DATA}
          onClick={() => setSelectedDate(day)}
          onDateClick={handleDateClick}
        />,
      )
    }

    return days
  }

  const handleEventEdit = (event: EventDetails) => {
    console.log("Edit event:", event)
    setIsEventDetailsOpen(false)
  }

  const handleEventDelete = (eventId: number) => {
    console.log("Delete event:", eventId)
  }

  const handleEventDuplicate = (event: EventDetails) => {
    console.log("Duplicate event:", event)
    setIsEventDetailsOpen(false)
  }

  const currentMonth = MONTHS[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()
  const prevMonth = MONTHS[currentDate.getMonth() - 1] ?? MONTHS[11]
  const nextMonth = MONTHS[currentDate.getMonth() + 1] ?? MONTHS[0]

  const selectedDateEvents = selectedDateForEvents ? getEventsForDate(SAMPLE_EVENTS_DATA, selectedDateForEvents) : []

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Calendar</h1>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All courses</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New event
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth("prev")}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {prevMonth}
          </button>

          <h2 className="text-xl font-semibold">
            {currentMonth} {currentYear}
          </h2>

          <button
            onClick={() => navigateMonth("next")}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            {nextMonth}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">{renderCalendarDays()}</div>
        </div>

        {/* Legend for Calendar Indicators */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Calendar Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Colored dots = Event types</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span>Number badge = Multiple events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full" />
              <span>Click dates with events to view details</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-4 mb-8 text-sm text-gray-400">
          <button className="hover:text-white transition-colors">Full calendar</button>
          <span>•</span>
          <button className="hover:text-white transition-colors">Import or export calendars</button>
        </div>

        {/* Timeline Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Timeline</h3>

          {/* Timeline Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={timelineFilter} onValueChange={setTimelineFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="next-7-days">Next 7 days</SelectItem>
                <SelectItem value="next-30-days">Next 30 days</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="dates">Sort by dates</SelectItem>
                <SelectItem value="name">Sort by name</SelectItem>
                <SelectItem value="type">Sort by type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="mb-8">
            <Input
              placeholder="Search by activity type or name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Sample Events */}
          <SampleEvents />
        </div>

        {/* Color Legend */}
        <div className="mt-8">
          <EventColorLegend />
        </div>

        {/* Modals */}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate)}
        />

        <DateEventsModal
          isOpen={dateEventsModalOpen}
          onClose={() => setDateEventsModalOpen(false)}
          date={selectedDateForEvents ?? new Date()}
          events={selectedDateEvents}
          onEventClick={handleEventClickFromDate}
        />

        <EventDetailsModal
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          event={selectedEventDetails}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
          onDuplicate={handleEventDuplicate}
        />
      </div>
    </div>
  )
}
