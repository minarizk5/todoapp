import TaskList from "@/components/task-list"
import { AddTaskButton } from "@/components/add-task-button"
import { ImportantTasksList } from "@/components/important-tasks-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon, ListTodoIcon } from "lucide-react"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="mt-4 md:mt-0">
            <AddTaskButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Important Tasks Section */}
          <Card className="lg:col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg pb-2">
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg font-semibold text-gray-800">Important Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ImportantTasksList />
            </CardContent>
          </Card>

          {/* Today's Tasks Section */}
          <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg pb-2">
              <div className="flex items-center space-x-2">
                <ListTodoIcon className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg font-semibold text-gray-800">Today's Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <TaskList />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
