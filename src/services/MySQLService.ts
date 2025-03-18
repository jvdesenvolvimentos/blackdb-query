
interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

interface ExecuteResult {
  affectedRows: number;
  insertId?: number;
}

class MySQLService {
  private static instance: MySQLService;
  private config: MySQLConfig;
  private connected: boolean = false;
  
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
    this.connected = false; // Reset do estado de conexão quando a configuração muda
    console.log('MySQL config atualizada:', { host: this.config.host, database: this.config.database });
  }
  
  public getConfig(): MySQLConfig {
    return { ...this.config };
  }
  
  public isConnected(): boolean {
    return this.connected;
  }
  
  // Método que retorna uma simulação de conexão mysqli
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
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Erro ao conectar MySQL:', error);
      
      // No ambiente de desenvolvimento, simula sucesso para testes
      if (import.meta.env.DEV) {
        console.warn('Modo DEV: Simulando conexão MySQL bem-sucedida');
        this.connected = true;
        return true;
      }
      
      this.connected = false;
      return false;
    }
  }
  
  // Método para executar consultas SELECT
  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // No ambiente de desenvolvimento, retorna dados simulados
      if (import.meta.env.DEV) {
        return this.getMockData<T>(sql, params);
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha na execução da consulta SQL');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao executar consulta MySQL:', error);
      throw error;
    }
  }
  
  // Método para executar operações de inserção, atualização ou exclusão
  public async execute(sql: string, params: any[] = []): Promise<ExecuteResult> {
    try {
      // No ambiente de desenvolvimento, simula a operação
      if (import.meta.env.DEV) {
        return this.simulateExecute(sql, params);
      }
      
      // Em produção, chama a API
      const response = await fetch('/api/mysql/execute', {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha na execução da operação SQL');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao executar operação MySQL:', error);
      throw error;
    }
  }
  
  // Método para verificar se está conectado
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query<{status: string}>('SELECT "connected" as status');
      this.connected = result.length > 0 && result[0].status === 'connected';
      return this.connected;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }
  
  // Simula operações de INSERT, UPDATE e DELETE no ambiente de desenvolvimento
  private simulateExecute(sql: string, params: any[]): ExecuteResult {
    console.log('Simulando execução SQL:', sql, params);
    
    const sqlLower = sql.toLowerCase();
    
    // Simula um INSERT
    if (sqlLower.includes('insert into')) {
      return {
        affectedRows: 1,
        insertId: Math.floor(Math.random() * 1000) + 1
      };
    }
    
    // Simula um UPDATE
    if (sqlLower.includes('update')) {
      return {
        affectedRows: Math.floor(Math.random() * 5) + 1
      };
    }
    
    // Simula um DELETE
    if (sqlLower.includes('delete')) {
      return {
        affectedRows: Math.floor(Math.random() * 3) + 1
      };
    }
    
    // Por padrão, retorna que nenhuma linha foi afetada
    return {
      affectedRows: 0
    };
  }
  
  // Método para dados simulados durante o desenvolvimento
  private getMockData<T>(sql: string, params: any[] = []): T[] {
    console.log('Simulando consulta SQL:', sql, params);
    const sqlLower = sql.toLowerCase();
    
    // Verifica se é uma consulta de autenticação
    if (sqlLower.includes('select') && sqlLower.includes('from users') && sqlLower.includes('where email')) {
      return [{
        id: 1,
        name: 'Admin',
        email: 'admin@exemplo.com',
        role: 'admin',
        password: 'admin123', // Em um sistema real, seria um hash
        status: true,
        credits: 100
      }] as unknown as T[];
    }
    
    // Verifica se é uma consulta de módulos
    if (sqlLower.includes('select') && sqlLower.includes('from modules')) {
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
        },
        {
          id: "module-address",
          type: "address",
          name: "Endereço",
          description: "Consulta e validação de informações de endereço.",
          creditCost: 2,
          enabled: true,
          icon: "map-pin",
          apiUrl: "https://api.example.com/v1/address"
        }
      ] as unknown as T[];
    }
    
    // Verifica se é uma consulta de usuários
    if (sqlLower.includes('select') && sqlLower.includes('from users') && !sqlLower.includes('where')) {
      return [
        {
          id: 1,
          name: 'Admin',
          email: 'admin@exemplo.com',
          role: 'admin',
          status: true,
          credits: 100
        },
        {
          id: 2,
          name: 'Usuário Teste',
          email: 'usuario@exemplo.com',
          role: 'user',
          status: true,
          credits: 50
        },
        {
          id: 3,
          name: 'Usuário Inativo',
          email: 'inativo@exemplo.com',
          role: 'user',
          status: false,
          credits: 0
        }
      ] as unknown as T[];
    }
    
    // Consulta de teste de conexão
    if (sqlLower.includes('select "connected"')) {
      return [{ status: 'connected' }] as unknown as T[];
    }
    
    // Para outras consultas, retorna um array vazio
    return [] as T[];
  }
}

export default MySQLService;
