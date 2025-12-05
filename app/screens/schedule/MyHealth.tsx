import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
// Importamos a tipagem Slice da biblioteca
import PieChart, { Slice } from "react-native-pie-chart";
import axios from "axios";

import { useAuth } from "@/contexts/UserContext";

// --- TIPAGEM DA API ---
interface SummaryStats {
  taken: number;
  total: number;
  percentage: number;
}

interface SummaryItem {
  id: string;
  medicine_name: string;
  dosage: string;
  color: string;
  stats: SummaryStats;
}

interface SummaryResponse {
  summary_items: SummaryItem[];
}

// --- COMPONENTE: ITEM DA LEGENDA ---
const LegendItem = ({ item }: { item: SummaryItem }) => (
  <View className="flex-row items-center mb-2">
    <View
      style={{ backgroundColor: item.color }}
      className="w-4 h-4 rounded-full mr-3"
    />
    <View>
      <Text className="text-gray-700 font-bold text-xs">
        {item.medicine_name}
      </Text>
      <Text className="text-gray-500 text-[10px]">
        {item.dosage} • {item.stats.taken}/{item.stats.total} tomados
      </Text>
    </View>
  </View>
);

// --- COMPONENTE: BARRA DE PROGRESSO EM BLOCOS ---
const ProgressBarBlocks = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => {
  const totalBlocks = 8;
  const activeBlocks = Math.round((percentage / 100) * totalBlocks);

  return (
    <View className="flex-row gap-1 flex-1 h-6">
      {Array.from({ length: totalBlocks }).map((_, index) => {
        const isActive = index < activeBlocks;
        return (
          <View
            key={index}
            className="flex-1 rounded-sm"
            style={{
              backgroundColor: isActive ? color : "#E5E7EB",
              opacity: isActive ? 1 : 0.5,
            }}
          />
        );
      })}
    </View>
  );
};

// --- COMPONENTE: ITEM DE TRATAMENTO ---
const TreatmentItem = ({ item }: { item: SummaryItem }) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600 text-xs font-bold">
          {item.medicine_name}
        </Text>
        <Text className="text-gray-400 text-[10px]">{item.dosage}</Text>
      </View>

      <View className="flex-row items-center">
        <ProgressBarBlocks
          percentage={item.stats.percentage}
          color={item.color}
        />
        <View className="ml-3 items-end w-12">
          <Text className="text-gray-800 font-bold text-sm">
            {item.stats.percentage}%
          </Text>
          <Text className="text-gray-400 text-[8px]">Concluídos</Text>
        </View>
      </View>
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function HealthScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([]);

  // CORREÇÃO: O estado agora é do tipo Slice[]
  const [chartData, setChartData] = useState<Slice[]>([]);

  const [currentMonthName, setCurrentMonthName] = useState("");
  const widthAndHeight = 150;

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  useEffect(() => {
    async function fetchSummary() {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const now = new Date();
        const monthName = now.toLocaleDateString("pt-BR", { month: "long" });
        setCurrentMonthName(
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        );

        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const response = await api.get<SummaryResponse>(
          `appointments/summary/${user.id}/${month}/${year}`
        );

        const items = response.data.summary_items || [];
        setSummaryData(items);

        // --- CORREÇÃO AQUI ---
        // Mapeamos os dados para o formato de objeto { value, color } exigido pelo Slice[]
        const newChartData: Slice[] = items.map((item) => ({
          value: item.stats.total > 0 ? item.stats.total : 1, // Evita valor 0 para não quebrar o gráfico
          color: item.color,
        }));

        setChartData(newChartData);
      } catch (error) {
        console.log("Erro ao buscar resumo:", error);
        Alert.alert("Erro", "Não foi possível carregar o resumo mensal.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, [user]);

  const hasData = summaryData.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Cabeçalho */}
        <View className="bg-blue-700 pt-6 pb-4 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Image
                source={require("assets/avatar.png")}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <View className="ml-3">
                <Text className="text-white font-bold text-base">
                  Olá, {user?.name || "Usuário"}
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
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-white/30 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
              Minha Saúde
            </Text>
          </View>
        </View>

        {/* Conteúdo */}
        <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-bold text-center text-gray-700 mb-4 capitalize">
            {currentMonthName}
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
          ) : hasData ? (
            <>
              {/* Card do Gráfico */}
              <View className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex-row items-center justify-between mb-6">
                <View className="mr-2">
                  {/* CORREÇÃO: Removido sliceColor e passado chartData (Slice[]) para series */}
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={chartData}
                  />
                </View>
                <View className="flex-1 ml-2">
                  {summaryData.slice(0, 3).map((item) => (
                    <LegendItem key={item.id} item={item} />
                  ))}
                </View>
              </View>

              <Text className="text-lg font-bold text-gray-800 mb-2 text-center">
                Meus Tratamentos
              </Text>

              {/* Lista de Tratamentos */}
              <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-10">
                <Text className="text-sm font-bold text-gray-700 mb-4">
                  Resumo de {currentMonthName}
                </Text>

                {summaryData.map((item) => (
                  <TreatmentItem key={item.id} item={item} />
                ))}
              </View>
            </>
          ) : (
            <View className="items-center justify-center mt-10 opacity-50">
              <Ionicons name="stats-chart-outline" size={64} color="gray" />
              <Text className="text-gray-500 mt-4 text-center">
                Nenhum dado de saúde encontrado para este mês.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
