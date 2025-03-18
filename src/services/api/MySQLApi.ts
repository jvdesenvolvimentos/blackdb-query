
import MySQLService from '../MySQLService';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class MySQLApi {
  private static instance: MySQLApi;
  private mysql: MySQLService;
  
  private constructor() {
    this.mysql = MySQLService.getInstance();
  }
  
  public static getInstance(): MySQLApi {
    if (!MySQLApi.instance) {
      MySQLApi.instance = new MySQLApi();
    }
    return MySQLApi.instance;
  }
  
  // Endpoint para testar a conexão com o banco
  public async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      const connected = await this.mysql.testConnection();
      return {
        success: true,
        data: connected
      };
    } catch (error) {
      console.error('Erro ao testar conexão com MySQL:', error);
      return {
        success: false,
        error: 'Falha ao testar conexão com o banco de dados'
      };
    }
  }
  
  // Endpoint para estabelecer conexão
  public async connect(config?: any): Promise<ApiResponse<boolean>> {
    try {
      // Se configuração for passada, atualizar
      if (config) {
        this.mysql.setConfig(config);
      }
      
      const connected = await this.mysql.connect();
      return {
        success: connected,
        data: connected,
        error: connected ? undefined : 'Falha ao conectar com o banco de dados'
      };
    } catch (error) {
      console.error('Erro ao conectar com MySQL:', error);
      return {
        success: false,
        error: 'Falha ao conectar com o banco de dados'
      };
    }
  }
  
  // Endpoint para executar consultas SQL
  public async executeQuery<T = any>(
    sql: string, 
    params: any[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      const results = await this.mysql.query<T>(sql, params);
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Erro ao executar consulta SQL:', error);
      return {
        success: false,
        error: 'Falha ao executar consulta SQL'
      };
    }
  }
}

export default MySQLApi;
