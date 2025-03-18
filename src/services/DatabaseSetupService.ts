
import MySQLApi from './api/MySQLApi';

class DatabaseSetupService {
  private static instance: DatabaseSetupService;
  private mysqlApi: MySQLApi;
  
  private constructor() {
    this.mysqlApi = MySQLApi.getInstance();
  }
  
  public static getInstance(): DatabaseSetupService {
    if (!DatabaseSetupService.instance) {
      DatabaseSetupService.instance = new DatabaseSetupService();
    }
    return DatabaseSetupService.instance;
  }
  
  // Método para criar as tabelas necessárias
  public async setupDatabase(): Promise<boolean> {
    try {
      console.log('Iniciando configuração de banco de dados...');
      
      // Verificar conexão
      const connectionTest = await this.mysqlApi.testConnection();
      if (!connectionTest.success) {
        console.error('Falha na conexão com o banco de dados');
        return false;
      }
      
      // Scripts de criação de tabelas
      const tables = [
        {
          name: 'users',
          sql: `
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              role ENUM('user', 'admin') DEFAULT 'user',
              credits INT DEFAULT 0,
              status BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `
        },
        {
          name: 'modules',
          sql: `
            CREATE TABLE IF NOT EXISTS modules (
              id VARCHAR(50) PRIMARY KEY,
              type VARCHAR(50) NOT NULL,
              name VARCHAR(255) NOT NULL,
              description TEXT,
              creditCost INT DEFAULT 1,
              enabled BOOLEAN DEFAULT TRUE,
              icon VARCHAR(50),
              apiUrl VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `
        },
        {
          name: 'queries',
          sql: `
            CREATE TABLE IF NOT EXISTS queries (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              module_id VARCHAR(50) NOT NULL,
              query_data TEXT,
              credits_used INT DEFAULT 0,
              status VARCHAR(50) DEFAULT 'pending',
              result TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (module_id) REFERENCES modules(id)
            )
          `
        },
        {
          name: 'transactions',
          sql: `
            CREATE TABLE IF NOT EXISTS transactions (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              amount INT NOT NULL,
              type ENUM('credit', 'debit') NOT NULL,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id)
            )
          `
        }
      ];
      
      // Criar tabelas
      for (const table of tables) {
        console.log(`Criando tabela ${table.name}...`);
        const result = await this.mysqlApi.executeUpdate(table.sql);
        
        if (!result.success) {
          console.error(`Erro ao criar tabela ${table.name}:`, result.error);
          return false;
        }
      }
      
      console.log('Configuração de banco de dados concluída com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao configurar o banco de dados:', error);
      return false;
    }
  }
  
  // Método para inserir dados de exemplo
  public async insertSampleData(): Promise<boolean> {
    try {
      console.log('Inserindo dados de exemplo...');
      
      // Verificar se já existem dados
      const usersResult = await this.mysqlApi.executeQuery('SELECT COUNT(*) as count FROM users');
      
      if (usersResult.success && usersResult.data && usersResult.data[0].count > 0) {
        console.log('Já existem dados no banco. Ignorando inserção de dados de exemplo.');
        return true;
      }
      
      // Inserir usuário administrador padrão
      const adminInsert = await this.mysqlApi.executeUpdate(
        'INSERT INTO users (name, email, password, role, credits, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Administrador', 'admin@consultapro.com', 'admin123', 'admin', 1000, true]
      );
      
      if (!adminInsert.success) {
        console.error('Erro ao inserir usuário administrador:', adminInsert.error);
        return false;
      }
      
      // Inserir usuário comum de exemplo
      const userInsert = await this.mysqlApi.executeUpdate(
        'INSERT INTO users (name, email, password, role, credits, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Usuário Teste', 'usuario@consultapro.com', 'usuario123', 'user', 50, true]
      );
      
      if (!userInsert.success) {
        console.error('Erro ao inserir usuário de teste:', userInsert.error);
        return false;
      }
      
      // Inserir módulos de exemplo
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
        const moduleInsert = await this.mysqlApi.executeUpdate(
          'INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [module.id, module.type, module.name, module.description, module.creditCost, module.enabled, module.icon, module.apiUrl]
        );
        
        if (!moduleInsert.success) {
          console.error(`Erro ao inserir módulo ${module.name}:`, moduleInsert.error);
          return false;
        }
      }
      
      console.log('Dados de exemplo inseridos com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inserir dados de exemplo:', error);
      return false;
    }
  }
  
  // Método para verificar se o banco de dados já está configurado
  public async isDatabaseConfigured(): Promise<boolean> {
    try {
      // Verificar se as tabelas principais existem
      const tables = ['users', 'modules', 'queries'];
      
      for (const table of tables) {
        const query = `SHOW TABLES LIKE '${table}'`;
        const result = await this.mysqlApi.executeQuery(query);
        
        if (!result.success || !result.data || result.data.length === 0) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar configuração do banco de dados:', error);
      return false;
    }
  }
}

export default DatabaseSetupService;
