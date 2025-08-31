import React, { useState } from "react";
import { View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const daysData = [
  { id: "1", dayNumber: "10", dayName: "Dom" },
  { id: "2", dayNumber: "11", dayName: "Seg" },
  { id: "3", dayNumber: "12", dayName: "Ter" },
  { id: "4", dayNumber: "13", dayName: "Qua" },
  { id: "5", dayNumber: "14", dayName: "Qui" },
  { id: "6", dayNumber: "15", dayName: "Sex" },
  { id: "7", dayNumber: "16", dayName: "Sáb" },
];

const scheduleData = [
  { id: "1", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "2", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "3", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
  { id: "4", task: "Tomar 3 comprimidos de Dipirona", time: "18:00 p.m" },
];

// --- COMPONENTES ---

// Componente para um item da agenda
const ScheduleItem = ({ item }: { item: (typeof scheduleData)[0] }) => (
  <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-3 mb-3">
    <Text className="text-gray-500">{item.task}</Text>
    <View className="bg-purple-200 px-3 py-1 rounded-md">
      <Text className="text-purple-800 font-bold text-xs">{item.time}</Text>
      <Text className="text-purple-800 font-bold text-xs">{item.time}</Text>
    </View>
  </View>
);

// Componente para um dia no seletor
const DaySelectorItem = ({ item, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-16 h-20 justify-center items-center rounded-lg mr-2 ${isSelected ? "bg-gray-200" : "bg-white"}`}
  >
    <Text
      className={`text-xl font-bold ${isSelected ? "text-purple-800" : "text-gray-700"}`}
    >
      {item.dayNumber}
    </Text>
    <Text
      className={`text-sm ${isSelected ? "text-purple-800" : "text-gray-500"}`}
    >
      {item.dayName}
    </Text>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function AgendaScreen() {
  const [selectedDay, setSelectedDay] = useState("3"); // ID do dia '12 Ter' como inicial

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        {/* Cabeçalho Roxo */}
        <View className="bg-purple-700 pt-6 pb-4 px-5">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity className="bg-white/30 p-2 rounded-full">
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-white font-bold text-xl -ml-10">
              Minha Agenda
            </Text>
          </View>

          {/* Seletor de Data */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {daysData.map((day) => (
              <DaySelectorItem
                key={day.id}
                item={day}
                isSelected={selectedDay === day.id}
                onPress={() => setSelectedDay(day.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Conteúdo da Agenda */}
        <ScrollView className="p-4">
          <Text className="text-lg font-bold text-gray-700 mb-4">Setembro</Text>
          {scheduleData.map((item) => (
            <ScheduleItem key={item.id} item={item} />
          ))}

          <TouchableOpacity className="bg-purple-700 w-full py-4 rounded-lg mt-4">
            <Text className="text-white text-center font-bold text-lg">
              Agendar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
