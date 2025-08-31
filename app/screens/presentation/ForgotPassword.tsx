import React from "react";
import { View, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// Importe o ícone da biblioteca que você instalou
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text } from "@/components";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 justify-center bg-gray-50 p-6">
      <View className="items-center">
        {/* Seção do Cabeçalho */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-gray-800">Esqueceu</Text>
          <Text className="text-5xl font-bold text-gray-800">sua Senha?</Text>
          <Text className="text-center text-gray-500 mt-4 text-base">
            Insira seu e-mail para que possamos enviar um código de verificação
          </Text>
        </View>

        {/* Card do Formulário */}
        <View className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <Text className="text-gray-700 font-semibold mb-2">
            Insira seu E-mail ou Número de cadastro
          </Text>

          {/* Input de Email/Telefone */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-6">
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

          {/* Botão de Enviar */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword2")}
            className="bg-gray-900 w-full py-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
