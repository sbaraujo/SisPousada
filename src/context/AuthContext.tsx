// =====================================================================
// POUSADA PMS — Contexto de Autenticação e Perfis (RBAC)
// =====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, PerfilCodigo } from '../types';
import { INITIAL_USUARIOS } from '../services/initialData';

interface AuthContextType {
  currentUser: Usuario;
  usuarios: Usuario[];
  switchUser: (userId: number) => void;
  canAccess: (requiredRoles: PerfilCodigo[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [currentUser, setCurrentUser] = useState<Usuario>(() => {
    const saved = localStorage.getItem('pms_active_user_id');
    if (saved) {
      const found = INITIAL_USUARIOS.find((u) => u.id === Number(saved));
      if (found) return found;
    }
    return INITIAL_USUARIOS[0]; // Admin por padrão
  });

  useEffect(() => {
    localStorage.setItem('pms_active_user_id', String(currentUser.id));
  }, [currentUser]);

  const switchUser = (userId: number) => {
    const found = usuarios.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const canAccess = (requiredRoles: PerfilCodigo[]): boolean => {
    if (currentUser.perfil_codigo === 'ADMIN') return true;
    return requiredRoles.includes(currentUser.perfil_codigo);
  };

  return (
    <AuthContext.Provider value={{ currentUser, usuarios, switchUser, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}
