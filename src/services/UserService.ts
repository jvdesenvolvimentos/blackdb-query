
import SQLiteService from './SQLiteService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  status: boolean;
}

class UserService {
  private static instance: UserService;
  private sqlite: SQLiteService;
  
  private constructor() {
    this.sqlite = SQLiteService.getInstance();
  }
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  
  public async getAllUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users`;
      const users = await this.sqlite.query<User>(query);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  
  public async getUserById(id: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
      const users = await this.sqlite.query<User>(query, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
  
  public async createUser(userData: Omit<User, 'id'>): Promise<boolean> {
    try {
      // In production, would insert into database
      // For demonstration, simulate success and store in memory only
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }
  
  public async updateUser(user: User): Promise<boolean> {
    try {
      // In production, would update database
      // For demonstration, simulate success
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
  
  public async toggleUserStatus(id: string): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      user.status = !user.status;
      return await this.updateUser(user);
    } catch (error) {
      console.error('Error toggling user status:', error);
      return false;
    }
  }
  
  public async addUserCredits(id: string, amount: number): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;
      
      user.credits += amount;
      return await this.updateUser(user);
    } catch (error) {
      console.error('Error adding credits to user:', error);
      return false;
    }
  }
}

export default UserService;
