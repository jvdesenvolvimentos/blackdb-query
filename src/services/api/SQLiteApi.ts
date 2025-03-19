
import SQLiteService from '../SQLiteService';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DatabaseConfig {
  database: string;
}

export class SQLiteApi {
  private static instance: SQLiteApi;
  private sqlite: SQLiteService;
  
  private constructor() {
    this.sqlite = SQLiteService.getInstance();
  }
  
  public static getInstance(): SQLiteApi {
    if (!SQLiteApi.instance) {
      SQLiteApi.instance = new SQLiteApi();
    }
    return SQLiteApi.instance;
  }
  
  // Test database connection
  public async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      const connected = await this.sqlite.testConnection();
      return {
        success: true,
        data: connected,
        message: connected ? 'Conexão estabelecida com sucesso' : 'Falha ao conectar'
      };
    } catch (error: any) {
      console.error('Erro ao testar conexão com SQLite:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao testar conexão com o banco de dados'
      };
    }
  }
  
  // Establish connection
  public async connect(config?: DatabaseConfig): Promise<ApiResponse<boolean>> {
    try {
      // Update configuration if provided
      if (config) {
        this.sqlite.setConfig(config);
      }
      
      const connected = await this.sqlite.connect();
      return {
        success: connected,
        data: connected,
        message: connected ? 'Conexão estabelecida com sucesso' : 'Falha ao conectar com o banco de dados',
        error: connected ? undefined : 'Falha ao conectar com o banco de dados'
      };
    } catch (error: any) {
      console.error('Erro ao conectar com SQLite:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao conectar com o banco de dados'
      };
    }
  }
  
  // Execute SQL queries
  public async executeQuery<T = any>(
    sql: string, 
    params: any[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      if (!this.sqlite.isConnected()) {
        // Try to reconnect automatically
        const connected = await this.sqlite.connect();
        if (!connected) {
          return {
            success: false,
            error: 'Sem conexão com o banco de dados. Tente conectar novamente.'
          };
        }
      }
      
      const results = await this.sqlite.query<T>(sql, params);
      return {
        success: true,
        data: results,
        message: `Consulta executada com sucesso. Retornados ${results.length} registros.`
      };
    } catch (error: any) {
      console.error('Erro ao executar consulta SQL:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao executar consulta SQL'
      };
    }
  }
  
  // Execute operations (INSERT, UPDATE, DELETE)
  public async executeUpdate(
    sql: string,
    params: any[] = []
  ): Promise<ApiResponse<number>> {
    try {
      if (!this.sqlite.isConnected()) {
        // Try to reconnect automatically
        const connected = await this.sqlite.connect();
        if (!connected) {
          return {
            success: false,
            error: 'Sem conexão com o banco de dados. Tente conectar novamente.'
          };
        }
      }
      
      const result = await this.sqlite.execute(sql, params);
      return {
        success: true,
        data: result.affectedRows || 0,
        message: `Operação executada com sucesso. ${result.affectedRows || 0} registros afetados.`
      };
    } catch (error: any) {
      console.error('Erro ao executar operação SQL:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao executar operação SQL'
      };
    }
  }
  
  // Get current configuration
  public getConfig(): DatabaseConfig {
    return this.sqlite.getConfig();
  }
}

export default SQLiteApi;
