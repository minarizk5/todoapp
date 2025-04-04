import fs from 'fs';
import path from 'path';

// Path to the tasks JSON file
const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');

// Interface for task data
export interface Task {
  id: string;
  userId: string;
  title: string;
  status: 'not-started' | 'in-progress' | 'completed';
  date: string;
  important: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for task link data
export interface TaskLink {
  id: string;
  taskId: string;
  title: string;
  url: string;
  createdAt: string;
}

// Interface for task attachment data
export interface TaskAttachment {
  id: string;
  taskId: string;
  type: string;
  name: string;
  url: string;
  createdAt: string;
}

// Get all tasks
export function getTasks(): Task[] {
  try {
    if (!fs.existsSync(tasksFilePath)) {
      fs.writeFileSync(tasksFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

// Save tasks to file
function saveTasks(tasks: Task[]): void {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving tasks file:', error);
  }
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get tasks for a specific user
export function getUserTasks(userId: string): Task[] {
  const tasks = getTasks();
  return tasks.filter(task => task.userId === userId);
}

// Get a specific task by ID
export function getTaskById(taskId: string): Task | null {
  const tasks = getTasks();
  return tasks.find(task => task.id === taskId) || null;
}

// Create a new task
export function createTask(taskData: {
  userId: string;
  title: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  date?: string;
  important?: boolean;
  notes?: string;
}): Task {
  const tasks = getTasks();
  
  const newTask: Task = {
    id: generateId(),
    userId: taskData.userId,
    title: taskData.title,
    status: taskData.status || 'not-started',
    date: taskData.date || new Date().toISOString(),
    important: taskData.important || false,
    notes: taskData.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  
  return newTask;
}

// Update a task
export function updateTask(taskId: string, taskData: Partial<Task>): Task | null {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  // Update the task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString()
  };
  
  saveTasks(tasks);
  
  return tasks[taskIndex];
}

// Delete a task
export function deleteTask(taskId: string): boolean {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === tasks.length) {
    return false;
  }
  
  saveTasks(filteredTasks);
  return true;
}

// Path to the task links JSON file
const taskLinksFilePath = path.join(process.cwd(), 'data', 'task-links.json');

// Get all task links
export function getTaskLinks(): TaskLink[] {
  try {
    if (!fs.existsSync(taskLinksFilePath)) {
      fs.writeFileSync(taskLinksFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(taskLinksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading task links file:', error);
    return [];
  }
}

// Save task links to file
function saveTaskLinks(links: TaskLink[]): void {
  try {
    fs.writeFileSync(taskLinksFilePath, JSON.stringify(links, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving task links file:', error);
  }
}

// Get links for a specific task
export function getTaskLinksByTaskId(taskId: string): TaskLink[] {
  const links = getTaskLinks();
  return links.filter(link => link.taskId === taskId);
}

// Create a new task link
export function createTaskLink(linkData: {
  taskId: string;
  title: string;
  url: string;
}): TaskLink {
  const links = getTaskLinks();
  
  const newLink: TaskLink = {
    id: generateId(),
    taskId: linkData.taskId,
    title: linkData.title,
    url: linkData.url,
    createdAt: new Date().toISOString()
  };
  
  links.push(newLink);
  saveTaskLinks(links);
  
  return newLink;
}

// Delete a task link
export function deleteTaskLink(linkId: string): boolean {
  const links = getTaskLinks();
  const filteredLinks = links.filter(link => link.id !== linkId);
  
  if (filteredLinks.length === links.length) {
    return false;
  }
  
  saveTaskLinks(filteredLinks);
  return true;
}

// Path to the task attachments JSON file
const taskAttachmentsFilePath = path.join(process.cwd(), 'data', 'task-attachments.json');

// Get all task attachments
export function getTaskAttachments(): TaskAttachment[] {
  try {
    if (!fs.existsSync(taskAttachmentsFilePath)) {
      fs.writeFileSync(taskAttachmentsFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(taskAttachmentsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading task attachments file:', error);
    return [];
  }
}

// Save task attachments to file
function saveTaskAttachments(attachments: TaskAttachment[]): void {
  try {
    fs.writeFileSync(taskAttachmentsFilePath, JSON.stringify(attachments, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving task attachments file:', error);
  }
}

// Get attachments for a specific task
export function getTaskAttachmentsByTaskId(taskId: string): TaskAttachment[] {
  const attachments = getTaskAttachments();
  return attachments.filter(attachment => attachment.taskId === taskId);
}

// Create a new task attachment
export function createTaskAttachment(attachmentData: {
  taskId: string;
  type: string;
  name: string;
  url: string;
}): TaskAttachment {
  const attachments = getTaskAttachments();
  
  const newAttachment: TaskAttachment = {
    id: generateId(),
    taskId: attachmentData.taskId,
    type: attachmentData.type,
    name: attachmentData.name,
    url: attachmentData.url,
    createdAt: new Date().toISOString()
  };
  
  attachments.push(newAttachment);
  saveTaskAttachments(attachments);
  
  return newAttachment;
}

// Delete a task attachment
export function deleteTaskAttachment(attachmentId: string): boolean {
  const attachments = getTaskAttachments();
  const filteredAttachments = attachments.filter(attachment => attachment.id !== attachmentId);
  
  if (filteredAttachments.length === attachments.length) {
    return false;
  }
  
  saveTaskAttachments(filteredAttachments);
  return true;
}
