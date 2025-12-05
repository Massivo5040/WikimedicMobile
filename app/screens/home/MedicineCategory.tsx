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
  categories: string[]; // Array de strings com as categorias
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

const categoryStyles: Record<string, string> = {
  pediátricos: "bg-cyan-100 text-cyan-800",
  similares: "bg-orange-100 text-orange-800",
  fitoterápicos: "bg-green-100 text-green-800",
  alopáticos: "bg-red-100 text-red-800",
  genéricos: "bg-purple-100 text-purple-800",
  geral: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800",
};

const categorySolidStyles: Record<string, string> = {
  pediátricos: "bg-cyan-600",
  similares: "bg-orange-500",
  fitoterápicos: "bg-green-600",
  alopáticos: "bg-red-600",
  genéricos: "bg-purple-600",
  geral: "bg-gray-500",
  default: "bg-gray-500",
};

const categoryDescriptions: Record<string, string> = {
  pediátricos:
    "Medicamentos desenvolvidos especialmente para bebês e crianças, com dosagens adequadas.",
  similares:
    "Medicamentos com o mesmo princípio ativo e indicação do referência, mas com marca própria.",
  fitoterápicos:
    "Medicamentos obtidos de plantas medicinais e seus derivados, com eficácia comprovada.",
  alopáticos:
    "Medicamentos tradicionais que produzem efeitos contrários aos sintomas da doença.",
  genéricos:
    "Medicamentos com o mesmo princípio ativo do referência, mas geralmente mais acessíveis.",
  geral: "Lista completa de todos os medicamentos disponíveis no catálogo.",
  default: "Lista de medicamentos disponíveis nesta categoria.",
};

const getCategoryStyle = (name: string, type: "light" | "solid") => {
  const key = name ? name.toLowerCase() : "default";
  const map = type === "light" ? categoryStyles : categorySolidStyles;
  return map[key] || map["default"];
};

// --- COMPONENTE DO CARD ---
const ProductCard = ({ item }: { item: Medicine }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const imageSource = item.image
    ? { uri: item.image }
    : require("assets/medicine.webp");

  const categoryName =
    item.categories.length > 0 ? item.categories[0] : "Geral";

  // Usa a primeira categoria do remédio para definir a cor da etiqueta
  const badgeColor = getCategoryStyle(categoryName, "solid");

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MedicineDetails", { medicineId: item.id })
      }
      className="flex-1 bg-white border border-gray-200 rounded-2xl m-2 overflow-hidden shadow-sm h-64"
    >
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

  const headerStyle = getCategoryStyle(formattedCategory, "light");

  // Aumentei o pageSize para garantir que, ao filtrar localmente, tenhamos chance de achar itens
  const PAGE_SIZE = 50;

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
      console.log(
        `Buscando página ${pageNumber} (Filtro Local: ${categoryName})...`
      );

      // 1. Busca TUDO da API (sem filtro na URL)
      const response = await api.get<MedicineResponse>(
        `medicines?page=${pageNumber}&pageSize=${PAGE_SIZE}`
      );

      const fetchedMedicines = response.data.medicines;
      const totalCount = response.data.count; // Total no banco (sem filtro)

      // 2. Filtragem Local (Client-Side)
      let filteredNewMedicines: Medicine[] = [];

      if (categoryName === "Geral") {
        // Se for Geral, mostra tudo
        filteredNewMedicines = fetchedMedicines;
      } else {
        // Filtra verificando se o array de categorias do remédio contem a categoria selecionada
        filteredNewMedicines = fetchedMedicines.filter((med) =>
          med.categories.some((cat) => cat.toLowerCase() === formattedCategory)
        );
      }

      console.log(
        `Itens recebidos: ${fetchedMedicines.length} | Itens após filtro: ${filteredNewMedicines.length}`
      );

      // 3. Atualiza o Estado
      if (pageNumber === 1) {
        setMedicines(filteredNewMedicines);
      } else {
        setMedicines((prev) => [...prev, ...filteredNewMedicines]);
      }

      // 4. Lógica do "Carregar Mais"
      // Se a API retornou menos itens do que o pageSize, significa que acabou o banco de dados.
      // Usamos fetchedMedicines.length para saber se a API esgotou, e não o filtrado.
      if (fetchedMedicines.length < PAGE_SIZE) {
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

  // Reseta a lista e busca do zero quando a categoria muda
  useEffect(() => {
    setMedicines([]);
    setPage(1);
    setHasMore(true);
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

      {!isLoading && hasMore && (
        <TouchableOpacity
          onPress={handleLoadMore}
          className="bg-gray-100 px-6 py-3 rounded-full border border-gray-300 w-full items-center active:bg-gray-200"
        >
          <Text className="text-gray-700 font-bold">
            {medicines.length === 0 ? "Buscar remédios" : "Carregar mais"}
          </Text>
        </TouchableOpacity>
      )}

      {!hasMore && !isLoading && (
        <Text className="text-gray-400 text-sm mt-2">
          {medicines.length > 0
            ? `Fim da lista de ${categoryName}.`
            : "Nenhum remédio encontrado nesta categoria."}
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
              Nenhum medicamento encontrado. Tente carregar mais.
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
