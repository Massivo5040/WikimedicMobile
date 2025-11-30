import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components";

import { useAuth } from "@/contexts/UserContext";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
// Em um app real, isso viria de uma API.

const categoriesData = [
  {
    id: "1",
    name: "antibiótico",
    color: "bg-blue-100 text-blue-800",
    icon: "pill",
  },
  {
    id: "2",
    name: "analgésico",
    color: "bg-green-100 text-green-800",
    icon: "medical-bag",
  },
  {
    id: "3",
    name: "homeopáticos",
    color: "bg-red-100 text-red-800",
    icon: "leaf",
  },
  {
    id: "4",
    name: "antiácido",
    color: "bg-yellow-100 text-yellow-800",
    icon: "stomach",
  },
] as const;

const productsData = [
  {
    id: "1",
    name: "Cinaorifoma",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "analgésico",
    categoryColor: "bg-green-500",
  },
  {
    id: "2",
    name: "Paatilanol",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-blue-500",
  },
  {
    id: "3",
    name: "Morelined",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-yellow-500",
  },
  {
    id: "4",
    name: "Rubenomed",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-red-500",
  },
  {
    id: "5",
    name: "Laticroma",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-blue-500",
  },
  {
    id: "6",
    name: "Geonigutol",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-green-500",
  },
];

// --- COMPONENTES ---

// Componente para um Card de Categoria
const CategoryCard = ({ item }: { item: (typeof categoriesData)[number] }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MedicineCategory")}
      className="items-center mr-4"
    >
      <View className="w-20 h-20 justify-center items-center bg-white border border-gray-200 rounded-2xl">
        <MaterialCommunityIcons name={item.icon} size={32} color="#4A5568" />
      </View>
      <Text
        className={`mt-2 px-2 py-1 text-xs font-bold rounded-md ${item.color}`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

// Componente para um Card de Produto
const ProductCard = ({ item }: { item: (typeof productsData)[0] }) => (
  <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-2xl m-2 overflow-hidden">
    <Image source={item.image} className="w-full h-28" resizeMode="cover" />
    <View className="p-3">
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
      <Text className="text-xs text-gray-500">{item.description}</Text>
    </View>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---

export default function HomeScreen() {
  const { user } = useAuth();

  console.log(user);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Cabeçalho */}
          <View className="flex-row items-center justify-between mb-4">
            <Image
              source={require("assets/wikimedic_logo.png")}
              className="w-32 h-10"
              resizeMode="contain"
            />
            <TouchableOpacity>
              <Ionicons
                name="person-circle-outline"
                size={32}
                color="#4A5568"
              />
            </TouchableOpacity>
          </View>

          {/* Barra de Busca */}
          <View className="flex-row items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <View className="bg-blue-200 p-2 rounded-full">
              <Ionicons name="search" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="gray"
              className="flex-1 ml-2 text-base"
            />
          </View>

          {/* Seção de Categorias */}
          <View className="my-6">
            <FlatList
              data={categoriesData}
              renderItem={({ item }) => <CategoryCard item={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Botão de Filtro */}
          <TouchableOpacity className="flex-row self-start items-center bg-white border border-gray-300 rounded-full px-4 py-2 mb-4">
            <MaterialCommunityIcons
              name="filter-variant"
              size={16}
              color="gray"
            />
            <Text className="text-gray-600 ml-2 font-semibold">Filtrar</Text>
          </TouchableOpacity>

          {/* Grade de Produtos */}
          <FlatList
            data={productsData}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false} // Desabilita o scroll da FlatList interna
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
