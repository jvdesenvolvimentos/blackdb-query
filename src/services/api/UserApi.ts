
import SQLiteApi from './SQLiteApi';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
  credits: number;
  created_at?: string;
  updated_at?: string;
}

export class UserApi {
  private static instance: UserApi;
  private sqliteApi: SQLiteApi;
  
  private constructor() {
    this.sqliteApi = SQLiteApi.getInstance();
  }
  
  public static getInstance(): UserApi {
    if (!UserApi.instance) {
      UserApi.instance = new UserApi();
    }
    return UserApi.instance;
  }
  
  public async getAllUsers(): Promise<{success: boolean, data?: User[], error?: string}> {
    try {
      const sql = 'SELECT id, name, email, role, status, credits, created_at, updated_at FROM users ORDER BY name ASC';
      const result = await this.sqliteApi.executeQuery<User>(sql);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        error: 'Falha ao buscar usuários'
      };
    }
  }
  
  public async getUserById(id: number): Promise<{success: boolean, data?: User, error?: string}> {
    try {
      const sql = 'SELECT id, name, email, role, status, credits, created_at, updated_at FROM users WHERE id = ? LIMIT 1';
      const result = await this.sqliteApi.executeQuery<User>(sql, [id]);
      
      if (!result.success || !result.data || result.data.length === 0) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      return {
        success: true,
        data: result.data[0]
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return {
        success: false,
        error: 'Falha ao buscar detalhes do usuário'
      };
    }
  }
  
  public async updateUser(user: User): Promise<{success: boolean, data?: User, error?: string}> {
    try {
      const sql = `
        UPDATE users 
        SET name = ?, email = ?, role = ?, status = ?, credits = ?, updated_at = datetime('now')
        WHERE id = ?
      `;
      
      const params = [
        user.name,
        user.email,
        user.role,
        user.status ? 1 : 0,
        user.credits,
        user.id
      ];
      
      const result = await this.sqliteApi.executeQuery(sql, params);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar usuário'
        };
      }
      
      // Return updated user
      return this.getUserById(user.id);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        error: 'Falha ao atualizar usuário'
      };
    }
  }
  
  public async toggleUserStatus(id: number): Promise<{success: boolean, data?: User, error?: string}> {
    try {
      // First, get current user
      const userResult = await this.getUserById(id);
      
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      const user = userResult.data;
      
      // Toggle status
      const sql = 'UPDATE users SET status = ?, updated_at = datetime("now") WHERE id = ?';
      const newStatus = !user.status;
      
      const result = await this.sqliteApi.executeQuery(sql, [newStatus ? 1 : 0, id]);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar status do usuário'
        };
      }
      
      // Return user with updated status
      user.status = newStatus;
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      return {
        success: false,
        error: 'Falha ao alterar status do usuário'
      };
    }
  }
  
  public async addUserCredits(id: number, amount: number): Promise<{success: boolean, data?: User, error?: string}> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          error: 'A quantidade de créditos deve ser maior que zero'
        };
      }
      
      // Update user credits
      const sql = 'UPDATE users SET credits = credits + ?, updated_at = datetime("now") WHERE id = ?';
      const result = await this.sqliteApi.executeQuery(sql, [amount, id]);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao adicionar créditos'
        };
      }
      
      // Return updated user
      return this.getUserById(id);
    } catch (error) {
      console.error('Erro ao adicionar créditos:', error);
      return {
        success: false,
        error: 'Falha ao adicionar créditos'
      };
    }
  }
  
  public async removeUserCredits(id: number, amount: number): Promise<{success: boolean, data?: User, error?: string}> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          error: 'A quantidade de créditos deve ser maior que zero'
        };
      }
      
      // Check if user has enough credits
      const userResult = await this.getUserById(id);
      
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      const user = userResult.data;
      
      if (user.credits < amount) {
        return {
          success: false,
          error: 'Créditos insuficientes'
        };
      }
      
      // Update user credits
      const sql = 'UPDATE users SET credits = credits - ?, updated_at = datetime("now") WHERE id = ?';
      const result = await this.sqliteApi.executeQuery(sql, [amount, id]);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao remover créditos'
        };
      }
      
      // Return updated user
      return this.getUserById(id);
    } catch (error) {
      console.error('Erro ao remover créditos:', error);
      return {
        success: false,
        error: 'Falha ao remover créditos'
      };
    }
  }
}

export default UserApi;
