
import SQLiteService from './SQLiteService';
import { Module } from '@/types/admin';

class ModuleService {
  private static instance: ModuleService;
  private sqlite: SQLiteService;
  
  private constructor() {
    this.sqlite = SQLiteService.getInstance();
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
      const modules = await this.sqlite.query<Module>(query);
      return modules;
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }
  
  public async getEnabledModules(): Promise<Module[]> {
    try {
      const query = `SELECT * FROM modules WHERE enabled = 1`;
      const modules = await this.sqlite.query<Module>(query);
      return modules;
    } catch (error) {
      console.error('Error fetching active modules:', error);
      return [];
    }
  }
  
  public async getModuleById(id: string): Promise<Module | null> {
    try {
      const query = `SELECT * FROM modules WHERE id = ? LIMIT 1`;
      const modules = await this.sqlite.query<Module>(query, [id]);
      return modules.length > 0 ? modules[0] : null;
    } catch (error) {
      console.error('Error fetching module:', error);
      return null;
    }
  }
  
  public async updateModule(module: Module): Promise<boolean> {
    try {
      // In production, would update database
      // For demonstration, save to localStorage to simulate persistence
      const allModules = await this.getAllModules();
      const updatedModules = allModules.map(m => 
        m.id === module.id ? module : m
      );
      
      localStorage.setItem('apiEndpoints', JSON.stringify(updatedModules));
      return true;
    } catch (error) {
      console.error('Error updating module:', error);
      return false;
    }
  }
  
  public async createModule(module: Module): Promise<boolean> {
    try {
      // In production, would insert into database
      // For demonstration, save to localStorage to simulate persistence
      const allModules = await this.getAllModules();
      allModules.push(module);
      
      localStorage.setItem('apiEndpoints', JSON.stringify(allModules));
      return true;
    } catch (error) {
      console.error('Error creating module:', error);
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
      console.error('Error toggling module status:', error);
      return false;
    }
  }
}

export default ModuleService;
