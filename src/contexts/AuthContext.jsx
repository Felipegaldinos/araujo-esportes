
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login bem-sucedido! 🎉',
        description: 'Bem-vindo(a) ao painel de administrador.',
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Erro de configuração. Verifique as credenciais do Firebase.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciais inválidas. Verifique email e senha.';
          break;
        default:
          errorMessage = `Erro: ${error.message}`;
      }
      
      toast({
        title: 'Erro no login! ❌',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logout realizado! 👋',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Erro ao sair! ❌',
        description: 'Ocorreu um erro ao fazer logout.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
