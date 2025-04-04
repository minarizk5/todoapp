import { NextRequest, NextResponse } from "next/server";
import { addTask, getUserTasks, updateTask, deleteTask, getTasks } from "@/lib/task-utils";
import { findUserById } from "@/lib/auth-utils";

// Get tasks for the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = req.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get all tasks from database
    const allTasks = getTasks();
    
    // Filter tasks by user ID
    const userTasks = allTasks.filter(task => task.user_id === userId);
    
    return NextResponse.json({
      success: true,
      tasks: userTasks
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while getting tasks' },
      { status: 500 }
    );
  }
}

// Create a new task
export async function POST(req: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = req.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, message: 'Task title is required' },
        { status: 400 }
      );
    }
    
    // Add the task with user verification
    const newTask = addTask(body, userId);
    
    if (!newTask) {
      return NextResponse.json(
        { success: false, message: 'Failed to create task' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while creating task' },
      { status: 500 }
    );
  }
}

// Update a task
export async function PUT(req: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = req.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id || !body.title) {
      return NextResponse.json(
        { success: false, message: 'Task ID and title are required' },
        { status: 400 }
      );
    }
    
    // Update the task with user verification
    const success = updateTask({
      ...body,
      user_id: userId // Ensure the task is associated with the correct user
    }, userId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to update task or task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating task' },
      { status: 500 }
    );
  }
}

// Delete a task
export async function DELETE(req: NextRequest) {
  try {
    // Get user ID from cookie
    const userId = req.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get task ID from URL
    const url = new URL(req.url);
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, message: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the task with user verification
    const success = deleteTask(parseInt(taskId), userId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete task or task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting task' },
      { status: 500 }
    );
  }
}
