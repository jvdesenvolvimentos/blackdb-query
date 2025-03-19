
import initSqlJs, { Database } from 'sql.js';

interface DatabaseConfig {
  database: string;
  path?: string;
}

interface ExecuteResult {
  affectedRows: number;
  insertId?: number;
}

class SQLiteService {
  private static instance: SQLiteService;
  private config: DatabaseConfig;
  private connected: boolean = false;
  private db: Database | null = null;
  private SQL: any = null;
  
  private constructor() {
    // Default configuration
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
    this.config = {
      ...this.config,
      ...config
    };
    console.log('SQLite config updated:', { database: this.config.database });
  }
  
  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }
  
  public isConnected(): boolean {
    return this.connected && this.db !== null;
  }
  
  // Load database from localStorage
  private loadDatabase(): Uint8Array | null {
    try {
      const storedDb = localStorage.getItem(`sqlite_${this.config.database}`);
      if (storedDb) {
        const binary = atob(storedDb);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      }
      return null;
    } catch (error) {
      console.error('Error loading database from localStorage:', error);
      return null;
    }
  }
  
  // Save database to localStorage
  private saveDatabase(): boolean {
    try {
      if (!this.db) return false;
      
      const data = this.db.export();
      const binary = String.fromCharCode.apply(null, Array.from(data));
      const base64 = btoa(binary);
      
      localStorage.setItem(`sqlite_${this.config.database}`, base64);
      return true;
    } catch (error) {
      console.error('Error saving database to localStorage:', error);
      return false;
    }
  }
  
  // Method to connect to SQLite database
  public async connect(): Promise<boolean> {
    try {
      if (this.db) {
        // Already connected
        this.connected = true;
        return true;
      }
      
      // Initialize SQL.js
      if (!this.SQL) {
        this.SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
      }
      
      // Try to load existing database from localStorage
      const existingData = this.loadDatabase();
      
      if (existingData) {
        // Open existing database
        this.db = new this.SQL.Database(existingData);
        console.log('Loaded existing database from storage');
      } else {
        // Create new database
        this.db = new this.SQL.Database();
        console.log('Created new in-memory database');
      }
      
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
    
    // Begin transaction
    this.db.exec('BEGIN TRANSACTION');
    
    try {
      // Create tables
      for (const sql of tables) {
        this.db.exec(sql);
      }
      
      // Check if user table is empty
      const result = this.db.exec('SELECT COUNT(*) as count FROM users');
      const userCount = result[0]?.values[0]?.[0] || 0;
      
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
      
      this.db.exec('COMMIT');
      
      // Save the database after initialization
      this.saveDatabase();
    } catch (error) {
      this.db.exec('ROLLBACK');
      console.error('Failed to initialize schema:', error);
      throw error;
    }
  }
  
  // Method to execute SELECT queries
  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Ensure we're connected
      if (!this.connected || !this.db) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error('Unable to connect to database');
        }
      }
      
      // Prepare and execute statement
      const stmt = this.db.prepare(sql);
      
      // Bind parameters if any
      if (params.length > 0) {
        stmt.bind(params);
      }
      
      const results: T[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row as T);
      }
      
      // Finalize statement
      stmt.free();
      
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
      let lastId = 0;
      let changes = 0;
      
      try {
        const stmt = this.db.prepare(sql);
        
        // Bind parameters if any
        if (params.length > 0) {
          stmt.bind(params);
        }
        
        // Execute the statement
        stmt.step();
        
        // Get the last inserted row ID
        lastId = this.db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0] as number || 0;
        
        // Get the number of affected rows
        changes = this.db.exec('SELECT changes() as changes')[0]?.values[0]?.[0] as number || 0;
        
        // Finalize statement
        stmt.free();
      } finally {
        // Save the database after each write operation
        this.saveDatabase();
      }
      
      return {
        affectedRows: changes,
        insertId: lastId > 0 ? lastId : undefined
      };
    } catch (error) {
      console.error('Error executing SQLite operation:', error);
      throw error;
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
        return result[0]?.values[0]?.[0] === 1;
      }
      
      return false;
    } catch (error) {
      console.error('Error testing connection:', error);
      this.connected = false;
      return false;
    }
  }
  
  // Close connection (for cleanup)
  public async close(): Promise<void> {
    if (this.db) {
      // Save the database before closing
      this.saveDatabase();
      
      // Close the database
      this.db.close();
      this.db = null;
    }
    this.connected = false;
  }
}

export default SQLiteService;
