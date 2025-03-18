
interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

class MySQLService {
  private static instance: MySQLService;
  private config: MySQLConfig;
  
  private constructor() {
    // Configuração padrão - deve ser alterada pela aplicação
    this.config = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'consultapro',
      port: 3306
    };
    
    console.log('MySQL Service inicializado');
  }
  
  public static getInstance(): MySQLService {
    if (!MySQLService.instance) {
      MySQLService.instance = new MySQLService();
    }
    return MySQLService.instance;
  }
  
  public setConfig(config: MySQLConfig): void {
    this.config = config;
    console.log('MySQL config atualizada:', { host: this.config.host, database: this.config.database });
  }
  
  public getConfig(): MySQLConfig {
    return { ...this.config };
  }
  
  // Método que retorna uma simulação de conexão mysqli (já que estamos no frontend)
  public async connect(): Promise<boolean> {
    try {
      // Simulando uma conexão com backend
      const response = await fetch('/api/mysql/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.config),
      });
      
      if (!response.ok) {
        throw new Error('Falha na conexão com o banco de dados');
      }
      
      const data = await response.json();
      console.log('Conexão MySQL estabelecida', data);
      return true;
    } catch (error) {
      console.error('Erro ao conectar MySQL:', error);
      
      // No ambiente de desenvolvimento, simula sucesso para testes
      if (import.meta.env.DEV) {
        console.warn('Modo DEV: Simulando conexão MySQL bem-sucedida');
        return true;
      }
      
      return false;
    }
  }
  
  // Método para executar consultas
  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // No ambiente de desenvolvimento, retorna dados simulados
      if (import.meta.env.DEV) {
        return this.getMockData<T>(sql);
      }
      
      // Em produção, chama a API
      const response = await fetch('/api/mysql/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha na execução da consulta SQL');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao executar consulta MySQL:', error);
      return [];
    }
  }
  
  // Método para verificar se está conectado
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query<{status: string}>('SELECT "connected" as status');
      return result.length > 0 && result[0].status === 'connected';
    } catch (error) {
      return false;
    }
  }
  
  // Método para dados simulados durante o desenvolvimento
  private getMockData<T>(sql: string): T[] {
    console.log('Simulando consulta SQL:', sql);
    
    // Verifica se é uma consulta de autenticação
    if (sql.toLowerCase().includes('select * from users where email')) {
      return [{
        id: 1,
        name: 'Admin',
        email: 'admin@exemplo.com',
        role: 'admin',
        status: true,
        credits: 100
      }] as unknown as T[];
    }
    
    // Verifica se é uma consulta de módulos
    if (sql.toLowerCase().includes('select * from modules')) {
      return [
        {
          id: "module-personal",
          type: "personal",
          name: "Dados Pessoais",
          description: "Consulta de informações pessoais básicas: nome, idade, documentos, etc.",
          creditCost: 1,
          enabled: true,
          icon: "user",
          apiUrl: "https://api.example.com/v1/personal"
        },
        {
          id: "module-financial",
          type: "financial",
          name: "Dados Financeiros",
          description: "Consulta de dados financeiros como renda, histórico bancário, etc.",
          creditCost: 5,
          enabled: true,
          icon: "dollar-sign",
          apiUrl: "https://api.example.com/v1/financial"
        }
      ] as unknown as T[];
    }
    
    // Para outras consultas, retorna um array vazio
    return [] as T[];
  }
}

export default MySQLService;
