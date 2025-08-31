import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const productsData = [
  {
    id: "1",
    name: "Cinaorifoma",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-blue-500",
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
    categoryColor: "bg-blue-500",
  },
  {
    id: "4",
    name: "Rubenomed",
    description:
      "Lorem ipsum tua fosem the industry's standard dummy text ever since.",
    image: require("assets/medicine.webp"),
    category: "categoria",
    categoryColor: "bg-blue-500",
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
    categoryColor: "bg-blue-500",
  },
];

// --- COMPONENTE REUTILIZÁVEL ---
const ProductCard = ({ item }: { item: (typeof productsData)[0] }) => (
  <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-2xl m-2 overflow-hidden shadow-sm">
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
export default function PediatricScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Container Principal */}
      <View className="flex-1">
        {/* Conteúdo rolável */}
        <FlatList
          ListHeaderComponent={
            <>
              {/* Cabeçalho */}
              <View className="p-4 bg-white">
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
              </View>

              {/* Box de Informação da Categoria */}
              <View className="m-4 p-4 bg-white border border-gray-200 rounded-2xl items-center relative">
                <TouchableOpacity className="absolute top-4 left-4 bg-gray-100 p-2 rounded-full">
                  <Ionicons name="arrow-back" size={20} color="#4A5568" />
                </TouchableOpacity>
                <Text className="bg-blue-200 text-blue-800 text-sm font-bold px-4 py-1 rounded-full mb-3">
                  Pediátricos
                </Text>
                <Text className="text-gray-600 text-center">
                  Medicamentos ideais para crianças pequenas desde o nascimento
                  até os 13 anos de idade
                </Text>
              </View>
            </>
          }
          data={productsData}
          renderItem={({ item }) => <ProductCard item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </View>

      {/* Barra de Navegação Inferior (Tab Bar) */}
    </SafeAreaView>
  );
}
