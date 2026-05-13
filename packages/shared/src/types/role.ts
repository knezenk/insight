export type Role = 'super_admin' | 'editor' | 'cliente';

export const RolePermissions: Record<Role, RolePerms> = {
  super_admin: {
    canAdmin: true,
    canEdit: true,
    canViewAllWorkspaces: true,
    canCreateClient: true,
    canManageUsers: true,
    canConfigureAI: true,
    canExportData: true,
    canGeneratePDF: true,
  },
  editor: {
    canAdmin: false,
    canEdit: true,
    canViewAllWorkspaces: true,
    canCreateClient: false,
    canManageUsers: false,
    canConfigureAI: false,
    canExportData: true,
    canGeneratePDF: true,
  },
  cliente: {
    canAdmin: false,
    canEdit: false,
    canViewAllWorkspaces: false,
    canCreateClient: false,
    canManageUsers: false,
    canConfigureAI: false,
    canExportData: false,
    canGeneratePDF: true,
  },
};

export interface RolePerms {
  canAdmin: boolean;
  canEdit: boolean;
  canViewAllWorkspaces: boolean;
  canCreateClient: boolean;
  canManageUsers: boolean;
  canConfigureAI: boolean;
  canExportData: boolean;
  canGeneratePDF: boolean;
}
