import { users } from './mockData';

// Simular autenticação para desenvolvimento
export const signIn = async (email: string, password: string) => {
  // Em um ambiente real, isso seria uma chamada para o Supabase ou outro serviço de autenticação
  const user = users.find(u => u.email === email);
  
  if (user) {
    // Simular um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return { user, error: null };
  }
  
  return { user: null, error: { message: 'Credenciais inválidas' } };
};

export const signUp = async (email: string, password: string, userData: any) => {
  // Em um ambiente real, isso seria uma chamada para o Supabase ou outro serviço de autenticação
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verificar se o e-mail já está em uso
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return { user: null, error: { message: 'E-mail já está em uso' } };
  }
  
  // Criar novo usuário
  const newUser = {
    id: `${users.length + 1}`,
    email,
    user_metadata: {
      ...userData,
      role: userData.role || 'passenger' // Papel padrão
    }
  };
  
  users.push(newUser);
  
  return { user: newUser, error: null };
};

export const signOut = async () => {
  // Em um ambiente real, isso seria uma chamada para o Supabase ou outro serviço de autenticação
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  return { error: null };
};

export const getCurrentUser = async () => {
  // Em um ambiente real, isso verificaria o token de sessão atual
  // Para desenvolvimento, vamos retornar um usuário fixo ou o primeiro usuário da lista
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedUser) {
    return { user: JSON.parse(storedUser), error: null };
  }
  
  // Se não houver usuário armazenado, retornar o primeiro usuário como padrão
  const defaultUser = users[0];
  localStorage.setItem('currentUser', JSON.stringify(defaultUser));
  
  return { user: defaultUser, error: null };
};
