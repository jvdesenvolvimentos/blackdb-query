
import MySQLService from './MySQLService';
import { AdminUser } from '@/types/admin';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: AdminUser;
  message?: string;
}

class AuthService {
  private static instance: AuthService;
  private mysql: MySQLService;
  
  private constructor() {
    this.mysql = MySQLService.getInstance();
  }
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Em produção, enviaria a senha criptografada ou utilizaria um endpoint seguro
      // Para fins de demonstração, enviamos a query com email
      const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const users = await this.mysql.query<any>(query, [credentials.email]);
      
      if (users.length === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
      
      const user = users[0];
      
      // Em produção, verificaria a senha com hash
      // Para demonstração, verificamos diretamente (simulação)
      const isPasswordValid = true; // Simulação para o ambiente de desenvolvimento
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Senha incorreta'
        };
      }
      
      // Usuário autenticado com sucesso
      return {
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Erro ao tentar login:', error);
      return {
        success: false,
        message: 'Erro ao processar login'
      };
    }
  }
  
  public async register(userData: {name: string, email: string, password: string}): Promise<AuthResponse> {
    try {
      // Verificar se o usuário já existe
      const checkQuery = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const existingUsers = await this.mysql.query<any>(checkQuery, [userData.email]);
      
      if (existingUsers.length > 0) {
        return {
          success: false,
          message: 'Este email já está em uso'
        };
      }
      
      // Em produção, inseriria no banco de dados
      // Para demonstração, simulamos sucesso
      return {
        success: true,
        message: 'Usuário registrado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        message: 'Erro ao processar registro'
      };
    }
  }
  
  public isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  
  public logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }
  
  public getCurrentUser(): AdminUser | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  public saveCurrentUser(user: AdminUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }
}

export default AuthService;
