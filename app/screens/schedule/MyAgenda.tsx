import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import {
  NavigationProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import axios from "axios";

import { Text } from "@/components";
import { useAuth } from "@/contexts/UserContext";

// --- TIPAGEM ---
interface DayItem {
  id: string;
  dayNumber: string;
  dayName: string;
  fullDate: Date;
}

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  amount: number;
  dosage_unit: string;
  color: string;
  medicine_id: string;
  medicine_name?: string;
  repetition: number;
  repeat_unit: string;
}

// --- COMPONENTE SCHEDULE ITEM ---
const ScheduleItem = ({
  item,
  onPress,
}: {
  item: Appointment;
  onPress: () => void;
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const medName = item.medicine_name || "Carregando...";
  const badgeColor = item.color || "#BFDBFE";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-3 mb-3 active:bg-gray-50"
    >
      <View className="flex-1 mr-2">
        <Text className="text-gray-600 font-bold text-base">{medName}</Text>
        <Text className="text-gray-400 text-xs mt-1">
          {item.amount} {item.dosage_unit} • A cada {item.repetition} horas
        </Text>
      </View>

      <View
        className="px-3 py-1 rounded-md items-center"
        style={{ backgroundColor: badgeColor }}
      >
        <Text className="text-gray-900 font-bold text-xs opacity-70">
          Início: {formatTime(item.start_time)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- COMPONENTE DAY SELECTOR ---
const DaySelectorItem = ({ item, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-16 h-20 justify-center items-center rounded-lg mr-2 ${isSelected ? "bg-gray-200" : "bg-white/20"}`}
  >
    <Text
      className={`text-xl font-bold ${isSelected ? "text-blue-800" : "text-white"}`}
    >
      {item.dayNumber}
    </Text>
    <Text
      className={`text-sm capitalize ${isSelected ? "text-blue-800" : "text-gray-200"}`}
    >
      {item.dayName}
    </Text>
  </TouchableOpacity>
);

// --- COMPONENTE MODAL DE DETALHES ---
const AppointmentModal = ({
  visible,
  onClose,
  appointment,
  selectedDate,
  onTake,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  selectedDate: Date;
  onTake: () => void;
  onDelete: () => void;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [todaysTimes, setTodaysTimes] = useState<string[]>([]);

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (appointment && selectedDate) {
      const times: string[] = [];
      const start = new Date(appointment.start_time);
      const end = new Date(appointment.end_time);

      let current = new Date(start);

      while (current <= end) {
        if (
          current.getDate() === selectedDate.getDate() &&
          current.getMonth() === selectedDate.getMonth() &&
          current.getFullYear() === selectedDate.getFullYear()
        ) {
          times.push(
            current.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
        current.setHours(current.getHours() + appointment.repetition);
        if (appointment.repetition <= 0) break;
      }
      setTodaysTimes(times);
    }
  }, [appointment, selectedDate]);

  if (!appointment) return null;

  const handleTakeMedicine = async () => {
    setIsLoadingAction(true);
    try {
      const payload = {
        record: {
          appointment_id: appointment.id,
          taken_at: new Date().toISOString(),
          notes: null,
        },
      };

      const response = await api.post("appointments/records", payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso", "Medicamento registrado com sucesso! 🎉");
        onTake();
        onClose();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao registrar medicamento.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteAppointment = () => {
    Alert.alert(
      "Excluir Agendamento",
      "Tem certeza que deseja parar este tratamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setIsLoadingAction(true);
            try {
              await api.delete(`appointments/${appointment.id}`);
              Alert.alert("Sucesso", "Agendamento excluído.");
              onDelete();
              onClose();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            } finally {
              setIsLoadingAction(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[75%]">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800 w-64">
                {appointment.medicine_name || "Medicamento"}
              </Text>
              <Text className="text-gray-500 text-sm">
                {appointment.amount} {appointment.dosage_unit}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => {
                onClose();
                navigation.navigate("MedicineDetails", {
                  medicineId: appointment.medicine_id,
                });
              }}
              className="flex-row items-center bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100"
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={28}
                color="#2563EB"
              />
              <View className="ml-3 flex-1">
                <Text className="text-blue-700 font-bold text-base">
                  Acessar Bula
                </Text>
                <Text className="text-blue-500 text-xs">
                  Ver contraindicações e posologia
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#2563EB" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-gray-800 mb-3">
              Horários de hoje (
              {selectedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}
              )
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-8">
              {todaysTimes.length > 0 ? (
                todaysTimes.map((time, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200"
                  >
                    <Text className="font-bold text-gray-700">{time}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 italic">
                  Nenhum horário calculado para este dia.
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleTakeMedicine}
              disabled={isLoadingAction}
              className="bg-blue-600 py-4 rounded-xl flex-row justify-center items-center mb-4 shadow-sm active:bg-blue-700"
            >
              {isLoadingAction ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={24}
                    color="white"
                  />
                  <Text className="text-white font-bold text-lg ml-2">
                    Marcar como tomado agora
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAppointment}
              disabled={isLoadingAction}
              className="bg-white border border-red-200 py-4 rounded-xl flex-row justify-center items-center mb-6 active:bg-red-50"
            >
              <Feather name="trash-2" size={20} color="#EF4444" />
              <Text className="text-red-500 font-bold text-base ml-2">
                Excluir Agendamento
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// --- TELA PRINCIPAL ---
export default function AgendaScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();

  // Estados de UI
  const [days, setDays] = useState<DayItem[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [currentMonthName, setCurrentMonthName] = useState("");

  // Estados de Dados e Modal
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const api = axios.create({
    baseURL: "https://wikimedic-api.onrender.com/",
    timeout: 10000,
  });

  // Gera dias
  useEffect(() => {
    const today = new Date();
    const generatedDays: DayItem[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayName = date
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "")
        .slice(0, 3);
      generatedDays.push({
        id: i.toString(),
        dayNumber: date.getDate().toString(),
        dayName: dayName,
        fullDate: date,
      });
    }
    setDays(generatedDays);
    setSelectedDayId("0");
  }, []);

  // --- FUNÇÃO DE BUSCA CORRIGIDA (IGUAL AO SCHEDULE SCREEN) ---
  const fetchAppointments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      console.log("Buscando agendamentos para:", user.id);

      // Aumentei pageSize para 100 para garantir que pegue "todos"
      const response = await api.get(
        `users/${user.id}/appointments?page=1&pageSize=100`
      );

      // Lógica de verificação do array igual à tela que funciona
      const rawAppointments = Array.isArray(response.data)
        ? response.data
        : response.data.appointments || [];

      console.log("Agendamentos brutos encontrados:", rawAppointments.length);

      // Busca o nome de cada remédio
      const enrichedAppointments = await Promise.all(
        rawAppointments.map(async (appt: Appointment) => {
          if (!appt.medicine_id)
            return { ...appt, medicine_name: "Desconhecido" };
          try {
            const medResponse = await api.get(`medicines/${appt.medicine_id}`);
            const medicineName = medResponse.data.medicine.commercial_name;
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

      console.log("Agendamentos processados:", enrichedAppointments.length);
      setAllAppointments(enrichedAppointments);
    } catch (error) {
      console.log("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dispara a busca quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [user])
  );

  // Filtra por dia selecionado
  useEffect(() => {
    if (days.length === 0) return;

    const selectedDayObj = days.find((d) => d.id === selectedDayId);
    if (!selectedDayObj) return;

    // Atualiza nome do mês
    const month = selectedDayObj.fullDate.toLocaleDateString("pt-BR", {
      month: "long",
    });
    setCurrentMonthName(month.charAt(0).toUpperCase() + month.slice(1));

    if (allAppointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }

    const targetDate = selectedDayObj.fullDate.getTime();

    const filtered = allAppointments.filter((appt) => {
      const start = new Date(appt.start_time);
      const end = new Date(appt.end_time);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Verifica se o dia selecionado está dentro do período do tratamento
      return targetDate >= start.getTime() && targetDate <= end.getTime();
    });

    console.log(
      `Filtrando para ${selectedDayObj.dayNumber}: Encontrados ${filtered.length}`
    );
    setFilteredAppointments(filtered);
  }, [selectedDayId, allAppointments, days]);

  // Ação ao clicar no card
  const handleOpenModal = (item: Appointment) => {
    setSelectedAppointment(item);
    setModalVisible(true);
  };

  const getCurrentSelectedDate = () => {
    const day = days.find((d) => d.id === selectedDayId);
    return day ? day.fullDate : new Date();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Cabeçalho */}
        <View className="bg-blue-700 pt-6 pb-4 px-5">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-white/30 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
              Minha Agenda
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map((day) => (
              <DaySelectorItem
                key={day.id}
                item={day}
                isSelected={selectedDayId === day.id}
                onPress={() => setSelectedDayId(day.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Lista */}
        <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-bold text-gray-700 mb-4 capitalize">
            {currentMonthName}
          </Text>

          {isLoading && filteredAppointments.length === 0 ? (
            <ActivityIndicator size="large" color="#1D4ED8" className="mt-10" />
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((item) => (
              <ScheduleItem
                key={item.id}
                item={item}
                onPress={() => handleOpenModal(item)}
              />
            ))
          ) : (
            <View className="items-center justify-center mt-10 opacity-50">
              <Ionicons name="calendar-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-2">
                Nenhum agendamento para este dia.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("NewAppointment")}
            className="bg-blue-700 w-full py-4 rounded-lg mt-8 mb-8"
          >
            <Text className="text-white text-center font-bold text-lg">
              Novo Agendamento
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL */}
      <AppointmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        appointment={selectedAppointment}
        selectedDate={getCurrentSelectedDate()}
        onTake={() => {
          fetchAppointments();
        }}
        onDelete={() => {
          fetchAppointments();
        }}
      />
    </SafeAreaView>
  );
}
