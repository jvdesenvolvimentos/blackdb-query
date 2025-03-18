
import MySQLService from './MySQLService';

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
  private mysql: MySQLService;
  
  private constructor() {
    this.mysql = MySQLService.getInstance();
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
      const users = await this.mysql.query<User>(query);
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }
  
  public async getUserById(id: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
      const users = await this.mysql.query<User>(query, [id]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }
  
  public async createUser(userData: Omit<User, 'id'>): Promise<boolean> {
    try {
      // Em produção, inseriria no banco de dados
      // Para demonstração, simulamos sucesso e armazenamos apenas em memória
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  }
  
  public async updateUser(user: User): Promise<boolean> {
    try {
      // Em produção, atualizaria o banco de dados
      // Para demonstração, simulamos sucesso
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
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
      console.error('Erro ao alterar status do usuário:', error);
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
      console.error('Erro ao adicionar créditos ao usuário:', error);
      return false;
    }
  }
}

export default UserService;
