
import MySQLService from '../MySQLService';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
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
        data: connected,
        message: connected ? 'Conexão estabelecida com sucesso' : 'Falha ao conectar'
      };
    } catch (error: any) {
      console.error('Erro ao testar conexão com MySQL:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao testar conexão com o banco de dados'
      };
    }
  }
  
  // Endpoint para estabelecer conexão
  public async connect(config?: MySQLConfig): Promise<ApiResponse<boolean>> {
    try {
      // Se configuração for passada, atualizar
      if (config) {
        this.mysql.setConfig(config);
      }
      
      const connected = await this.mysql.connect();
      return {
        success: connected,
        data: connected,
        message: connected ? 'Conexão estabelecida com sucesso' : 'Falha ao conectar com o banco de dados',
        error: connected ? undefined : 'Falha ao conectar com o banco de dados'
      };
    } catch (error: any) {
      console.error('Erro ao conectar com MySQL:', error);
      return {
        success: false,
        error: error?.message || 'Falha ao conectar com o banco de dados'
      };
    }
  }
  
  // Endpoint para executar consultas SQL
  public async executeQuery<T = any>(
    sql: string, 
    params: any[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      if (!this.mysql.isConnected()) {
        // Tentar reconectar automaticamente
        const connected = await this.mysql.connect();
        if (!connected) {
          return {
            success: false,
            error: 'Sem conexão com o banco de dados. Tente conectar novamente.'
          };
        }
      }
      
      const results = await this.mysql.query<T>(sql, params);
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
  
  // Método para executar operações de inserção, atualização ou exclusão
  public async executeUpdate(
    sql: string,
    params: any[] = []
  ): Promise<ApiResponse<number>> {
    try {
      if (!this.mysql.isConnected()) {
        // Tentar reconectar automaticamente
        const connected = await this.mysql.connect();
        if (!connected) {
          return {
            success: false,
            error: 'Sem conexão com o banco de dados. Tente conectar novamente.'
          };
        }
      }
      
      const result = await this.mysql.execute(sql, params);
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
  
  // Método para obter a configuração atual
  public getConfig(): MySQLConfig {
    return this.mysql.getConfig();
  }
}

export default MySQLApi;
