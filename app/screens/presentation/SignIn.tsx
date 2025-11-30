import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Text } from "@/components";
// 1. Importe o hook useAuth
import { useAuth } from "@/contexts/UserContext"; // Ajuste o caminho conforme sua estrutura

const axios = require("axios").default;

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  // 2. Acesse a função signIn do contexto
  const { signIn } = useAuth();

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isTermsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fulling = () => {
    setFirstName("Arthur");
    setLastName("Rolemberg");
    setEmail("arthurrolemberg12345@gmail.com");
    setPhone("11912345678");
    setPassword("Arthur123");
    setConfirmPassword("Arthur123");
  };

  async function createUser() {
    if (!firstName || !lastName || !email || !phone || !password) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Erro", "As senhas não conferem.");
    }

    if (!isTermsChecked) {
      return Alert.alert(
        "Atenção",
        "Você precisa aceitar os termos e condições."
      );
    }

    if (password.length < 8) {
      return Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres.");
    }

    const payload = {
      user: {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        phone: phone,
        password: password,
      },
    };

    setIsLoading(true);

    try {
      const response = await api.post("users/", payload);

      if (response.status === 200 || response.status === 201) {
        // 3. O backend geralmente retorna o usuário criado no response.data
        // Verifique se a estrutura é response.data diretamente ou response.data.user
        const userData = response.data;

        console.log("Usuário criado:", userData);

        // Salva no contexto global (com ID)
        await signIn({
          id: userData.userId, // O ID deve vir da resposta da API
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        });

        Alert.alert("Sucesso", "Conta criada e logada com sucesso!", [
          {
            text: "OK",
            // Se você usar o contexto para controlar rotas (ex: if user ? <Home> : <Login>),
            // talvez nem precise navegar manualmente, mas se precisar:
            onPress: () => navigation.navigate("Login"), // Mudei para Home, pois já está logado
          },
        ]);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        Alert.alert(
          "Erro ao cadastrar",
          `O servidor respondeu: ${JSON.stringify(error.response.data)}`
        );
      } else if (error.request) {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor."
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // ... (O restante do return do JSX continua igual ao anterior)
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      className="bg-white p-6"
    >
      <View className="items-center">
        <TouchableOpacity onPress={fulling}>
          <Image
            source={require("assets/wikimedic_logo.png")}
            className="w-48 h-24 mb-8"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View className="w-full bg-gray-50 p-6 rounded-lg border border-gray-200">
          {/* Inputs Nome e Sobrenome */}
          <View className="flex-row justify-between mb-4 space-x-4">
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Nome"
              placeholderTextColor="gray"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Sobrenome"
              placeholderTextColor="gray"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Input de Email */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="gray"
            />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Input de Telefone (Novo Campo) */}
          <View className="flex-row items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
            <MaterialCommunityIcons
              name="phone-outline"
              size={20}
              color="gray"
            />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Telefone"
              placeholderTextColor="gray"
              keyboardType="phone-pad" // Teclado numérico para telefone
              value={phone}
              onChangeText={setPhone}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
            onPress={createUser}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg border-2 border-gray-900 ${isLoading ? "bg-gray-200" : "bg-white"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-gray-900 text-center font-bold text-lg">
                Cadastrar-se
              </Text>
            )}
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
