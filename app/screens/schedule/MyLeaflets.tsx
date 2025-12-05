import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

// Importando os Contextos
import { useAuth } from "@/contexts/UserContext";
import { useFavorites, FavoriteMedicine } from "@/contexts/FavoritesContext";

// --- MAPA DE ESTILOS E ÍCONES POR CATEGORIA ---
const categoryColors: Record<string, string> = {
  antibiótico: "bg-blue-400",
  analgésico: "bg-green-400",
  homeopáticos: "bg-red-400",
  antiácido: "bg-yellow-400",
  default: "bg-gray-400",
};

const categoryIcons: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  antibiótico: "pill",
  analgésico: "medical-bag",
  homeopáticos: "leaf",
  antiácido: "stomach",
  default: "bottle-tonic-plus",
};

// --- COMPONENTE DO ITEM ---
const BulaItem = ({ item }: { item: FavoriteMedicine }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  // Lógica para definir categoria, cor e ícone
  const categoryName =
    item.categories && item.categories.length > 0
      ? item.categories[0]
      : "Geral";
  const categoryKey = categoryName.toLowerCase();

  const badgeColor = categoryColors[categoryKey] || categoryColors["default"];
  const iconName = categoryIcons[categoryKey] || categoryIcons["default"];

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MedicineDetails", { medicineId: item.id })
      }
      className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-4"
    >
      {/* Ícone Dinâmico */}
      <View className="bg-gray-100 p-3 rounded-lg mr-4">
        <MaterialCommunityIcons name={iconName} size={32} color="#074CAC" />
      </View>

      {/* Informações */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1 flex-wrap">
          <Text className="text-base font-bold text-gray-800 mr-2">
            {item.commercial_name}
          </Text>
          <View className={`px-2 py-0.5 rounded-full ${badgeColor}`}>
            <Text className="text-xs text-white font-semibold capitalize">
              {categoryName}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500" numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      {/* Seta */}
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL ---
export default function BulasScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  // Usando os Contextos
  const { user } = useAuth();
  const { favorites } = useFavorites();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Cabeçalho Azul Duplo */}
      <View className="bg-blue-700 pt-6 pb-4 px-5">
        {/* Primeira Linha do Cabeçalho */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Image
              source={require("assets/avatar.png")}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <View className="ml-3">
              <Text className="text-white font-bold text-base">
                Olá, {user?.name || "Visitante"}
              </Text>
              <Text className="text-blue-200 text-xs">
                Confira seus favoritos
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white/30 p-2 rounded-full">
            <Ionicons name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Segunda Linha do Cabeçalho */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-white/30 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
            Minhas Bulas
          </Text>
        </View>
      </View>

      {/* Conteúdo da Tela */}
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {favorites.length > 0 ? (
          favorites.map((item) => <BulaItem key={item.id} item={item} />)
        ) : (
          <View className="items-center justify-center mt-20 opacity-50">
            <MaterialCommunityIcons
              name="heart-broken"
              size={64}
              color="gray"
            />
            <Text className="text-gray-500 mt-4 text-center">
              Você ainda não favoritou nenhuma bula.
            </Text>
            <Text className="text-gray-400 text-xs text-center px-10 mt-2">
              Vá até a lista de remédios e clique no coração para adicionar
              aqui.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
