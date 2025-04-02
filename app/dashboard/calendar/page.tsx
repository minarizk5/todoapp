import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Calendar View</h1>
        <CalendarView />
      </div>
    </main>
  )
}

