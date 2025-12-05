import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definindo a estrutura mínima do remédio para salvar nos favoritos
// Não precisamos salvar a bula inteira no storage, apenas o necessário para listar depois
export interface FavoriteMedicine {
  id: string;
  commercial_name: string;
  description: string;
  image: string | null;
  categories: string[];
}

interface FavoritesContextData {
  favorites: FavoriteMedicine[];
  toggleFavorite: (medicine: FavoriteMedicine) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>(
  {} as FavoritesContextData
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMedicine[]>([]);

  // Carrega os favoritos salvos ao abrir o app
  useEffect(() => {
    async function loadFavorites() {
      const storedFavs = await AsyncStorage.getItem("@WikiMedic:favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    }
    loadFavorites();
  }, []);

  // Salva no AsyncStorage sempre que a lista mudar (opcional, ou pode fazer dentro do toggle)
  useEffect(() => {
    async function saveFavorites() {
      await AsyncStorage.setItem(
        "@WikiMedic:favorites",
        JSON.stringify(favorites)
      );
    }
    // Evita salvar array vazio na primeira renderização se ainda não carregou
    // Mas para simplicidade, vamos salvar direto na função toggle
  }, [favorites]);

  const toggleFavorite = async (medicine: FavoriteMedicine) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === medicine.id);

    let newFavorites;
    if (isAlreadyFavorite) {
      // Remove da lista
      newFavorites = favorites.filter((fav) => fav.id !== medicine.id);
    } else {
      // Adiciona na lista
      newFavorites = [...favorites, medicine];
    }

    setFavorites(newFavorites);
    await AsyncStorage.setItem(
      "@WikiMedic:favorites",
      JSON.stringify(newFavorites)
    );
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites deve ser usado dentro de um FavoritesProvider"
    );
  }
  return context;
}
