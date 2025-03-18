
import MySQLApi from './MySQLApi';
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
}

export class AuthApi {
  private static instance: AuthApi;
  private mysqlApi: MySQLApi;
  
  private constructor() {
    this.mysqlApi = MySQLApi.getInstance();
  }
  
  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }
  
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Consulta para buscar o usuário pelo email
      const sql = 'SELECT id, name, email, role, password, status, credits FROM users WHERE email = ? LIMIT 1';
      const result = await this.mysqlApi.executeQuery<any>(sql, [credentials.email]);
      
      if (!result.success || !result.data || result.data.length === 0) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      const user = result.data[0];
      
      // Em um ambiente real, verificaria o hash da senha
      // Para este exemplo, consideramos que a autenticação é bem-sucedida
      
      // Verificar se o usuário está ativo
      if (!user.status) {
        return {
          success: false,
          error: 'Usuário inativo ou bloqueado'
        };
      }
      
      // Gerar token (simulado para este exemplo)
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return {
        success: false,
        error: 'Falha ao processar autenticação'
      };
    }
  }
  
  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Verificar se o usuário já existe
      const checkSql = 'SELECT id FROM users WHERE email = ? LIMIT 1';
      const checkResult = await this.mysqlApi.executeQuery<any>(checkSql, [userData.email]);
      
      if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
        return {
          success: false,
          error: 'Este email já está em uso'
        };
      }
      
      // Em um ambiente real, faria hash da senha
      // Inserir novo usuário
      const insertSql = `
        INSERT INTO users (name, email, password, role, status, credits, created_at) 
        VALUES (?, ?, ?, ?, true, 0, NOW())
      `;
      
      const role = userData.role || 'user';
      
      const insertResult = await this.mysqlApi.executeQuery<any>(
        insertSql, 
        [userData.name, userData.email, userData.password, role]
      );
      
      if (!insertResult.success) {
        return {
          success: false,
          error: 'Falha ao cadastrar usuário'
        };
      }
      
      return {
        success: true,
        user: {
          name: userData.name,
          email: userData.email,
          role
        }
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        error: 'Falha ao processar cadastro'
      };
    }
  }
}

export default AuthApi;
