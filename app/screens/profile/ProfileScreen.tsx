import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons/";

// Importa o contexto de autenticação
import { useAuth } from "@/contexts/UserContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";

// --- DADOS DE EXEMPLO ---
const menuItems = [
  { id: "1", title: "Dados do perfil" },
  { id: "2", title: "Notificações" },
  { id: "3", title: "Tema do App" },
  { id: "4", title: "Sair", isDestructive: true },
];

// --- COMPONENTE DO ITEM DE MENU ---
// Agora recebe a prop 'onPress'
const MenuItem = ({
  item,
  onPress,
}: {
  item: (typeof menuItems)[0];
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="py-4 border-b border-gray-200">
    <Text
      className={`text-base ${
        item.isDestructive ? "text-red-500 font-bold" : "text-gray-700"
      }`}
    >
      {item.title}
    </Text>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  // 1. Pegamos os dados do usuário e a função de logout do contexto
  const { user, signOut } = useAuth();

  // 2. Função para lidar com o Logout
  function handleSignOut() {
    Alert.alert(
      "Sair do aplicativo",
      "Tem certeza que deseja desconectar de sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive", // No iOS deixa o texto vermelho
          onPress: async () => {
            // Chama a função do contexto que limpa o AsyncStorage e o estado
            await signOut();
          },
        },
      ]
    );
  }

  // Função para gerenciar cliques no menu
  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case "1":
        navigation.navigate("EditProfile");
        break;
      case "4": // ID do botão Sair
        handleSignOut();
        break;
      default:
        console.log("Outra ação");
        break;
    }
  };

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
              source={require("assets/avatar.png")}
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <Text className="text-white text-xl font-bold mt-4">
              {/* 3. Exibindo nome dinâmico do usuário */}
              {user?.name || "Usuário"}
            </Text>
            <Text className="text-white text-base mt-1">
              {user?.email || ""}
            </Text>
          </View>

          {/* Card de Opções */}
          <View className="bg-white mx-5 p-4 rounded-2xl -mt-10 shadow-md">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                // 4. Passamos a função de clique
                onPress={() => handleMenuPress(item.id)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
