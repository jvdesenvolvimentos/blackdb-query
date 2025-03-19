
import SQLiteService from './SQLiteService';
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
  private sqlite: SQLiteService;
  
  private constructor() {
    this.sqlite = SQLiteService.getInstance();
  }
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In production, would send encrypted password or use secure endpoint
      // For demonstration, we send query with email
      const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const users = await this.sqlite.query<any>(query, [credentials.email]);
      
      if (users.length === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }
      
      const user = users[0];
      
      // In production, would verify password hash
      // For demonstration, we check directly (simulation)
      const isPasswordValid = true; // Simulation for development environment
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Senha incorreta'
        };
      }
      
      // User authenticated successfully
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error during login attempt:', error);
      return {
        success: false,
        message: 'Erro ao processar login'
      };
    }
  }
  
  public async register(userData: {name: string, email: string, password: string}): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const checkQuery = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const existingUsers = await this.sqlite.query<any>(checkQuery, [userData.email]);
      
      if (existingUsers.length > 0) {
        return {
          success: false,
          message: 'Este email já está em uso'
        };
      }
      
      // In production, would insert into database
      // For demonstration, simulate success
      return {
        success: true,
        message: 'Usuário registrado com sucesso'
      };
    } catch (error) {
      console.error('Error registering user:', error);
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
