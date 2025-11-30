import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definição da tipagem do Usuário (baseado no que você envia e recebe da API)
export interface User {
  token?: string;
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Definição do que o Contexto vai exportar
interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do storage quando o app abre
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@WikiMedic:user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Erro ao carregar dados do usuário", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Função chamada após Login ou Cadastro com sucesso
  async function signIn(userData: User) {
    try {
      setUser(userData);
      // Salva no armazenamento local do celular
      await AsyncStorage.setItem("@WikiMedic:user", JSON.stringify(userData));
    } catch (error) {
      console.log("Erro ao salvar usuário", error);
    }
  }

  // Função de Logout
  async function signOut() {
    try {
      setUser(null);
      await AsyncStorage.removeItem("@WikiMedic:user");
    } catch (error) {
      console.log("Erro ao fazer logout", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
