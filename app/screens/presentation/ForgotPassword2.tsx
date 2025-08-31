import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { Text } from "@/components";

// Definindo o número de campos de OTP
const OTP_LENGTH = 6;

export default function VerificationCodeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(11); // Começa com 11s como na imagem
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Efeito para o contador regressivo
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendCode = () => {
    // Adicione a lógica para reenviar o código aqui
    console.log("Reenviando código...");
    setCountdown(30); // Reinicia o contador
  };

  const handleTextChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move o foco para o próximo campo se um dígito for inserido
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move o foco para o campo anterior ao pressionar backspace em um campo vazio
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-gray-50 p-6">
      <View className="items-center">
        {/* Seção do Cabeçalho */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-gray-800">Código</Text>
          <Text className="text-5xl font-bold text-gray-800">Enviado.</Text>
          <Text className="text-center text-gray-500 mt-4 text-base">
            Insira no campo abaixo o código de verificação enviado para seu
            e-mail ou SMS.
          </Text>
        </View>

        {/* Card do Formulário */}
        <View className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Campos de Inserção do Código (OTP) */}
          <View className="flex-row justify-between mb-6">
            {Array(OTP_LENGTH)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="w-12 h-14 bg-white border border-gray-300 rounded-lg text-center text-2xl font-bold"
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleTextChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  value={otp[index]}
                />
              ))}
          </View>

          {/* Botão de Reenviar Código com Timer */}
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={countdown > 0}
            className={`flex-row justify-between items-center bg-white border border-gray-400 w-full py-3 px-4 rounded-lg mb-4 ${countdown > 0 ? "opacity-60" : ""}`}
          >
            <Text className="text-gray-800 font-bold text-base">
              Reenviar Código
            </Text>
            {countdown > 0 && (
              <Text className="text-gray-500 font-semibold text-base">
                {countdown}s
              </Text>
            )}
          </TouchableOpacity>

          {/* Botão de Enviar */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword3")}
            className="bg-gray-900 w-full py-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
