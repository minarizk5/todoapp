"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

// Define types
export type TaskAttachment = {
  id: string
  type: "image" | "file"
  name: string
  url: string
}

export type TaskLink = {
  id: string
  title: string
  url: string
}

export type Task = {
  id: number
  title: string
  status: "not-started" | "in-progress" | "completed"
  date: Date
  important: boolean
  notes?: string
  links?: TaskLink[]
  attachments?: TaskAttachment[]
}

type User = {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
}

type AppState = {
  tasks: Task[]
  user: User | null
  stats: {
    completed: number
    inProgress: number
    notStarted: number
  }
}

type AppAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id"> }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "TOGGLE_IMPORTANT"; payload: number }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SYNC_TASKS"; payload: Task[] }

// Initial state
const initialState: AppState = {
  tasks: [],
  user: null,
  stats: {
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  },
}

// Create context
type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TASK":
      const newTask = {
        ...action.payload,
        id: state.tasks.length > 0 ? Math.max(...state.tasks.map((t) => t.id)) + 1 : 1,
      }
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        stats: calculateStats([...state.tasks, newTask]),
      }

    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task))
      return {
        ...state,
        tasks: updatedTasks,
        stats: calculateStats(updatedTasks),
      }

    case "DELETE_TASK":
      const filteredTasks = state.tasks.filter((task) => task.id !== action.payload)
      return {
        ...state,
        tasks: filteredTasks,
        stats: calculateStats(filteredTasks),
      }

    case "TOGGLE_IMPORTANT":
      const toggledTasks = state.tasks.map((task) =>
        task.id === action.payload ? { ...task, important: !task.important } : task,
      )
      return {
        ...state,
        tasks: toggledTasks,
      }

    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      }

    case "LOGOUT":
      return {
        ...initialState,
      }

    case "SYNC_TASKS":
      return {
        ...state,
        tasks: action.payload,
        stats: calculateStats(action.payload),
      }

    default:
      return state
  }
}

// Helper function to calculate stats
function calculateStats(tasks: Task[]) {
  return {
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    notStarted: tasks.filter((t) => t.status === "not-started").length,
  }
}

// Context provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [isClient, setIsClient] = useState(false)
  const { data: session } = useSession()

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sync user from session
  useEffect(() => {
    if (session?.user) {
      dispatch({
        type: "LOGIN",
        payload: {
          id: session.user.id,
          name: session.user.name || "User",
          email: session.user.email || "",
          isLoggedIn: true,
        },
      })
    }
  }, [session])

  // Persist state to localStorage (client-side only)
  useEffect(() => {
    if (!isClient || !session?.user?.id) return

    try {
      const userKey = `appState-${session.user.id}`
      const savedState = localStorage.getItem(userKey)

      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // Convert string dates back to Date objects
        const tasks = parsedState.tasks.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }))

        // Sync tasks from localStorage
        dispatch({ type: "SYNC_TASKS", payload: tasks })
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error)
    }
  }, [isClient, session])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (!isClient || !session?.user?.id) return

    try {
      const userKey = `appState-${session.user.id}`
      localStorage.setItem(userKey, JSON.stringify({ tasks: state.tasks }))
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }
  }, [state.tasks, isClient, session])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

