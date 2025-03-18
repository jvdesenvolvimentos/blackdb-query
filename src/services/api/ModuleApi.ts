
import MySQLApi from './MySQLApi';
import { Module } from '@/types/admin';

export class ModuleApi {
  private static instance: ModuleApi;
  private mysqlApi: MySQLApi;
  
  private constructor() {
    this.mysqlApi = MySQLApi.getInstance();
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
      const result = await this.mysqlApi.executeQuery<Module>(sql);
      
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
      const result = await this.mysqlApi.executeQuery<Module>(sql);
      
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
      const result = await this.mysqlApi.executeQuery<Module>(sql, [id]);
      
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
      // Gerar ID baseado no type e timestamp
      const id = `module-${module.type}-${Date.now().toString(36)}`;
      
      const sql = `
        INSERT INTO modules (id, type, name, description, creditCost, enabled, icon, apiUrl, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
      
      const result = await this.mysqlApi.executeQuery(sql, params);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao criar módulo'
        };
      }
      
      // Retornar o módulo criado
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
            enabled = ?, icon = ?, apiUrl = ?, updated_at = NOW()
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
      
      const result = await this.mysqlApi.executeQuery(sql, params);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar módulo'
        };
      }
      
      // Retornar o módulo atualizado
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
      // Primeiro, buscar o módulo atual
      const moduleResult = await this.getModuleById(id);
      
      if (!moduleResult.success || !moduleResult.data) {
        return {
          success: false,
          error: 'Módulo não encontrado'
        };
      }
      
      const module = moduleResult.data;
      
      // Inverter status
      const sql = 'UPDATE modules SET enabled = ?, updated_at = NOW() WHERE id = ?';
      const newStatus = !module.enabled;
      
      const result = await this.mysqlApi.executeQuery(sql, [newStatus ? 1 : 0, id]);
      
      if (!result.success) {
        return {
          success: false,
          error: 'Falha ao atualizar status do módulo'
        };
      }
      
      // Retornar o módulo com status atualizado
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
      const result = await this.mysqlApi.executeQuery(sql, [id]);
      
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
