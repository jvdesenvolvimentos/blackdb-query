
import SQLiteApi from './api/SQLiteApi';

class DatabaseSetupService {
  private static instance: DatabaseSetupService;
  private sqliteApi: SQLiteApi;
  
  private constructor() {
    this.sqliteApi = SQLiteApi.getInstance();
  }
  
  public static getInstance(): DatabaseSetupService {
    if (!DatabaseSetupService.instance) {
      DatabaseSetupService.instance = new DatabaseSetupService();
    }
    return DatabaseSetupService.instance;
  }
  
  // Method to create necessary tables
  public async setupDatabase(): Promise<boolean> {
    try {
      console.log('Starting database setup...');
      
      // Check connection
      const connectionTest = await this.sqliteApi.testConnection();
      if (!connectionTest.success) {
        console.error('Failed to connect to database');
        return false;
      }
      
      // Table creation scripts
      const tables = [
        {
          name: 'users',
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL,
              role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
              credits INTEGER DEFAULT 0,
              status INTEGER DEFAULT 1,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
          `
        },
        {
          name: 'modules',
          sql: `
            CREATE TABLE IF NOT EXISTS modules (
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
            )
          `
        },
        {
          name: 'queries',
          sql: `
            CREATE TABLE IF NOT EXISTS queries (
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
            )
          `
        },
        {
          name: 'transactions',
          sql: `
            CREATE TABLE IF NOT EXISTS transactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              amount INTEGER NOT NULL,
              type TEXT NOT NULL CHECK(type IN ('credit', 'debit')),
              description TEXT,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            )
          `
        }
      ];
      
      // Create tables
      for (const table of tables) {
        console.log(`Creating table ${table.name}...`);
        const result = await this.sqliteApi.executeUpdate(table.sql);
        
        if (!result.success) {
          console.error(`Error creating table ${table.name}:`, result.error);
          return false;
        }
      }
      
      console.log('Database setup completed successfully');
      return true;
    } catch (error) {
      console.error('Error setting up database:', error);
      return false;
    }
  }
  
  // Method to insert sample data
  public async insertSampleData(): Promise<boolean> {
    try {
      console.log('Inserting sample data...');
      
      // Check if data already exists
      const usersResult = await this.sqliteApi.executeQuery('SELECT COUNT(*) as count FROM users');
      
      if (usersResult.success && usersResult.data && usersResult.data[0].count > 0) {
        console.log('Data already exists in the database. Skipping sample data insertion.');
        return true;
      }
      
      // Insert default admin user
      const adminInsert = await this.sqliteApi.executeUpdate(
        'INSERT INTO users (name, email, password, role, credits, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Administrador', 'admin@consultapro.com', 'admin123', 'admin', 1000, 1]
      );
      
      if (!adminInsert.success) {
        console.error('Error inserting admin user:', adminInsert.error);
        return false;
      }
      
      // Insert sample regular user
      const userInsert = await this.sqliteApi.executeUpdate(
        'INSERT INTO users (name, email, password, role, credits, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Usuário Teste', 'usuario@consultapro.com', 'usuario123', 'user', 50, 1]
      );
      
      if (!userInsert.success) {
        console.error('Error inserting test user:', userInsert.error);
        return false;
      }
      
      // Insert sample modules
      const modules = [
        {
          id: 'module-personal',
          type: 'personal',
          name: 'Dados Pessoais',
          description: 'Consulta de informações pessoais básicas: nome, idade, documentos, etc.',
          creditCost: 1,
          enabled: true,
          icon: 'user',
          apiUrl: 'https://api.example.com/v1/personal'
        },
        {
          id: 'module-financial',
          type: 'financial',
          name: 'Dados Financeiros',
          description: 'Consulta de dados financeiros como renda, histórico bancário, etc.',
          creditCost: 5,
          enabled: true,
          icon: 'dollar-sign',
          apiUrl: 'https://api.example.com/v1/financial'
        },
        {
          id: 'module-address',
          type: 'address',
          name: 'Endereço',
          description: 'Consulta e validação de informações de endereço.',
          creditCost: 2,
          enabled: true,
          icon: 'map-pin',
          apiUrl: 'https://api.example.com/v1/address'
        },
        {
          id: 'module-employment',
          type: 'employment',
          name: 'Dados Profissionais',
          description: 'Informações sobre histórico profissional e emprego atual.',
          creditCost: 3,
          enabled: true,
          icon: 'briefcase',
          apiUrl: 'https://api.example.com/v1/employment'
        }
      ];
      
      for (const module of modules) {
        const moduleInsert = await this.sqliteApi.executeUpdate(
          'INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [module.id, module.type, module.name, module.description, module.creditCost, module.enabled ? 1 : 0, module.icon, module.apiUrl]
        );
        
        if (!moduleInsert.success) {
          console.error(`Error inserting module ${module.name}:`, moduleInsert.error);
          return false;
        }
      }
      
      console.log('Sample data inserted successfully');
      return true;
    } catch (error) {
      console.error('Error inserting sample data:', error);
      return false;
    }
  }
  
  // Method to check if database is already configured
  public async isDatabaseConfigured(): Promise<boolean> {
    try {
      // Check if main tables exist
      const tables = ['users', 'modules', 'queries'];
      
      for (const table of tables) {
        const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`;
        const result = await this.sqliteApi.executeQuery(query);
        
        if (!result.success || !result.data || result.data.length === 0) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error checking database configuration:', error);
      return false;
    }
  }
}

export default DatabaseSetupService;
