import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

import { Text } from "@/components";
import { useAuth } from "@/contexts/UserContext";

const actionCardsData = [
  {
    id: "1",
    title: "Minha Agenda",
    image: require("assets/agenda.webp"),
    navigation: "MyAgenda",
  },
  {
    id: "2",
    title: "Minha Saúde",
    image: require("assets/agenda.webp"),
    navigation: "MyHealth",
  },
  {
    id: "3",
    title: "Minhas Bulas",
    image: require("assets/agenda.webp"),
    navigation: "MyLeaflets",
  },
];

// --- COMPONENTES ---

const ScheduleItem = ({ item }: { item: any }) => {
  // Formata a hora
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Usa o medicine_name que buscamos ou um fallback
  const medName = item.medicine_name || "Medicamento";

  const taskDescription = `Tomar ${item.amount} ${item.dosage_unit} de ${medName}`;

  // Cor dinâmica ou padrão
  const badgeColor = item.color || "#BFDBFE";

  return (
    <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-3 mb-3">
      <Text className="text-gray-600 flex-1 mr-2">{taskDescription}</Text>

      <View
        className="px-3 py-1 rounded-md"
        style={{ backgroundColor: badgeColor }}
      >
        <Text className="text-gray-900 font-bold text-xs opacity-80">
          {formatTime(item.start_time)}
        </Text>
      </View>
    </View>
  );
};

const ActionCard = ({ item }: { item: (typeof actionCardsData)[0] }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigation)}
      className="flex-1 rounded-2xl overflow-hidden mx-1 h-40"
    >
      <ImageBackground
        source={item.image}
        className="flex-1 justify-end items-center p-4"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black opacity-30" />
        <View className="bg-blue-700 px-4 py-2 rounded-lg">
          <Text className="text-white font-bold text-center text-xs">
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL ---
export default function ScheduleScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  // 1. Data Atual
  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  // 2. Buscar Agendamentos + Buscar Nomes dos Remédios
  useEffect(() => {
    async function fetchAppointments() {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Passo 1: Buscar os agendamentos (que vêm sem nome)
        const response = await api.get(
          `users/${user.id}/appointments?page=1&pageSize=10`
        );

        // A API pode retornar array direto ou dentro de um objeto.
        // Baseado no seu JSON fornecido, parece ser um array direto, mas no prompt anterior era { appointments: [] }
        // Vou garantir que pegamos o array corretamente:
        const rawAppointments = Array.isArray(response.data)
          ? response.data
          : response.data.appointments || [];

        // Passo 2: Buscar o nome de cada remédio individualmente
        // Usamos Promise.all para fazer todas as requisições ao mesmo tempo (paralelo)
        const enrichedAppointments = await Promise.all(
          rawAppointments.map(async (appt: any) => {
            // Se não tiver ID do remédio, retorna como está
            if (!appt.medicine_id)
              return { ...appt, medicine_name: "Desconhecido" };

            try {
              // Busca os detalhes deste remédio específico
              const medResponse = await api.get(
                `medicines/${appt.medicine_id}`
              );

              // A resposta de medicines/{id} é { medicine: { commercial_name: "..." } }
              const medicineName = medResponse.data.medicine.commercial_name;

              // Retorna o agendamento original + o nome descoberto
              return {
                ...appt,
                medicine_name: medicineName,
              };
            } catch (error) {
              console.log(`Erro ao buscar nome do remédio ${appt.medicine_id}`);
              return { ...appt, medicine_name: "Nome indisponível" };
            }
          })
        );

        setAppointments(enrichedAppointments);
      } catch (error) {
        console.log("Erro ao buscar agendamentos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cabeçalho */}
          <View className="bg-blue-700 pt-6 pb-12 px-5 rounded-b-3xl">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={require("assets/avatar.png")}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <View className="ml-3">
                  <Text className="text-white font-bold text-lg">
                    Olá, {user?.name || "Visitante"}
                  </Text>
                  <Text className="text-blue-200 text-xs">
                    Confira as novas atualizações mensais
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="bg-white/30 p-2 rounded-full">
                <Ionicons name="notifications" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View className="items-center mt-6">
              <Text className="text-white text-4xl font-bold">Hoje</Text>
              <Text className="text-blue-200 mt-1 capitalize">
                {currentDate}
              </Text>
            </View>
          </View>

          {/* Lista de Agendamentos */}
          <View className="bg-white p-5 rounded-2xl mx-4 -mt-8 shadow-md min-h-[150px]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Agendamento
              </Text>
            </View>

            {isLoading ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#1D4ED8" />
              </View>
            ) : appointments.length > 0 ? (
              appointments.map((item) => (
                <ScheduleItem key={item.id} item={item} />
              ))
            ) : (
              <Text className="text-gray-400 text-center py-4">
                Nenhum agendamento encontrado.
              </Text>
            )}
          </View>

          {/* Cartões de Ação */}
          <View className="flex-row justify-between mt-6 px-3">
            {actionCardsData.map((item) => (
              <ActionCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
