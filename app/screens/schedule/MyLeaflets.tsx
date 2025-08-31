import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const bulasData = [
  {
    id: "1",
    name: "Tuxtuxfenol",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    category: "Categoria",
    categoryColor: "bg-blue-400",
    icon: "heart-plus-outline",
  },
  {
    id: "2",
    name: "Rûbenomed",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    category: "Categoria",
    categoryColor: "bg-red-400",
    icon: "pill",
  },
  {
    id: "3",
    name: "Nacitarol",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    category: "Categoria",
    categoryColor: "bg-yellow-400",
    icon: "chart-bar",
  },
  {
    id: "4",
    name: "Mortismed",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    category: "Categoria",
    categoryColor: "bg-red-400",
    icon: "leaf",
  },
] as const;

// --- COMPONENTE ---
const BulaItem = ({ item }: { item: (typeof bulasData)[number] }) => (
  <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-4">
    {/* Ícone */}
    <View className="bg-gray-100 p-3 rounded-lg mr-4">
      <MaterialCommunityIcons name={item.icon} size={32} color="#5A3E9A" />
    </View>

    {/* Informações */}
    <View className="flex-1">
      <View className="flex-row items-center mb-1">
        <Text className="text-base font-bold text-gray-800 mr-2">
          {item.name}
        </Text>
        <Text
          className={`text-xs text-white font-semibold px-2 py-0.5 rounded-full ${item.categoryColor}`}
        >
          {item.category}
        </Text>
      </View>
      <Text className="text-xs text-gray-500" numberOfLines={2}>
        {item.description}
      </Text>
    </View>

    {/* Seta */}
    <Ionicons name="chevron-forward" size={24} color="gray" />
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function BulasScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Cabeçalho Roxo Duplo */}
      <View className="bg-purple-700 pt-6 pb-4 px-5">
        {/* Primeira Linha do Cabeçalho */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Image
              source={require("assets/avatar.png")} // Substitua pela imagem do avatar
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <View className="ml-3">
              <Text className="text-white font-bold text-base">
                Olá, Dolores
              </Text>
              <Text className="text-purple-200 text-xs">
                Confira as novas atualizações mensais
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white/30 p-2 rounded-full">
            <Ionicons name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {/* Segunda Linha do Cabeçalho */}
        <View className="flex-row items-center">
          <TouchableOpacity className="bg-white/30 p-2 rounded-full">
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
            Minhas Bulas
          </Text>
        </View>
      </View>

      {/* Conteúdo da Tela */}
      <ScrollView className="p-4">
        {bulasData.map((item) => (
          <BulaItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
