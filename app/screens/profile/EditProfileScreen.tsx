import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

import { useAuth } from "@/contexts/UserContext";

// Interface para tipar a resposta do GET
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function EditProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user, signIn } = useAuth();

  // Estados do Formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Estado para armazenar o created_at que vem da API
  const [createdAt, setCreatedAt] = useState("");

  // Estados de Carregamento
  const [isFetching, setIsFetching] = useState(true); // Carregando dados iniciais
  const [isSaving, setIsSaving] = useState(false); // Salvando alterações

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  // 1. BUSCAR DADOS COMPLETOS AO ABRIR A TELA (GET)
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;

      try {
        const response = await api.get(`users/${user.id}`);
        const userData: UserData = response.data.user;

        // Preenche os estados com os dados vindos do servidor
        setName(userData.name);
        setEmail(userData.email);
        setPhone(userData.phone);
        setCreatedAt(userData.created_at); // Guardamos o created_at aqui!
      } catch (error) {
        console.log("Erro ao buscar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
        navigation.goBack();
      } finally {
        setIsFetching(false);
      }
    }

    fetchUserData();
  }, [user?.id]);

  // 2. FUNÇÃO DE SALVAR (PATCH)
  async function handleUpdateProfile() {
    if (!name.trim() || !email.trim()) {
      return Alert.alert("Atenção", "Nome e Email são obrigatórios.");
    }

    if (!createdAt) {
      return Alert.alert("Erro", "Dados incompletos. Tente recarregar a tela.");
    }

    setIsSaving(true);

    try {
      // Montar o Payload incluindo o created_at que buscamos no GET
      const payload = {
        fields: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          created_at: createdAt, // <--- Enviando o created_at obrigatório
        },
      };

      console.log("Enviando atualização:", JSON.stringify(payload));

      const response = await api.patch(`users/${user?.id}`, payload);

      if (response.status === 200) {
        // Atualiza o contexto local para refletir a mudança no app
        const updatedUser = {
          id: user!.id,
          token: user!.token,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        };

        await signIn(updatedUser);

        Alert.alert("Sucesso", "Dados atualizados com sucesso!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  }

  // Se estiver carregando os dados iniciais, mostra loading em tela cheia
  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-500 mt-2">Carregando dados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Cabeçalho */}
          <View className="bg-blue-600 pt-6 pb-8 px-5 rounded-b-3xl mb-6">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-white/30 p-2 rounded-full"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
                Editar Perfil
              </Text>
            </View>
            <Text className="text-blue-100 text-center text-sm px-10">
              Mantenha seus dados atualizados.
            </Text>
          </View>

          {/* Formulário */}
          <View className="px-6">
            {/* Input Nome */}
            <View className="mb-4">
              <Text className="text-gray-700 font-bold mb-2 ml-1">
                Nome Completo
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl p-3">
                <Ionicons name="person-outline" size={20} color="gray" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  className="flex-1 ml-3 text-gray-800 text-base"
                />
              </View>
            </View>

            {/* Input Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-bold mb-2 ml-1">E-mail</Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl p-3">
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="gray"
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-3 text-gray-800 text-base"
                />
              </View>
            </View>

            {/* Input Telefone */}
            <View className="mb-8">
              <Text className="text-gray-700 font-bold mb-2 ml-1">
                Telefone
              </Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl p-3">
                <Ionicons name="call-outline" size={20} color="gray" />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Seu telefone"
                  keyboardType="phone-pad"
                  className="flex-1 ml-3 text-gray-800 text-base"
                />
              </View>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={isSaving}
              className={`w-full py-4 rounded-xl flex-row justify-center items-center shadow-sm ${
                isSaving ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons
                    name="save-outline"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold text-lg">
                    Salvar Alterações
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
