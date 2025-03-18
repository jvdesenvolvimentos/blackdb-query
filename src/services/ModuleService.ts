
import MySQLService from './MySQLService';
import { Module } from '@/types/admin';

class ModuleService {
  private static instance: ModuleService;
  private mysql: MySQLService;
  
  private constructor() {
    this.mysql = MySQLService.getInstance();
  }
  
  public static getInstance(): ModuleService {
    if (!ModuleService.instance) {
      ModuleService.instance = new ModuleService();
    }
    return ModuleService.instance;
  }
  
  public async getAllModules(): Promise<Module[]> {
    try {
      const query = `SELECT * FROM modules`;
      const modules = await this.mysql.query<Module>(query);
      return modules;
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
      return [];
    }
  }
  
  public async getEnabledModules(): Promise<Module[]> {
    try {
      const query = `SELECT * FROM modules WHERE enabled = 1`;
      const modules = await this.mysql.query<Module>(query);
      return modules;
    } catch (error) {
      console.error('Erro ao buscar módulos ativos:', error);
      return [];
    }
  }
  
  public async getModuleById(id: string): Promise<Module | null> {
    try {
      const query = `SELECT * FROM modules WHERE id = ? LIMIT 1`;
      const modules = await this.mysql.query<Module>(query, [id]);
      return modules.length > 0 ? modules[0] : null;
    } catch (error) {
      console.error('Erro ao buscar módulo:', error);
      return null;
    }
  }
  
  public async updateModule(module: Module): Promise<boolean> {
    try {
      // Em produção, atualizaria o banco de dados
      // Para demonstração, salvamos no localStorage para simular persistência
      const allModules = await this.getAllModules();
      const updatedModules = allModules.map(m => 
        m.id === module.id ? module : m
      );
      
      localStorage.setItem('apiEndpoints', JSON.stringify(updatedModules));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      return false;
    }
  }
  
  public async createModule(module: Module): Promise<boolean> {
    try {
      // Em produção, inseriria no banco de dados
      // Para demonstração, salvamos no localStorage para simular persistência
      const allModules = await this.getAllModules();
      allModules.push(module);
      
      localStorage.setItem('apiEndpoints', JSON.stringify(allModules));
      return true;
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      return false;
    }
  }
  
  public async toggleModuleStatus(id: string): Promise<boolean> {
    try {
      const module = await this.getModuleById(id);
      if (!module) return false;
      
      module.enabled = !module.enabled;
      return await this.updateModule(module);
    } catch (error) {
      console.error('Erro ao alterar status do módulo:', error);
      return false;
    }
  }
}

export default ModuleService;
