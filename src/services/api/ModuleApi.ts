
import SQLiteApi from './SQLiteApi';
import { Module } from '@/types/admin';

export class ModuleApi {
  private static instance: ModuleApi;
  private sqliteApi: SQLiteApi;
  
  private constructor() {
    this.sqliteApi = SQLiteApi.getInstance();
  }
  
  public static getInstance(): ModuleApi {
    if (!ModuleApi.instance) {
      ModuleApi.instance = new ModuleApi();
    }
    return ModuleApi.instance;
  }
  
  public async getAllModules(): Promise<{success: boolean, data?: Module[], error?: string}> {
    try {
      const sql = 'SELECT * FROM modules ORDER BY name ASC';
      const result = await this.sqliteApi.executeQuery<Module>(sql);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
      return {
        success: false,
        error: 'Falha ao buscar módulos'
      };
    }
  }
  
  public async getEnabledModules(): Promise<{success: boolean, data?: Module[], error?: string}> {
    try {
      const sql = 'SELECT * FROM modules WHERE enabled = 1 ORDER BY name ASC';
      const result = await this.sqliteApi.executeQuery<Module>(sql);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Erro ao buscar módulos ativos:', error);
      return {
        success: false,
        error: 'Falha ao buscar módulos ativos'
      };
    }
  }
  
  public async getModuleById(id: string): Promise<{success: boolean, data?: Module, error?: string}> {
    try {
      const sql = 'SELECT * FROM modules WHERE id = ? LIMIT 1';
      const result = await this.sqliteApi.executeQuery<Module>(sql, [id]);
      
      if (!result.success || !result.data || result.data.length === 0) {
        return {
          success: false,
          error: 'Módulo não encontrado'
        };
      }
      
      return {
        success: true,
        data: result.data[0]
      };
    } catch (error) {
      console.error('Erro ao buscar módulo:', error);
      return {
        success: false,
        error: 'Falha ao buscar detalhes do módulo'
      };
    }
  }
  
  public async createModule(module: Omit<Module, 'id'>): Promise<{success: boolean, data?: Module, error?: string}> {
    try {
      // Generate ID based on type and timestamp
      const id = `module-${module.type}-${Date.now().toString(36)}`;
      
      const sql = `
        INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `;
      
      const params = [
        id,
        module.type,
        module.name,
        module.description,
        module.creditCost,
        module.enabled ? 1 : 0,
        module.icon,
        module.apiUrl
      ];
      
      const result = await this.sqliteApi.executeQuery(sql, params);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao criar módulo'
        };
      }
      
      // Return the created module
      return this.getModuleById(id);
    } catch (error) {
      console.error('Erro ao criar módulo:', error);
      return {
        success: false,
        error: 'Falha ao criar módulo'
      };
    }
  }
  
  public async updateModule(module: Module): Promise<{success: boolean, data?: Module, error?: string}> {
    try {
      const sql = `
        UPDATE modules 
        SET type = ?, name = ?, description = ?, creditCost = ?, 
            enabled = ?, icon = ?, apiUrl = ?, updated_at = datetime('now')
        WHERE id = ?
      `;
      
      const params = [
        module.type,
        module.name,
        module.description,
        module.creditCost,
        module.enabled ? 1 : 0,
        module.icon,
        module.apiUrl,
        module.id
      ];
      
      const result = await this.sqliteApi.executeQuery(sql, params);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar módulo'
        };
      }
      
      // Return the updated module
      return this.getModuleById(module.id);
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error);
      return {
        success: false,
        error: 'Falha ao atualizar módulo'
      };
    }
  }
  
  public async toggleModuleStatus(id: string): Promise<{success: boolean, data?: Module, error?: string}> {
    try {
      // First, get the current module
      const moduleResult = await this.getModuleById(id);
      
      if (!moduleResult.success || !moduleResult.data) {
        return {
          success: false,
          error: 'Módulo não encontrado'
        };
      }
      
      const module = moduleResult.data;
      
      // Toggle status
      const sql = 'UPDATE modules SET enabled = ?, updated_at = datetime("now") WHERE id = ?';
      const newStatus = !module.enabled;
      
      const result = await this.sqliteApi.executeQuery(sql, [newStatus ? 1 : 0, id]);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar status do módulo'
        };
      }
      
      // Return module with updated status
      module.enabled = newStatus;
      return {
        success: true,
        data: module
      };
    } catch (error) {
      console.error('Erro ao alterar status do módulo:', error);
      return {
        success: false,
        error: 'Falha ao alterar status do módulo'
      };
    }
  }
  
  public async deleteModule(id: string): Promise<{success: boolean, error?: string}> {
    try {
      const sql = 'DELETE FROM modules WHERE id = ?';
      const result = await this.sqliteApi.executeQuery(sql, [id]);
      
      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Erro ao excluir módulo:', error);
      return {
        success: false,
        error: 'Falha ao excluir módulo'
      };
    }
  }
}

export default ModuleApi;
