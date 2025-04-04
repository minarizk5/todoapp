import fs from 'fs';
import path from 'path';
import { Task } from '@/context/app-context';

export type { Task };

// File paths
const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure tasks file exists
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Get all tasks
export function getTasks(): Task[] {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    
    // Convert string dates back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      date: new Date(task.date)
    }));
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

// Save tasks to file
export function saveTasks(tasks: Task[]): boolean {
  try {
    // Convert Date objects to ISO strings for JSON serialization
    const tasksToSave = tasks.map(task => ({
      ...task,
      date: task.date instanceof Date ? task.date.toISOString() : task.date
    }));
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksToSave, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing tasks file:', error);
    return false;
  }
}

// Get tasks for a specific user
export function getUserTasks(userId: string): Task[] {
  try {
    const tasks = getTasks();
    return tasks.filter(task => task.user_id === userId);
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return [];
  }
}

// Add a new task
export function addTask(task: Omit<Task, 'id'>, userId: string): Task | null {
  try {
    const tasks = getTasks();
    
    // Generate a new ID
    const newId = tasks.length > 0 
      ? Math.max(...tasks.map(t => typeof t.id === 'number' ? t.id : 0)) + 1 
      : 1;
    
    // Create the new task with the generated ID and user ID
    const newTask: Task = {
      ...task,
      id: newId,
      user_id: userId // Ensure the task is associated with the correct user
    };
    
    // Add the new task to the array
    tasks.push(newTask);
    
    // Save the updated tasks array
    if (saveTasks(tasks)) {
      return newTask;
    }
    
    return null;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
}

// Update an existing task (with user verification)
export function updateUserTask(task: Task, userId: string): boolean {
  try {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === task.id && t.user_id === userId);
    
    if (index === -1) {
      return false; // Task not found or doesn't belong to user
    }
    
    tasks[index] = task;
    return saveTasks(tasks);
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

// Delete a task (with user verification)
export function deleteUserTask(id: number, userId: string): boolean {
  try {
    const tasks = getTasks();
    const initialLength = tasks.length;
    
    // Only remove if task belongs to user
    const filteredTasks = tasks.filter(task => 
      !(task.id === id && task.user_id === userId)
    );
    
    if (filteredTasks.length === initialLength) {
      return false; // No task was removed
    }
    
    return saveTasks(filteredTasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}
