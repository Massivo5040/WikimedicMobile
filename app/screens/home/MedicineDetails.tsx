import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, ChevronDown, ChevronUp, Heart } from "lucide-react-native";
import axios from "axios";
import Markdown from "react-native-markdown-display";

import { Text } from "@/components";
import { useFavorites } from "@/contexts";

// --- ATIVAR ANIMAÇÕES NO ANDROID ---
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- TIPAGEM DA RESPOSTA DA API ---
interface LeafletData {
  indicacoes: string[];
  contraindicacoes: string[];
  reacoes_adversas: string[];
  cuidados: string[];
  posologia: string[];
  riscos: string[];
  superdose: string[];
}

interface MedicineDetail {
  id: string;
  commercial_name: string;
  description: string;
  registry_code: string;
  categories: string[];
  image: string | null;
  leaflet_data: LeafletData | null;
}

interface MedicineResponse {
  medicine: MedicineDetail;
}

// Tipagem dos parâmetros da rota
type RootStackParamList = {
  MedicineDetails: { medicineId: string };
};

// --- COMPONENTE DE ACORDEÃO PARA SEÇÕES DA BULA ---
const LeafletSection = ({
  title,
  content,
}: {
  title: string;
  content: string[] | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Se não tiver conteúdo, nem renderiza a seção
  if (!content || content.length === 0) return null;

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  // Converte o array de strings em uma única string Markdown com quebras de linha duplas
  const markdownContent = content.join("\n\n");

  return (
    <View className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      <TouchableOpacity
        onPress={toggleOpen}
        className="flex-row justify-between items-center p-4 bg-gray-100 active:bg-gray-200"
      >
        <Text className="font-bold text-gray-800 text-base">{title}</Text>
        {isOpen ? (
          <ChevronUp size={20} color="#4B5563" />
        ) : (
          <ChevronDown size={20} color="#4B5563" />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View className="p-4 bg-white">
          <Markdown
            style={{
              body: { color: "#374151", fontSize: 15, lineHeight: 24 },
              paragraph: { marginBottom: 10 },
            }}
          >
            {markdownContent}
          </Markdown>
        </View>
      )}
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function MedicineDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "MedicineDetails">>();
  const { medicineId } = route.params;

  const [medicine, setMedicine] = useState<MedicineDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(medicineId);

  // Configuração API
  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await api.get<MedicineResponse>(
          `medicines/${medicineId}`
        );
        // A API retorna { medicine: { ... } }
        setMedicine(response.data.medicine);
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os detalhes do medicamento."
        );
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [medicineId]);

  const handleToggleFavorite = async () => {
    if (!medicine) return;

    // Cria o objeto simplificado para salvar no contexto
    const medicineToSave = {
      id: medicine.id,
      commercial_name: medicine.commercial_name,
      description: medicine.description,
      image: medicine.image,
      categories: medicine.categories,
    };

    await toggleFavorite(medicineToSave);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!medicine) return null;

  const imageSource = medicine.image
    ? { uri: medicine.image }
    : require("assets/medicine.webp");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header com Imagem */}
        <View className="relative w-full h-72 bg-gray-100">
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/10" />

          {/* Botão Voltar */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-5 bg-white/90 p-2 rounded-full shadow-sm"
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="absolute top-12 right-5 bg-white/90 p-2 rounded-full shadow-sm z-10"
          >
            {/* Se for favorito: Preenchido de vermelho. Se não: Contorno cinza/preto */}
            <Heart
              size={24}
              color={isFav ? "#EF4444" : "#000"} // Cor da borda
              fill={isFav ? "#EF4444" : "transparent"} // Cor do preenchimento
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo Principal */}
        <View className="px-6 -mt-8 bg-white rounded-t-3xl pt-8 shadow-sm">
          {/* Categorias */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {medicine.categories.map((cat, index) => (
              <View key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-bold uppercase">
                  {cat}
                </Text>
              </View>
            ))}
          </View>

          {/* Título e Código */}
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {medicine.commercial_name}
          </Text>
          <Text className="text-gray-400 text-sm mb-6">
            Registro MS: {medicine.registry_code}
          </Text>

          {/* Descrição Geral */}
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Sobre o medicamento
          </Text>
          <Text className="text-gray-600 leading-6 text-base mb-8">
            {medicine.description}
          </Text>

          {/* Seção da Bula (Acordeões) */}
          {medicine.leaflet_data ? (
            <View>
              <Text className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Informações da Bula
              </Text>

              <LeafletSection
                title="📍 Indicações"
                content={medicine.leaflet_data.indicacoes}
              />
              <LeafletSection
                title="💊 Posologia (Como usar)"
                content={medicine.leaflet_data.posologia}
              />
              <LeafletSection
                title="🚫 Contraindicações"
                content={medicine.leaflet_data.contraindicacoes}
              />
              <LeafletSection
                title="⚠️ Riscos e Advertências"
                content={medicine.leaflet_data.riscos}
              />
              <LeafletSection
                title="🤒 Reações Adversas"
                content={medicine.leaflet_data.reacoes_adversas}
              />
              <LeafletSection
                title="🛡️ Cuidados de Conservação"
                content={medicine.leaflet_data.cuidados}
              />
              <LeafletSection
                title="🚑 Superdose"
                content={medicine.leaflet_data.superdose}
              />
            </View>
          ) : (
            <View className="bg-gray-50 p-6 rounded-xl items-center">
              <Text className="text-gray-500 italic text-center">
                Informações detalhadas da bula não disponíveis para este
                medicamento no momento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
