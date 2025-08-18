export interface Module {
  id: string
  name: string
  icon: string
  component: React.ComponentType
  enabled: boolean
}

export class ModuleRegistry {
  private modules = new Map<string, Module>()
  
  register(module: Module) {
    this.modules.set(module.id, module)
  }
  
  getAll() {
    return Array.from(this.modules.values())
  }
  
  get(id: string) {
    return this.modules.get(id)
  }
}

export const moduleRegistry = new ModuleRegistry()
