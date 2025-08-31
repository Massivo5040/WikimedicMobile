import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import PieChart, { Slice } from "react-native-pie-chart";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const chartData: Slice[] = [
  {
    value: 125,
    color: "#C5B4E3",
  },
  {
    value: 321,
    color: "#8A63D2",
  },
  {
    value: 123,
    color: "#5A3E9A",
  },
];

const legendData = [
  { name: "Dipirona 30mg", value: "10 / 30", color: "#C5B4E3" },
  { name: "Dipirona 30mg", value: "10 / 30", color: "#8A63D2" },
  { name: "Dipirona 30mg", value: "10 / 30", color: "#5A3E9A" },
];

// --- COMPONENTE ---
const LegendItem = ({ item }: { item: (typeof legendData)[0] }) => (
  <View className="flex-row items-center mb-2">
    <View
      style={{ backgroundColor: item.color }}
      className="w-4 h-4 rounded-full mr-3"
    />
    <View>
      <Text className="text-gray-700">{item.name}</Text>
      <Text className="text-gray-500 text-xs">{item.value}</Text>
    </View>
  </View>
);

// --- TELA PRINCIPAL ---
export default function HealthScreen() {
  const widthAndHeight = 150; // Tamanho do gráfico

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
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
              Minha Saúde
            </Text>
          </View>
        </View>

        {/* Conteúdo da Tela */}
        <ScrollView className="p-4">
          <Text className="text-lg font-bold text-gray-700 mb-4">Setembro</Text>

          {/* Card do Gráfico */}
          <View className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex-row items-center">
            <View className="mr-6">
              <PieChart widthAndHeight={widthAndHeight} series={chartData} />
            </View>
            <View className="flex-1">
              {legendData.map((item, index) => (
                <LegendItem key={index} item={item} />
              ))}
            </View>
          </View>

          {/* Card Vazio */}
          <View className="bg-white mt-4 h-48 rounded-2xl border border-gray-200 shadow-sm" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Estilos para o botão central
const styles = StyleSheet.create({
  centralButton: {
    transform: [{ translateY: -20 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
