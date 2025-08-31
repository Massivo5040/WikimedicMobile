import React from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// Importe os ícones da biblioteca que você instalou
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text } from "@/components";

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Image
        source={require("assets/wikimedic_logo.png")} // Substitua pelo caminho do seu logo
        className="w-48 h-24 mb-10"
        resizeMode="contain"
      />

      <View className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
        {/* Input de Email/Telefone */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
          <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Email/Telefone"
            placeholderTextColor="gray"
            keyboardType="email-address"
          />
        </View>

        {/* Input de Senha */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3">
          <MaterialCommunityIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Senha"
            placeholderTextColor="gray"
            secureTextEntry
          />
        </View>

        {/* Esqueceu a senha */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="self-start mt-2"
        >
          <Text className="text-gray-600 underline">Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Botão de Login */}
        <TouchableOpacity
          onPress={() => navigation.navigate("InitialRoute")}
          className="bg-gray-900 w-full py-4 rounded-lg mt-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Link para Cadastrar-se */}
      <View className="flex-row mt-6">
        <Text className="text-gray-600">Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <Text className="text-blue-600 font-bold underline">
            Cadastrar-se
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divisor */}
      <Text className="text-gray-500 my-6">Ou, continuar por...</Text>

      {/* Botões de Redes Sociais */}
      <View className="flex-row justify-center w-full space-x-4">
        <TouchableOpacity className="p-3 border border-gray-300 rounded-lg">
          <FontAwesome name="facebook-f" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border border-gray-300 rounded-lg">
          <FontAwesome name="instagram" size={24} color="#E4405F" />
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border border-gray-300 rounded-lg">
          {/* O ícone do "X" pode variar dependendo da biblioteca */}
          <FontAwesome name="twitter" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border border-gray-300 rounded-lg">
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
