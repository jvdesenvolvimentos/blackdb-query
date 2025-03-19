
interface DatabaseConfig {
  database: string;
}

interface ExecuteResult {
  affectedRows: number;
  insertId?: number;
}

class SQLiteService {
  private static instance: SQLiteService;
  private config: DatabaseConfig;
  private connected: boolean = false;
  private db: any = null; // Will hold SQLite connection
  
  private constructor() {
    // Default configuration - should be changed by the application
    this.config = {
      database: 'consultapro.sqlite'
    };
    
    console.log('SQLite Service initialized');
  }
  
  public static getInstance(): SQLiteService {
    if (!SQLiteService.instance) {
      SQLiteService.instance = new SQLiteService();
    }
    return SQLiteService.instance;
  }
  
  public setConfig(config: DatabaseConfig): void {
    this.config = config;
    this.connected = false; // Reset connection state when config changes
    console.log('SQLite config updated:', { database: this.config.database });
  }
  
  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }
  
  public isConnected(): boolean {
    return this.connected;
  }
  
  // Method to connect to SQLite database
  public async connect(): Promise<boolean> {
    try {
      if (this.db) {
        // Already connected
        this.connected = true;
        return true;
      }
      
      // In a real implementation, we would use a SQLite library
      // For browsers, we can use sql.js or absurd-sql
      // But for now, we'll simulate the connection for development
      
      if (import.meta.env.DEV) {
        console.log('Development mode: Simulating SQLite connection');
        // Simulate successful connection in dev mode
        this.connected = true;
        
        // In a real implementation, we would initialize the database
        // this.db = await initSQLite(this.config.database);
        
        return true;
      }
      
      // For production, we would use a real SQLite connection
      // this.db = await connectToSQLite(this.config.database);
      
      console.log('SQLite connection established');
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error connecting to SQLite:', error);
      this.connected = false;
      return false;
    }
  }
  
  // Method to execute SELECT queries
  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Ensure we're connected
      if (!this.connected) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Unable to connect to database');
        }
      }
      
      // In development mode, return mock data
      if (import.meta.env.DEV) {
        return this.getMockData<T>(sql, params);
      }
      
      // In a real implementation, we would execute the query
      // const result = await this.db.all(sql, params);
      // return result;
      
      // For now, simulate execution
      return [] as T[];
    } catch (error) {
      console.error('Error executing SQLite query:', error);
      throw error;
    }
  }
  
  // Method to execute INSERT, UPDATE, or DELETE operations
  public async execute(sql: string, params: any[] = []): Promise<ExecuteResult> {
    try {
      // Ensure we're connected
      if (!this.connected) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Unable to connect to database');
        }
      }
      
      // In development mode, simulate execution
      if (import.meta.env.DEV) {
        return this.simulateExecute(sql, params);
      }
      
      // In a real implementation, we would execute the operation
      // const result = await this.db.run(sql, params);
      // return {
      //   affectedRows: result.changes,
      //   insertId: result.lastID
      // };
      
      // For now, simulate execution
      return {
        affectedRows: 1,
        insertId: Math.floor(Math.random() * 1000) + 1
      };
    } catch (error) {
      console.error('Error executing SQLite operation:', error);
      throw error;
    }
  }
  
  // Method to check connection
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
  
  // Simulate operations in development mode
  private simulateExecute(sql: string, params: any[]): ExecuteResult {
    console.log('Simulating SQLite execution:', sql, params);
    
    const sqlLower = sql.toLowerCase();
    
    // Simulate INSERT
    if (sqlLower.includes('insert into')) {
      return {
        affectedRows: 1,
        insertId: Math.floor(Math.random() * 1000) + 1
      };
    }
    
    // Simulate UPDATE
    if (sqlLower.includes('update')) {
      return {
        affectedRows: Math.floor(Math.random() * 5) + 1
      };
    }
    
    // Simulate DELETE
    if (sqlLower.includes('delete')) {
      return {
        affectedRows: Math.floor(Math.random() * 3) + 1
      };
    }
    
    // Default: no rows affected
    return {
      affectedRows: 0
    };
  }
  
  // Method for mock data during development
  private getMockData<T>(sql: string, params: any[] = []): T[] {
    console.log('Simulating SQLite query:', sql, params);
    const sqlLower = sql.toLowerCase();
    
    // Authentication query
    if (sqlLower.includes('select') && sqlLower.includes('from users') && sqlLower.includes('where email')) {
      return [{
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        password: 'admin123', // In a real system, this would be hashed
        status: true,
        credits: 100
      }] as unknown as T[];
    }
    
    // Modules query
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
    
    // Users query
    if (sqlLower.includes('select') && sqlLower.includes('from users') && !sqlLower.includes('where')) {
      return [
        {
          id: 1,
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin',
          status: true,
          credits: 100
        },
        {
          id: 2,
          name: 'Usuário Teste',
          email: 'usuario@example.com',
          role: 'user',
          status: true,
          credits: 50
        },
        {
          id: 3,
          name: 'Usuário Inativo',
          email: 'inativo@example.com',
          role: 'user',
          status: false,
          credits: 0
        }
      ] as unknown as T[];
    }
    
    // Connection test query
    if (sqlLower.includes('select "connected"')) {
      return [{ status: 'connected' }] as unknown as T[];
    }
    
    // Default: empty array
    return [] as T[];
  }
  
  // Close connection (for cleanup)
  public async close(): Promise<void> {
    if (this.db) {
      // In a real implementation, we would close the connection
      // await this.db.close();
      this.db = null;
    }
    this.connected = false;
  }
}

export default SQLiteService;
