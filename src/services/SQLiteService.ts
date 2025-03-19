import * as SQLite from 'sql.js';

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
  private db: SQLite.Database | null = null;
  private SQL: SQLite.SqlJsStatic | null = null;
  private static DB_STORAGE_KEY = 'consultapro_persistent_db'; // Global storage key for the entire application
  
  private constructor() {
    // Default configuration - should be changed by the application
    this.config = {
      database: 'consultapro.db'
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
    return this.connected && this.db !== null;
  }
  
  // Method to connect to SQLite database
  public async connect(): Promise<boolean> {
    try {
      if (this.db) {
        // Already connected
        this.connected = true;
        return true;
      }
      
      // Initialize sql.js
      if (!this.SQL) {
        this.SQL = await SQLite.default({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
      }
      
      // Try to load the database from localStorage using the global storage key
      const savedDbData = localStorage.getItem(SQLiteService.DB_STORAGE_KEY);
      
      if (savedDbData) {
        // Convert base64 string to Uint8Array
        const binaryString = atob(savedDbData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create database from saved data
        this.db = new this.SQL.Database(bytes);
        console.log('Loaded existing database from persistent storage');
      } else {
        // Create a new database
        this.db = new this.SQL.Database();
        console.log('Created new database - will be stored in persistent storage');
        
        // Initialize with schema
        await this.initializeSchema();
      }
      
      console.log('SQLite connection established');
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error connecting to SQLite:', error);
      this.connected = false;
      return false;
    }
  }
  
  // Initialize database schema
  private async initializeSchema(): Promise<void> {
    if (!this.db) return;
    
    // Create tables if they don't exist
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        credits INTEGER DEFAULT 0,
        status INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        creditCost INTEGER DEFAULT 1,
        enabled INTEGER DEFAULT 1,
        icon TEXT,
        apiUrl TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        module_id TEXT NOT NULL,
        query_data TEXT,
        credits_used INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        result TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (module_id) REFERENCES modules(id)
      )`,
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('credit', 'debit')),
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    ];
    
    for (const sql of tables) {
      this.db.exec(sql);
    }
    
    // Insert sample data if tables are empty
    const userCount = this.db.exec('SELECT COUNT(*) as count FROM users')[0].values[0][0];
    
    if (userCount === 0) {
      // Insert default admin user
      this.db.exec(`
        INSERT INTO users (name, email, password, role, credits, status)
        VALUES ('Administrador', 'admin@consultapro.com', 'admin123', 'admin', 1000, 1)
      `);
      
      // Insert sample regular user
      this.db.exec(`
        INSERT INTO users (name, email, password, role, credits, status)
        VALUES ('Usuário Teste', 'usuario@consultapro.com', 'usuario123', 'user', 50, 1)
      `);
      
      // Insert sample modules
      const modules = [
        {
          id: 'module-personal',
          type: 'personal',
          name: 'Dados Pessoais',
          description: 'Consulta de informações pessoais básicas: nome, idade, documentos, etc.',
          creditCost: 1,
          enabled: 1,
          icon: 'user',
          apiUrl: 'https://api.example.com/v1/personal'
        },
        {
          id: 'module-financial',
          type: 'financial',
          name: 'Dados Financeiros',
          description: 'Consulta de dados financeiros como renda, histórico bancário, etc.',
          creditCost: 5,
          enabled: 1,
          icon: 'dollar-sign',
          apiUrl: 'https://api.example.com/v1/financial'
        },
        {
          id: 'module-address',
          type: 'address',
          name: 'Endereço',
          description: 'Consulta e validação de informações de endereço.',
          creditCost: 2,
          enabled: 1,
          icon: 'map-pin',
          apiUrl: 'https://api.example.com/v1/address'
        },
        {
          id: 'module-employment',
          type: 'employment',
          name: 'Dados Profissionais',
          description: 'Informações sobre histórico profissional e emprego atual.',
          creditCost: 3,
          enabled: 1,
          icon: 'briefcase',
          apiUrl: 'https://api.example.com/v1/employment'
        }
      ];
      
      for (const module of modules) {
        this.db.exec(`
          INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl)
          VALUES ('${module.id}', '${module.type}', '${module.name}', '${module.description}', 
                  ${module.creditCost}, ${module.enabled}, '${module.icon}', '${module.apiUrl}')
        `);
      }
    }
    
    // Save the database to localStorage with the global storage key
    this.saveDatabase();
  }
  
  // Method to execute SELECT queries
  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Ensure we're connected
      if (!this.connected || !this.db) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Unable to connect to database');
        }
      }
      
      // Prepare statement with parameters
      const stmt = this.db!.prepare(sql);
      this.bindParameters(stmt, params);
      
      const results: T[] = [];
      
      // Execute and collect results
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row as unknown as T);
      }
      
      stmt.free();
      
      // Save changes to localStorage after each query
      this.saveDatabase();
      
      return results;
    } catch (error) {
      console.error('Error executing SQLite query:', error);
      throw error;
    }
  }
  
  // Method to execute INSERT, UPDATE, or DELETE operations
  public async execute(sql: string, params: any[] = []): Promise<ExecuteResult> {
    try {
      // Ensure we're connected
      if (!this.connected || !this.db) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Unable to connect to database');
        }
      }
      
      // Execute the statement
      const stmt = this.db!.prepare(sql);
      this.bindParameters(stmt, params);
      
      stmt.step();
      stmt.free();
      
      // For INSERT operations, get the last inserted row ID
      let insertId: number | undefined;
      if (sql.trim().toLowerCase().startsWith('insert')) {
        insertId = this.db!.exec('SELECT last_insert_rowid() as id')[0].values[0][0] as number;
      }
      
      // Get affected rows (not directly available in sql.js)
      // For demonstration, we'll assume 1 row affected
      const affectedRows = 1;
      
      // Save changes to localStorage after each operation
      this.saveDatabase();
      
      return {
        affectedRows,
        insertId
      };
    } catch (error) {
      console.error('Error executing SQLite operation:', error);
      throw error;
    }
  }
  
  // Helper method to bind parameters to a prepared statement
  private bindParameters(stmt: SQLite.Statement, params: any[]): void {
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      
      if (param === null) {
        stmt.bind([null]);
      } else if (typeof param === 'number') {
        stmt.bind([param]);
      } else if (typeof param === 'string') {
        stmt.bind([param]);
      } else if (typeof param === 'boolean') {
        stmt.bind([param ? 1 : 0]);
      } else {
        // For complex objects, convert to JSON string
        stmt.bind([JSON.stringify(param)]);
      }
    }
  }
  
  // Method to check connection
  public async testConnection(): Promise<boolean> {
    try {
      if (!this.connected || !this.db) {
        await this.connect();
      }
      
      if (this.db) {
        const result = this.db.exec('SELECT 1 as connected');
        return result.length > 0 && result[0].values[0][0] === 1;
      }
      
      return false;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }
  
  // Save the current database state to localStorage with the global storage key
  private saveDatabase(): void {
    if (this.db) {
      // Export the database to a Uint8Array
      const data = this.db.export();
      
      // Convert to base64 for localStorage storage
      const base64Data = btoa(String.fromCharCode(...data));
      
      // Save to localStorage with the global storage key
      localStorage.setItem(SQLiteService.DB_STORAGE_KEY, base64Data);
      console.log('Database saved to persistent storage');
    }
  }
  
  // Close connection (for cleanup)
  public async close(): Promise<void> {
    if (this.db) {
      // Save current state before closing
      this.saveDatabase();
      
      // Close the database
      this.db.close();
      this.db = null;
    }
    this.connected = false;
  }
}

export default SQLiteService;
