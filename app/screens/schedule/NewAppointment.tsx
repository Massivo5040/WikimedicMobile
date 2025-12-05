import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Circle,
  CheckCircle2,
  Minus,
  Plus,
  Search, // Ícone para a busca
} from "lucide-react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

import { Text } from "@/components";
import { useAuth } from "@/contexts/UserContext";

const AVAILABLE_COLORS = [
  "#FF4D4D",
  "#FFB347",
  "#FFFF66",
  "#66FF66",
  "#4DFFFF",
  "#4D4DFF",
  "#E04DFF",
  "#FFCC00",
];

// Interface para o Medicamento vindo da API
interface Medicine {
  id: string;
  commercial_name: string;
  description: string;
  // outros campos...
}

export default function NewAppointmentScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  // --- ESTADOS ---
  const [isLoading, setIsLoading] = useState(false);

  // Estados da Busca de Medicamento
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]); // Todos os remédios carregados
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]); // Resultado do filtro
  const [showSuggestions, setShowSuggestions] = useState(false); // Mostra/Esconde lista

  // Dados do Formulário
  const [medicineName, setMedicineName] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState(""); // ID selecionado
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("1");
  const [dosageUnit, setDosageUnit] = useState("cp");

  // Calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Datas e Horas
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Pickers
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [activeField, setActiveField] = useState<
    "start" | "end" | "startTime" | "endTime" | null
  >(null);

  // Repetição e Cor
  const [intervalHours, setIntervalHours] = useState(8);
  const [isTreatment, setIsTreatment] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[5]);

  // --- 1. CARREGAR MEDICAMENTOS (Effect) ---
  useEffect(() => {
    async function fetchMedicines() {
      try {
        // Buscamos uma quantidade maior (ex: 100) para poder filtrar localmente
        const response = await api.get("medicines?page=1&pageSize=100");
        if (response.data && response.data.medicines) {
          setAllMedicines(response.data.medicines);
        }
      } catch (error) {
        console.log("Erro ao buscar medicamentos:", error);
      }
    }
    fetchMedicines();
  }, []);

  // --- 2. LÓGICA DE FILTRO (Search) ---
  const handleSearchMedicine = (text: string) => {
    setMedicineName(text);

    // Se o usuário digitou algo, limpamos o ID antigo (pois ele está alterando o nome)
    // Se ele selecionar da lista depois, o ID será preenchido novamente
    setSelectedMedicineId("");

    if (text.length > 0) {
      const filtered = allMedicines.filter((med) =>
        med.commercial_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMedicines(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectMedicine = (med: Medicine) => {
    setMedicineName(med.commercial_name);
    setSelectedMedicineId(med.id);
    setShowSuggestions(false); // Esconde a lista
    Keyboard.dismiss(); // Fecha o teclado
  };

  // --- LÓGICA DO CALENDÁRIO ---
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  // --- LÓGICA DO PICKER ---
  const showPicker = (
    field: "start" | "end" | "startTime" | "endTime",
    mode: "date" | "time"
  ) => {
    setActiveField(field);
    setPickerMode(mode);
  };

  const onPickerChange = (event: any, selectedValue?: Date) => {
    if (Platform.OS === "android") setPickerMode(null);
    if (selectedValue) {
      if (activeField === "start") setStartDate(selectedValue);
      if (activeField === "end") setEndDate(selectedValue);
      if (activeField === "startTime") setStartTime(selectedValue);
      if (activeField === "endTime") setEndTime(selectedValue);
    }
  };

  // --- FUNÇÃO DE SALVAR (POST) ---
  async function handleSave() {
    if (!medicineName.trim()) {
      return Alert.alert("Atenção", "Informe o nome do medicamento.");
    }
    if (!amount || !dosageUnit) {
      return Alert.alert("Atenção", "Informe a quantidade e a unidade.");
    }

    setIsLoading(true);

    try {
      const finalStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      );

      const finalEnd = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      );

      const payload = {
        appointment: {
          all_days: isTreatment,
          start_time: finalStart,
          end_time: finalEnd,
          repetition: intervalHours,
          repeat_unit: "HOURS",
          amount: parseFloat(amount),
          dosage_unit: dosageUnit,
          color: selectedColor,
          user_id: user?.id || "",
          medicine_id: selectedMedicineId, // Envia o ID se selecionado, ou string vazia
          //medicine_name: medicineName, // Envia o nome (seja digitado ou selecionado)
        },
      };

      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await api.post("appointments/", payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso", "Agendamento criado!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      console.log(error);
      const errorMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Erro de conexão";
      Alert.alert("Erro ao criar agendamento", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (date: Date) => date.toLocaleDateString("pt-BR");
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* TouchableWithoutFeedback fecha a lista de sugestões se clicar fora */}
      <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            className="flex-1 px-5 pt-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#0f0f2d] p-2 rounded-full"
              >
                <ArrowLeft color="white" size={20} />
              </TouchableOpacity>
              <View className="flex-1 items-center">
                <Text className="text-blue-600 font-bold text-lg">Novo</Text>
                <Text className="text-[#0f0f2d] font-bold text-xl -mt-1">
                  Agendamento
                </Text>
              </View>
              <View className="w-10" />
            </View>

            {/* --- INPUT DE MEDICAMENTO COM AUTOCOMPLETE --- */}
            <View className="mb-4 z-50">
              <Text className="text-[#0f0f2d] font-bold text-xs mb-2">
                Medicamento
              </Text>
              <View className="relative">
                <View className="flex-row items-center border border-gray-200 rounded-lg bg-white">
                  <TextInput
                    value={medicineName}
                    onChangeText={handleSearchMedicine}
                    placeholder="Busque o nome do medicamento"
                    className="flex-1 p-3 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => {
                      // Se já tiver texto ao focar, mostra sugestões novamente
                      if (medicineName.length > 0) setShowSuggestions(true);
                    }}
                  />
                  <View className="pr-3">
                    <Search size={20} color="#9ca3af" />
                  </View>
                </View>

                {/* Lista de Sugestões (Dropdown Absolute) */}
                {showSuggestions && filteredMedicines.length > 0 && (
                  <View className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48">
                    <ScrollView
                      nestedScrollEnabled={true} // Permite rolar a lista interna sem travar a externa
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredMedicines.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectMedicine(item)}
                          className="p-3 border-b border-gray-100 active:bg-blue-50"
                        >
                          <Text className="text-gray-800 font-medium">
                            {item.commercial_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* NOVOS INPUTS: Quantidade e Unidade */}
            <View className="flex-row justify-between mb-6 -z-10">
              <View className="w-[48%]">
                <Text className="text-[#0f0f2d] font-bold text-xs mb-2">
                  Quantidade
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Ex: 1"
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-lg p-3 text-gray-700 bg-white"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-[#0f0f2d] font-bold text-xs mb-2">
                  Unidade
                </Text>
                <TextInput
                  value={dosageUnit}
                  onChangeText={setDosageUnit}
                  placeholder="Ex: cp"
                  className="border border-gray-200 rounded-lg p-3 text-gray-700 bg-white"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Calendário */}
            <View className="border-2 border-[#1c1c3c] rounded-lg p-4 mb-6 -z-10">
              <View className="flex-row justify-between items-center mb-4 px-4">
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <ChevronLeft size={24} color="#6b7280" />
                </TouchableOpacity>
                <Text className="text-[#1c1c3c] font-bold text-lg capitalize">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <ChevronRight size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day, index) => (
                    <Text
                      key={index}
                      className="text-gray-500 font-bold text-xs w-8 text-center"
                    >
                      {day}
                    </Text>
                  )
                )}
              </View>
              <View className="flex-row flex-wrap justify-start">
                {getDaysInMonth(currentDate).map((day, i) => {
                  if (day === null)
                    return (
                      <View
                        key={`empty-${i}`}
                        style={{ width: "14.28%" }}
                        className="h-8 mb-1"
                      />
                    );
                  const isSelected = day === selectedDay;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setSelectedDay(day)}
                      style={{ width: "14.28%" }}
                      className="h-8 items-center justify-center mb-1"
                    >
                      <View
                        className={`w-7 h-7 items-center justify-center rounded-full ${isSelected ? "bg-blue-600" : ""}`}
                      >
                        <Text
                          className={`text-xs ${isSelected ? "text-white font-bold" : "text-gray-500"}`}
                        >
                          {day < 10 ? `0${day}` : day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Datas e Horários */}
            <Text className="text-[#0f0f2d] font-bold text-sm mb-3 -z-10">
              Definir Horários
            </Text>
            <View className="flex-row justify-between mb-4 -z-10">
              <View className="w-[48%]">
                <Text className="text-xs text-gray-600 mb-1">Data inicial</Text>
                <TouchableOpacity
                  onPress={() => showPicker("start", "date")}
                  className="border border-[#1c1c3c] rounded-lg p-2 items-center bg-white"
                >
                  <Text className="font-bold text-[#0f0f2d]">
                    {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-[48%]">
                <Text className="text-xs text-gray-600 mb-1">Data final</Text>
                <TouchableOpacity
                  onPress={() => showPicker("end", "date")}
                  className="border border-[#1c1c3c] rounded-lg p-2 items-center bg-white"
                >
                  <Text className="font-bold text-[#0f0f2d]">
                    {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between mb-6 -z-10">
              <View className="w-[48%]">
                <Text className="text-xs text-gray-600 mb-1">
                  Horário inicial
                </Text>
                <TouchableOpacity
                  onPress={() => showPicker("startTime", "time")}
                  className="border border-[#1c1c3c] rounded-lg p-2 items-center bg-white"
                >
                  <Text className="font-bold text-[#0f0f2d]">
                    {formatTime(startTime)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-[48%]">
                <Text className="text-xs text-gray-600 mb-1">
                  Horário final
                </Text>
                <TouchableOpacity
                  onPress={() => showPicker("endTime", "time")}
                  className="border border-[#1c1c3c] rounded-lg p-2 items-center bg-white"
                >
                  <Text className="font-bold text-[#0f0f2d]">
                    {formatTime(endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {pickerMode && (
              <DateTimePicker
                value={
                  activeField === "start"
                    ? startDate
                    : activeField === "end"
                      ? endDate
                      : activeField === "startTime"
                        ? startTime
                        : endTime
                }
                mode={pickerMode}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                is24Hour={true}
                onChange={onPickerChange}
              />
            )}

            {/* Repetição */}
            <Text className="text-xs text-gray-600 mb-2 -z-10">
              Definir Intervalo
            </Text>
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 -z-10">
              <Text className="text-gray-700 font-bold">Repetir a cada:</Text>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() =>
                    setIntervalHours((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                  className="bg-blue-100 p-2 rounded-full"
                >
                  <Minus size={16} color="#2563EB" />
                </TouchableOpacity>
                <Text className="font-bold text-[#0f0f2d] text-lg w-16 text-center">
                  {intervalHours} h
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIntervalHours((prev) => (prev < 24 ? prev + 1 : 24))
                  }
                  className="bg-blue-100 p-2 rounded-full"
                >
                  <Plus size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsTreatment(!isTreatment)}
              className="flex-row items-center mb-6 -z-10"
            >
              <View className="mr-2">
                {isTreatment ? (
                  <CheckCircle2 size={24} color="#2563EB" />
                ) : (
                  <Circle size={24} color="#0f0f2d" />
                )}
              </View>
              <Text className="text-gray-700 text-sm font-bold">
                Marcar como Tratamento contínuo
              </Text>
            </TouchableOpacity>

            {/* Descrição */}
            <View className="mb-6 -z-10">
              <Text className="text-[#0f0f2d] font-bold text-center mb-2">
                Descrição
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                className="border border-[#1c1c3c] rounded-lg p-3 h-20 text-start bg-white"
                textAlignVertical="top"
              />
            </View>

            {/* Cores */}
            <Text className="text-[#0f0f2d] font-bold text-sm mb-2 text-center -z-10">
              Cor do Lembrete
            </Text>
            <View className="flex-row justify-center flex-wrap gap-2 mb-8 -z-10">
              {AVAILABLE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full ${selectedColor === color ? "border-2 border-[#0f0f2d] scale-110" : "border border-transparent"}`}
                />
              ))}
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className={`bg-blue-600 rounded-lg p-4 items-center mb-6 ${isLoading ? "opacity-70" : ""}`}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white font-bold text-lg">Salvar</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
