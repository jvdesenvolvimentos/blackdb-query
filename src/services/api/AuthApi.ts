
import SQLiteApi from './SQLiteApi';
import { AdminUser } from '@/types/admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  token?: string;
  error?: string;
  message?: string;
}

export class AuthApi {
  private static instance: AuthApi;
  private sqliteApi: SQLiteApi;
  
  private constructor() {
    this.sqliteApi = SQLiteApi.getInstance();
  }
  
  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }
  
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Query to fetch user by email
      const sql = 'SELECT id, name, email, role, password, status, credits FROM users WHERE email = ? LIMIT 1';
      const result = await this.sqliteApi.executeQuery<any>(sql, [credentials.email]);
      
      if (!result.success || !result.data || result.data.length === 0) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      const user = result.data[0];
      
      // In a real environment, we would verify password hash
      // For this example, we do a basic check (NOT SECURE - demo only)
      const isPasswordValid = user.password === credentials.password;
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Credenciais inválidas'
        };
      }
      
      // Check if user is active
      if (!user.status) {
        return {
          success: false,
          error: 'Usuário inativo ou bloqueado'
        };
      }
      
      // Generate token (simulated for this example)
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save to localStorage for persistence between sessions
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));
      
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token,
        message: 'Login realizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao realizar login:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao processar autenticação'
      };
    }
  }
  
  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
      const checkResult = await this.sqliteApi.executeQuery<any>(checkSql, [userData.email]);
      
      if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
        return {
          success: false,
          error: 'Este email já está em uso'
        };
      }
      
      // In a real environment, we would hash the password
      // Insert new user
      const insertSql = `
        INSERT INTO users (name, email, password, role, status, credits, created_at) 
        VALUES (?, ?, ?, ?, 1, 0, datetime('now'))
      `;
      
      const role = userData.role || 'user';
      
      const insertResult = await this.sqliteApi.executeUpdate(
        insertSql, 
        [userData.name, userData.email, userData.password, role]
      );
      
      if (!insertResult.success) {
        return {
          success: false,
          error: insertResult.error || 'Falha ao cadastrar usuário'
        };
      }
      
      return {
        success: true,
        user: {
          name: userData.name,
          email: userData.email,
          role
        },
        message: 'Usuário cadastrado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao processar cadastro'
      };
    }
  }
  
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
  
  public getCurrentUser(): AdminUser | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}

export default AuthApi;
