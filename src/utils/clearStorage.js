import AsyncStorage from "@react-native-async-storage/async-storage"

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear()
    console.log("✅ Storage completamente limpiado")
  } catch (error) {
    console.error("❌ Error limpiando storage:", error)
  }
}