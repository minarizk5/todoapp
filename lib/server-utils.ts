import fs from 'fs';
import path from 'path';

// File paths
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Read users from JSON file
export function readUsersFile() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      // Create the file if it doesn't exist
      fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    
    const usersJson = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Write users to JSON file
export function writeUsersFile(users: any[]) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// Get user by email
export function getUserByEmailFromFile(email: string) {
  const users = readUsersFile();
  return users.find((user: any) => user.email === email);
}

// Get user by ID
export function getUserByIdFromFile(id: string) {
  const users = readUsersFile();
  return users.find((user: any) => user.id === id);
}

// Add user to file
export function addUserToFile(user: any) {
  const users = readUsersFile();
  users.push(user);
  return writeUsersFile(users);
}
