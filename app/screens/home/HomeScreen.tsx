import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

import { Text } from "@/components";
import { useAuth } from "@/contexts/UserContext";

// --- TIPAGEM DA API ---
interface Medicine {
  id: string;
  commercial_name: string;
  description: string;
  registry_code: string;
  categories: string[];
  image: string | null;
}

interface MedicineResponse {
  count: number;
  page: number;
  pageSize: number;
  medicines: Medicine[];
}

// --- DADOS ESTÁTICOS DE CATEGORIA (Mantido para o menu superior) ---
const categoriesData = [
  {
    id: "1",
    name: "antibiótico",
    color: "bg-blue-100 text-blue-800",
    icon: "pill",
  },
  {
    id: "2",
    name: "analgésico",
    color: "bg-green-100 text-green-800",
    icon: "medical-bag",
  },
  {
    id: "3",
    name: "homeopáticos",
    color: "bg-red-100 text-red-800",
    icon: "leaf",
  },
  {
    id: "4",
    name: "antiácido",
    color: "bg-yellow-100 text-yellow-800",
    icon: "stomach",
  },
] as const;

// --- COMPONENTES ---

const CategoryCard = ({ item }: { item: (typeof categoriesData)[number] }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MedicineCategory", {
          categoryName: item.name,
        })
      }
      className="items-center mr-4"
    >
      <View className="w-20 h-20 justify-center items-center bg-white border border-gray-200 rounded-2xl">
        <MaterialCommunityIcons name={item.icon} size={32} color="#4A5568" />
      </View>
      <Text
        className={`mt-2 px-2 py-1 text-xs font-bold rounded-md ${item.color}`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

// Componente adaptado para receber o objeto da API
const ProductCard = ({ item }: { item: Medicine }) => {
  // Lógica para imagem: Se vier da API, usa URI, senão usa imagem local
  const imageSource = item.image
    ? { uri: item.image }
    : require("assets/medicine.webp");

  // Pega a primeira categoria ou define uma padrão
  const categoryName =
    item.categories.length > 0 ? item.categories[0] : "Geral";

  // Define uma cor baseada na categoria (lógica simples para exemplo)
  const categoryColor = "bg-blue-500";

  return (
    <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-2xl m-2 overflow-hidden h-64">
      <Image source={imageSource} className="w-full h-28" resizeMode="cover" />
      <View className="p-3 flex-1">
        <View className="flex-row items-center mb-1 flex-wrap">
          <Text
            className="text-base font-bold text-gray-800 mr-2"
            numberOfLines={1}
          >
            {item.commercial_name}
          </Text>
        </View>
        <View className="self-start mb-2">
          <Text
            className={`text-xs text-white font-semibold px-2 py-0.5 rounded-full ${categoryColor}`}
          >
            {categoryName}
          </Text>
        </View>
        <Text className="text-xs text-gray-500" numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL ---

export default function HomeScreen() {
  const { user } = useAuth();

  const PAGE_SIZE = 10;

  // Estados para gerenciar a lista de remédios
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Controle se ainda tem itens para carregar

  // Configuração Axios
  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  // Função para buscar remédios
  async function fetchMedicines(pageNumber: number) {
    if (isLoading) return;

    setIsLoading(true);

    try {
      console.log(`Buscando página ${pageNumber}...`);

      const response = await api.get<MedicineResponse>(
        `medicines?page=${pageNumber}&pageSize=${PAGE_SIZE}&category=`
      );

      const newMedicines = response.data.medicines;
      const totalCount = response.data.count;

      console.log(
        `Recebidos: ${newMedicines.length} | Total no Banco: ${totalCount}`
      );

      if (pageNumber === 1) {
        setMedicines(newMedicines);
      } else {
        setMedicines((prev) => [...prev, ...newMedicines]);
      }

      const currentTotalLoaded =
        pageNumber === 1
          ? newMedicines.length
          : medicines.length + newMedicines.length;

      // Se o total carregado for maior ou igual ao total do banco, não tem mais.
      // OU se a quantidade que veio agora for 0, também paramos.
      if (currentTotalLoaded >= totalCount || newMedicines.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPage(pageNumber);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os remédios.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMedicines(1);
  }, []);

  function handleLoadMore() {
    // Só carrega se tiver mais, não estiver carregando e tiver itens na tela
    if (hasMore && !isLoading) {
      fetchMedicines(page + 1);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Cabeçalho */}
          <View className="flex-row items-center justify-between mb-4">
            <Image
              source={require("assets/wikimedic_logo.png")}
              className="w-32 h-10"
              resizeMode="contain"
            />
            <TouchableOpacity>
              <Ionicons
                name="person-circle-outline"
                size={32}
                color="#4A5568"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 mb-2">Olá, {user?.name}</Text>

          {/* Barra de Busca */}
          <View className="flex-row items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <View className="bg-blue-200 p-2 rounded-full">
              <Ionicons name="search" size={20} color="white" />
            </View>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="gray"
              className="flex-1 ml-2 text-base"
            />
          </View>

          {/* Seção de Categorias (Estática) */}
          <View className="my-6 items-center">
            <FlatList
              data={categoriesData}
              renderItem={({ item }) => <CategoryCard item={item} />}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Botão de Filtro */}
          <TouchableOpacity className="flex-row self-start items-center bg-white border border-gray-300 rounded-full px-4 py-2 mb-4">
            <MaterialCommunityIcons
              name="filter-variant"
              size={16}
              color="gray"
            />
            <Text className="text-gray-600 ml-2 font-semibold">Filtrar</Text>
          </TouchableOpacity>

          {/* Grade de Produtos (Vinda da API) */}
          <FlatList
            data={medicines}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            ListEmptyComponent={
              !isLoading ? (
                <Text className="text-center text-gray-500 mt-4">
                  Nenhum remédio encontrado.
                </Text>
              ) : null
            }
          />

          {/* Loading Indicator e Botão Carregar Mais */}
          <View className="my-6 items-center">
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#0D1B2A"
                className="mb-4"
              />
            )}

            {/* Mostra o botão se: NÃO está carregando E tem mais itens (hasMore) */}
            {!isLoading && hasMore && medicines.length > 0 && (
              <TouchableOpacity
                onPress={handleLoadMore}
                className="bg-gray-100 px-6 py-3 rounded-full border border-gray-300 active:bg-gray-200"
              >
                <Text className="text-gray-700 font-bold">
                  Carregar mais remédios
                </Text>
              </TouchableOpacity>
            )}

            {/* Mensagem de fim da lista */}
            {!hasMore && medicines.length > 0 && !isLoading && (
              <Text className="text-gray-400 text-sm mt-2">
                Você viu todos os {medicines.length} remédios.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
