import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log("🎬 AuthProvider mounted")
    loadUser()
  }, [])

  // Log cada vez que cambia el estado de autenticación
  useEffect(() => {
    console.log("🔄 Auth state changed:", { isAuthenticated, user: user?.email })
  }, [isAuthenticated, user])

  const loadUser = async () => {
    try {
      console.log("🔍 Loading user from storage...")
      const userData = await AsyncStorage.getItem("user")
      const token = await AsyncStorage.getItem("userToken")
      
      console.log("📦 User data:", userData ? "exists" : "null")
      console.log("🔑 Token:", token ? "exists" : "null")
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        console.log("✅ User loaded:", parsedUser.email)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        console.log("❌ No user found")
      }
    } catch (error) {
      console.error("❌ Error loading user:", error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userData, token) => {
    try {
      console.log("💾 Saving login data...")
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      await AsyncStorage.setItem("userToken", token)
      
      console.log("🔄 Updating state...")
      setUser(userData)
      setIsAuthenticated(true)
      console.log("✅ Login successful, isAuthenticated:", true)
    } catch (error) {
      console.error("❌ Error during login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("🚪 Starting logout process...")
      console.log("📊 Before logout - isAuthenticated:", isAuthenticated)
      
      // Limpiar AsyncStorage
      await AsyncStorage.clear()
      console.log("🧹 AsyncStorage cleared")
      
      // Verificar que se limpió
      const checkUser = await AsyncStorage.getItem("user")
      const checkToken = await AsyncStorage.getItem("userToken")
      console.log("🔍 Verification after clear:", { 
        user: checkUser, 
        token: checkToken 
      })
      
      // Actualizar estado
      setUser(null)
      setIsAuthenticated(false)
      
      console.log("📊 After logout - isAuthenticated:", false)
      console.log("✅ Logout successful")
      
      return true
    } catch (error) {
      console.error("❌ Error during logout:", error)
      throw error
    }
  }

  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("❌ Error updating user:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  console.log("🎯 AuthContext value:", { 
    hasUser: !!user, 
    isAuthenticated, 
    loading 
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}