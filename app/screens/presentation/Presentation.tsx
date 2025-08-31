import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { Text } from "@/components";

export default function PresentationScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="flex-1 bg-white">
      {/* Seção da Imagem Superior */}
      <View className="absolute top-0 w-full">
        <Image
          source={require("assets/medical_header.png")} // Substitua pelo caminho da sua imagem de cabeçalho
          className="w-full h-48" // Ajuste a altura conforme necessário
          resizeMode="cover"
        />
      </View>

      {/* Seção Central com Logo e Botões */}
      <View className="flex-1 justify-center items-center mt-24">
        <Image
          source={require("assets/wikimedic_logo.png")} // Substitua pelo caminho do seu logo
          className="w-64 h-32 mb-36"
          resizeMode="contain"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Signin")}
          className="bg-gray-900 w-4/5 py-4 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            Cadastro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="bg-white border border-gray-400 w-4/5 py-4 rounded-lg"
        >
          <Text className="text-black text-center font-bold text-lg">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
