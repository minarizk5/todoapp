import { MonthlySummary } from "@/components/monthly-summary"

export default function SummaryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Monthly Summary</h1>
        <MonthlySummary />
      </div>
    </main>
  )
}

