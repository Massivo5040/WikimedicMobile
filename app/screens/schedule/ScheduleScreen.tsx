import React from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const scheduleData = [
  { id: "1", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "2", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "3", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "4", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
];

const actionCardsData = [
  {
    id: "1",
    title: "Minha Agenda",
    image: require("assets/agenda.webp"),
    navigation: "MyAgenda",
  },
  {
    id: "2",
    title: "Minha Saúde",
    image: require("assets/agenda.webp"),
    navigation: "MyHealth",
  },
  {
    id: "3",
    title: "Minhas Bulas",
    image: require("assets/agenda.webp"),
    navigation: "MyLeaflets",
  },
];

// --- COMPONENTES ---

// Componente para um item da agenda
const ScheduleItem = ({ item }: { item: (typeof scheduleData)[0] }) => (
  <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-3 mb-3">
    <Text className="text-gray-600">{item.task}</Text>
    <View className="bg-purple-200 px-3 py-1 rounded-md">
      <Text className="text-purple-800 font-bold text-xs">{item.time}</Text>
      <Text className="text-purple-800 font-bold text-xs">{item.time}</Text>
    </View>
  </View>
);

// Componente para um cartão de ação
const ActionCard = ({ item }: { item: (typeof actionCardsData)[0] }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigation)}
      className="flex-1 rounded-2xl overflow-hidden mx-1 h-40"
    >
      <ImageBackground
        source={item.image}
        className="flex-1 justify-end items-center p-4"
        resizeMode="cover"
      >
        {/* Overlay para escurecer a imagem e melhorar a legibilidade */}
        <View className="absolute inset-0 bg-black opacity-30" />
        <View className="bg-purple-700 px-4 py-2 rounded-lg">
          <Text className="text-white font-bold">{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL ---
export default function ScheduleScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cabeçalho Roxo */}
          <View className="bg-purple-700 pt-6 pb-12 px-5 rounded-b-3xl">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={require("assets/avatar.png")} // Substitua pela imagem do avatar
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <View className="ml-3">
                  <Text className="text-white font-bold text-lg">
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
            <View className="items-center mt-6">
              <Text className="text-white text-4xl font-bold">Hoje</Text>
              <Text className="text-purple-200 mt-1">13 de Agosto de 2025</Text>
            </View>
          </View>

          {/* Card de Agendamento */}
          <View className="bg-white p-5 rounded-2xl mx-4 -mt-8 shadow-md">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Agendamento
            </Text>
            {scheduleData.map((item) => (
              <ScheduleItem key={item.id} item={item} />
            ))}
          </View>

          {/* Seção de Cartões de Ação */}
          <View className="flex-row justify-between mt-6 px-3">
            {actionCardsData.map((item) => (
              <ActionCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Barra de Navegação Inferior (Tab Bar) */}
    </SafeAreaView>
  );
}
