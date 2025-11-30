import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

// --- TIPAGEM ---
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

type RootStackParamList = {
  CategoryScreen: { categoryName: string };
};

type CategoryScreenRouteProp = RouteProp<RootStackParamList, "CategoryScreen">;

// --- CONFIGURAÇÃO DE CORES E TEXTOS ---

// 1. Mapa de Cores (Fundo Claro + Texto Escuro)
const categoryStyles: Record<string, string> = {
  antibiótico: "bg-blue-100 text-blue-800",
  analgésico: "bg-green-100 text-green-800",
  homeopáticos: "bg-red-100 text-red-800",
  antiácido: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

// 2. Mapa de Cores Sólidas (Para as tags dos cards - Fundo Escuro)
const categorySolidStyles: Record<string, string> = {
  antibiótico: "bg-blue-500",
  analgésico: "bg-green-500",
  homeopáticos: "bg-red-500",
  antiácido: "bg-yellow-500",
  default: "bg-gray-500",
};

// 3. Mapa de Descrições
const categoryDescriptions: Record<string, string> = {
  antibiótico:
    "Medicamentos usados para tratar infecções causadas por bactérias, impedindo seu crescimento ou destruindo-as.",
  analgésico:
    "Medicamentos indicados para o alívio de dores de diversas intensidades e redução da febre.",
  homeopáticos:
    "Terapias baseadas no princípio de que 'o semelhante cura o semelhante', usando substâncias diluídas.",
  antiácido:
    "Medicamentos que neutralizam a acidez do estômago, aliviando sintomas de azia e má digestão.",
  default: "Lista de medicamentos disponíveis nesta categoria.",
};

// Função auxiliar para pegar a cor segura
const getCategoryStyle = (name: string, type: "light" | "solid") => {
  const key = name.toLowerCase();
  const map = type === "light" ? categoryStyles : categorySolidStyles;
  return map[key] || map["default"];
};

// --- COMPONENTE DO CARD ---
const ProductCard = ({ item }: { item: Medicine }) => {
  const imageSource = item.image
    ? { uri: item.image }
    : require("assets/medicine.webp");

  const categoryName =
    item.categories.length > 0 ? item.categories[0] : "Geral";
  // Pega a cor baseada na categoria do item
  const badgeColor = getCategoryStyle(categoryName, "solid");

  return (
    <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-2xl m-2 overflow-hidden shadow-sm h-64">
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
          {/* Aplica a cor dinâmica aqui */}
          <Text
            className={`text-xs text-white font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}
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
export default function CategoryScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<CategoryScreenRouteProp>();

  const categoryName = route.params?.categoryName || "Geral";
  const formattedCategory = categoryName.toLowerCase();

  const descriptionText =
    categoryDescriptions[formattedCategory] || categoryDescriptions["default"];

  // Pega o estilo (bg-cor e text-cor) baseado na categoria atual
  const headerStyle = getCategoryStyle(formattedCategory, "light");

  const PAGE_SIZE = 10;
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  async function fetchMedicines(pageNumber: number) {
    if (isLoading) return;

    setIsLoading(true);

    try {
      console.log(`Buscando ${categoryName} - Página ${pageNumber}...`);

      const response = await api.get<MedicineResponse>(
        `medicines?page=${pageNumber}&pageSize=${PAGE_SIZE}&category=`
      );

      const newMedicines = response.data.medicines;
      const totalCount = response.data.count;

      if (pageNumber === 1) {
        setMedicines(newMedicines);
      } else {
        setMedicines((prev) => [...prev, ...newMedicines]);
      }

      const currentTotalLoaded =
        pageNumber === 1
          ? newMedicines.length
          : medicines.length + newMedicines.length;

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
  }, [categoryName]);

  function handleLoadMore() {
    if (hasMore && !isLoading) {
      fetchMedicines(page + 1);
    }
  }

  const ListHeader = () => (
    <>
      <View className="p-4 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <Image
            source={require("assets/wikimedic_logo.png")}
            className="w-32 h-10"
            resizeMode="contain"
          />
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="#4A5568" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-full p-1 border border-gray-200">
          <View className="bg-blue-200 p-2 rounded-full">
            <Ionicons name="search" size={20} color="white" />
          </View>
          <TextInput
            placeholder={`Buscar em ${categoryName}...`}
            placeholderTextColor="gray"
            className="flex-1 ml-2 text-base"
          />
        </View>
      </View>

      <View className="m-4 p-4 bg-white border border-gray-200 rounded-2xl items-center relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4 bg-gray-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={20} color="#4A5568" />
        </TouchableOpacity>

        {/* AQUI ESTÁ A MUDANÇA: headerStyle aplicado dinamicamente */}
        <Text
          className={`${headerStyle} text-sm font-bold px-4 py-1 rounded-full mb-3 capitalize`}
        >
          {categoryName}
        </Text>

        <Text className="text-gray-600 text-center px-4">
          {descriptionText}
        </Text>
      </View>
    </>
  );

  const ListFooter = () => (
    <View className="my-6 items-center px-4 pb-8">
      {isLoading && (
        <ActivityIndicator size="large" color="#0D1B2A" className="mb-4" />
      )}

      {!isLoading && hasMore && medicines.length > 0 && (
        <TouchableOpacity
          onPress={handleLoadMore}
          className="bg-gray-100 px-6 py-3 rounded-full border border-gray-300 w-full items-center"
        >
          <Text className="text-gray-700 font-bold">Carregar mais</Text>
        </TouchableOpacity>
      )}

      {!hasMore && medicines.length > 0 && !isLoading && (
        <Text className="text-gray-400 text-sm mt-2">
          Fim da lista de {categoryName}.
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={medicines}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          !isLoading ? (
            <Text className="text-center text-gray-500 mt-10">
              Nenhum medicamento encontrado.
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
