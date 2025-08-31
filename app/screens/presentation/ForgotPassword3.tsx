import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// Importe os ícones da biblioteca que você instalou
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text } from "@/components";

export default function CreateNewPasswordScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 justify-center bg-gray-50 p-6">
      <View className="items-center">
        {/* Seção do Cabeçalho */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-gray-800">Nova</Text>
          <Text className="text-5xl font-bold text-gray-800">Senha</Text>
          <Text className="text-center text-gray-500 mt-4 text-base">
            Verificação concluída, defina sua nova senha
          </Text>
        </View>

        {/* Card do Formulário */}
        <View className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Input de Nova Senha */}
          <Text className="font-semibold text-gray-700 mb-2">
            Defina sua nova senha
          </Text>
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
          <Text className="font-semibold text-gray-700 mt-4 mb-2">
            Confirmar senha
          </Text>
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-8">
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

          {/* Botão de Confirmar */}
          <TouchableOpacity
            onPress={() => navigation.navigate("InitialRoute")}
            className="bg-gray-900 w-full py-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
