import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text } from "@/components";
import { useAuth } from "@/contexts/UserContext";

const axios = require("axios").default;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    // 1. Validação simples
    if (!email || !password) {
      return Alert.alert("Atenção", "Preencha e-mail e senha.");
    }

    setIsLoading(true);

    try {
      // 2. Requisição PATCH para /users/auth
      const response = await api.patch("users/auth", {
        email: email.trim(), // Remove espaços acidentais
        password: password,
      });
      console.log(response);

      const successCodes = [200, 201];

      if (successCodes.includes(response.status)) {
        const { token, user } = response.data;

        console.log("Login realizado:", user.email);

        // 4. Salva no Contexto (Storage)
        // Precisamos unir o token com os dados do usuário para salvar tudo junto
        await signIn({
          token: token,
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        });

        // 5. Navega para a rota inicial logada
        // Nota: Se suas rotas verificarem 'if (user)', a navegação pode ser automática.
        // Caso contrário, forçamos a navegação:
        navigation.navigate("InitialRoute");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        // Erros vindos da API (ex: 401 - Senha incorreta, 404 - Email não encontrado)
        const mensagemErro =
          error.response.data.message || JSON.stringify(error.response.data);
        Alert.alert("Erro no Login", `Falha ao entrar: ${mensagemErro}`);
      } else if (error.request) {
        // Erro de conexão
        Alert.alert(
          "Sem conexão",
          "Não foi possível conectar ao servidor. Verifique sua internet."
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Image
        source={require("assets/wikimedic_logo.png")}
        className="w-48 h-24 mb-10"
        resizeMode="contain"
      />

      <View className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
        {/* Input de Email */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
          <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Email"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none" // Importante para login
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input de Senha */}
        <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3">
          <MaterialCommunityIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            className="flex-1 mx-3 text-base"
            placeholder="Senha"
            placeholderTextColor="gray"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
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

        {/* Esqueceu a senha */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="self-start mt-2"
        >
          <Text className="text-gray-600 underline">Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Botão de Login */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg mt-6 ${
            isLoading ? "bg-gray-700" : "bg-gray-900"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Login
            </Text>
          )}
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
          <FontAwesome name="twitter" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity className="p-3 border border-gray-300 rounded-lg">
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
