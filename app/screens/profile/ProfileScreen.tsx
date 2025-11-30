import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons/";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const menuItems = [
  { id: "1", title: "Dados do perfil" },
  { id: "2", title: "Notificações" },
  { id: "3", title: "Tema do App" },
  { id: "4", title: "Sair", isDestructive: true }, // Propriedade para estilo especial
];

// --- COMPONENTE ---
const MenuItem = ({ item }: { item: (typeof menuItems)[0] }) => (
  <TouchableOpacity className="py-4 border-b border-gray-200">
    <Text
      className={`text-base ${item.isDestructive ? "text-red-500 font-bold" : "text-gray-700"}`}
    >
      {item.title}
    </Text>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Cabeçalho Azul */}
          <View className="bg-blue-600 items-center pt-10 pb-16 px-6 rounded-b-3xl">
            {/* Botão de Notificação */}
            <TouchableOpacity className="absolute top-14 right-6 bg-white/30 p-2 rounded-full">
              <Ionicons name="notifications" size={20} color="white" />
            </TouchableOpacity>

            {/* Imagem e Informações do Perfil */}
            <Image
              source={require("assets/avatar.png")} // Substitua pela imagem do avatar
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <Text className="text-white text-xl font-bold mt-4">
              Dolores Soarez de Moraes
            </Text>
            <Text className="text-white text-base mt-1">45 anos</Text>
          </View>

          {/* Card de Opções */}
          <View className="bg-white mx-5 p-4 rounded-2xl -mt-10 shadow-md">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
