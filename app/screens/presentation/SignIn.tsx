import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// Importe os ícones da biblioteca que você instalou
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text } from "@/components";

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      className="bg-white p-6"
    >
      <View className="items-center">
        <Image
          source={require("assets/wikimedic_logo.png")} // Substitua pelo caminho do seu logo
          className="w-48 h-24 mb-8"
          resizeMode="contain"
        />

        <View className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
          {/* Inputs Nome e Sobrenome */}
          <View className="flex-row justify-between mb-4 space-x-4">
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Nome"
              placeholderTextColor="gray"
            />
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Sobrenome"
              placeholderTextColor="gray"
            />
          </View>

          {/* Input de Email/Telefone */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="gray"
            />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Email/Telefone"
              placeholderTextColor="gray"
              keyboardType="email-address"
            />
          </View>

          {/* Input de Senha */}
          <Text className="font-bold text-gray-700 mb-2">Defina sua senha</Text>
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3">
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color="gray"
            />
            <TextInput
              className="flex-1 mx-3 text-base"
              placeholder="Senha"
              placeholderTextColor="gray"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <MaterialCommunityIcons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-xs mt-2 ml-1">
            • Ao menos 8 caracteres
          </Text>

          {/* Input de Confirmar Senha */}
          <Text className="font-bold text-gray-700 mt-4 mb-2">
            Confirmar senha
          </Text>
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color="gray"
            />
            <TextInput
              className="flex-1 mx-3 text-base"
              placeholder="Senha"
              placeholderTextColor="gray"
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <MaterialCommunityIcons
                name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Checkbox de Termos e Condições */}
          <TouchableOpacity
            className="flex-row items-center my-4"
            onPress={() => setTermsChecked(!isTermsChecked)}
          >
            <MaterialCommunityIcons
              name={
                isTermsChecked ? "checkbox-marked" : "checkbox-blank-outline"
              }
              size={24}
              color={isTermsChecked ? "#0D1B2A" : "gray"}
            />
            <Text className="text-gray-600 ml-2">
              Li e concordo com os termos e condições
            </Text>
          </TouchableOpacity>

          {/* Botão de Cadastrar-se */}
          <TouchableOpacity
            onPress={() => navigation.navigate("InitialRoute")}
            className="bg-white border-2 border-gray-900 w-full py-3 rounded-lg"
          >
            <Text className="text-gray-900 text-center font-bold text-lg">
              Cadastrar-se
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link para Entrar */}
        <View className="flex-row mt-6">
          <Text className="text-gray-600">Já possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-blue-600 font-bold underline">Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
