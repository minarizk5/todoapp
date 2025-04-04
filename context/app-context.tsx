"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"

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
  user_id: string
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
  | { type: "SET_TASKS"; payload: Task[] }

// Initial state
const initialState: AppState = {
  tasks: [
    {
      id: 1,
      title: "Complete project proposal",
      status: "in-progress",
      date: new Date(),
      important: false,
      notes: "Include sections on budget, timeline, and resources needed.",
      links: [{ id: "l1", title: "Project Template", url: "https://example.com/template" }],
      user_id: "",
    },
    {
      id: 2,
      title: "Schedule team meeting",
      status: "not-started",
      date: new Date(),
      important: true,
      notes: "Discuss quarterly goals and project assignments.",
      user_id: "",
    },
    {
      id: 3,
      title: "Review client feedback",
      status: "completed",
      date: new Date(),
      important: false,
      notes: "Focus on UI/UX concerns raised in the latest feedback session.",
      user_id: "",
    },
    {
      id: 4,
      title: "Update documentation",
      status: "not-started",
      date: new Date(),
      important: false,
      notes: "Update API documentation with new endpoints.",
      user_id: "",
    },
  ],
  user: null,
  stats: {
    completed: 1,
    inProgress: 1,
    notStarted: 2,
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
      // Get the current user ID from localStorage
      const userId = localStorage.getItem('userId') || state.user?.id || "";
      
      // Create a new task with a unique ID and the current user's ID
      const newTask = {
        ...action.payload,
        id: state.tasks.length > 0 ? Math.max(...state.tasks.map((t) => t.id)) + 1 : 1,
        user_id: userId, // Set user_id to current user's ID
      }
      
      console.log("Adding new task with user ID:", userId, newTask);
      
      // Add the new task to the tasks array
      const tasksWithNewTask = [...state.tasks, newTask];
      
      return {
        ...state,
        tasks: tasksWithNewTask,
        stats: calculateStats(tasksWithNewTask),
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
        ...state,
        user: null,
      }

    case "SET_TASKS":
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
  const userId = localStorage.getItem("userId")
  const userTasks = userId ? tasks.filter((task) => task.user_id === userId) : tasks

  return {
    completed: userTasks.filter((t) => t.status === "completed").length,
    inProgress: userTasks.filter((t) => t.status === "in-progress").length,
    notStarted: userTasks.filter((t) => t.status === "not-started").length,
  }
}

// Context provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [isClient, setIsClient] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [lastAction, setLastAction] = useState<AppAction | null>(null)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
    
    // Initialize userId in localStorage if not already set
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (!userId && state.user?.id) {
        localStorage.setItem('userId', state.user.id);
        console.log("Initialized userId in localStorage:", state.user.id);
      }
    }
  }, [state.user])

  // Handle API calls for actions
  useEffect(() => {
    if (!isClient || !lastAction || isInitialLoad) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    switch (lastAction.type) {
      case "ADD_TASK":
        // Find the task that was just added (it will be the last one in the array)
        const newTask = state.tasks[state.tasks.length - 1];
        if (!newTask) return;

        // Add task to database via API
        fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...lastAction.payload,
            user_id: userId
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log("Task added successfully via API:", data.task);
          } else {
            console.error("Failed to add task via API:", data.message);
          }
        })
        .catch(error => {
          console.error("Error adding task via API:", error);
        });
        break;

      case "UPDATE_TASK":
        // Update task in database via API
        fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastAction.payload),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log("Task updated successfully via API");
          } else {
            console.error("Failed to update task via API:", data.message);
          }
        })
        .catch(error => {
          console.error("Error updating task via API:", error);
        });
        break;

      case "DELETE_TASK":
        // Delete task from database via API
        fetch(`/api/tasks?id=${lastAction.payload}`, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log("Task deleted successfully via API");
          } else {
            console.error("Failed to delete task via API:", data.message);
          }
        })
        .catch(error => {
          console.error("Error deleting task via API:", error);
        });
        break;
    }
  }, [lastAction, isClient, isInitialLoad, state.tasks]);

  // Intercept dispatch to track last action
  const interceptedDispatch = (action: AppAction) => {
    setLastAction(action);
    dispatch(action);
  };

  // Load tasks from API when component mounts (only once)
  useEffect(() => {
    if (!isClient) return;
    
    // Check if user is authenticated
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    console.log("Initial load of tasks from API");
    
    // Fetch tasks from API
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.tasks) {
          console.log("Loaded tasks from API:", data.tasks.length, "tasks");
          
          // Clear existing tasks first
          // Then add each task from the API to the state
          const tasksToAdd = data.tasks.map((task: any) => ({
            ...task,
            date: new Date(task.date)
          }));
          
          // Update state directly with all tasks at once
          dispatch({
            type: "SET_TASKS",
            payload: tasksToAdd
          });
          
          setIsInitialLoad(false);
        }
      })
      .catch(error => {
        console.error("Error loading tasks from API:", error);
        setIsInitialLoad(false);
      });
  }, [isClient]);

  // Persist state to localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return

    try {
      const savedState = localStorage.getItem("appState")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // Convert string dates back to Date objects
        parsedState.tasks = parsedState.tasks.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }))

        // Initialize the reducer with the saved state
        dispatch({ type: "LOGIN", payload: parsedState.user })

        // Clear existing tasks before adding saved ones
        // This prevents duplication of tasks
        const userId = parsedState.user?.id
        if (userId) {
          localStorage.setItem("userId", userId)
          console.log("Updated userId in localStorage from saved state:", userId);
        }
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error)
    }
  }, [isClient])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem("appState", JSON.stringify(state))
      
      // If user is logged in, store userId in localStorage for easy access
      if (state.user && state.user.id) {
        localStorage.setItem('userId', state.user.id);
        console.log("Saved userId to localStorage:", state.user.id);
      }
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }
  }, [state, isClient])

  return <AppContext.Provider value={{ state, dispatch: interceptedDispatch }}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
