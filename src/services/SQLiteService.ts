
import { Database, Statement } from 'better-sqlite3';

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
  private dbPath: string = './data/'; // Default path for database files
  
  private constructor() {
    // Default configuration
    this.config = {
      database: 'consultapro.db',
      path: './data/'
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
    if (config.path) {
      this.dbPath = config.path;
    }
    this.connected = false; // Reset connection state when config changes
    console.log('SQLite config updated:', { database: this.config.database, path: this.dbPath });
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
      
      // In browser environment, use Electron's fs API or another file-based solution
      // For this implementation, we'll use the better-sqlite3 module which requires Node.js
      // Note: This won't work in a browser-only environment without Electron or similar
      
      const SQLite = (await import('better-sqlite3')).default;
      const fs = (await import('fs')).default;
      const path = (await import('path')).default;
      
      // Ensure database directory exists
      const dbDir = path.resolve(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      const dbFile = path.join(dbDir, this.config.database);
      const dbExists = fs.existsSync(dbFile);
      
      // Create database connection
      this.db = new SQLite(dbFile, { verbose: console.log });
      
      // Initialize schema if new database
      if (!dbExists) {
        console.log('Created new database file at:', dbFile);
        await this.initializeSchema();
      } else {
        console.log('Connected to existing database at:', dbFile);
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
    
    // Create tables in a transaction
    this.db.exec('BEGIN TRANSACTION');
    
    try {
      for (const sql of tables) {
        this.db.exec(sql);
      }
      
      // Check if the user table is empty
      const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
      
      if (userCount.count === 0) {
        // Insert default admin user
        this.db.prepare(`
          INSERT INTO users (name, email, password, role, credits, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('Administrador', 'admin@consultapro.com', 'admin123', 'admin', 1000, 1);
        
        // Insert sample regular user
        this.db.prepare(`
          INSERT INTO users (name, email, password, role, credits, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run('Usuário Teste', 'usuario@consultapro.com', 'usuario123', 'user', 50, 1);
        
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
        
        const insertModule = this.db.prepare(`
          INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const module of modules) {
          insertModule.run(
            module.id,
            module.type,
            module.name,
            module.description,
            module.creditCost,
            module.enabled,
            module.icon,
            module.apiUrl
          );
        }
      }
      
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      console.error('Failed to initialize schema:', error);
      throw error;
    }
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
      
      let results: T[];
      if (params.length > 0) {
        results = stmt.all(...params) as T[];
      } else {
        results = stmt.all() as T[];
      }
      
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
      
      let result;
      if (params.length > 0) {
        result = stmt.run(...params);
      } else {
        result = stmt.run();
      }
      
      return {
        affectedRows: result.changes,
        insertId: result.lastInsertRowid ? Number(result.lastInsertRowid) : undefined
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
        const result = this.db.prepare('SELECT 1 as connected').get() as { connected: number };
        return result.connected === 1;
      }
      
      return false;
    } catch (error) {
      this.connected = false;
      return false;
    }
  }
  
  // Close connection (for cleanup)
  public async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.connected = false;
  }
}

export default SQLiteService;
