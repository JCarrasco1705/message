import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { spacing, typography } from "../config/theme"
import { MOCK_USERS } from "../data/mockData"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import LogoMaySvg from "../assets/logo1odemayo.svg"

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const { colors } = useTheme()

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      console.log("🔐 Intentando login con:", email)

      await new Promise((resolve) => setTimeout(resolve, 800))

      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (!user) {
        setError("Email o contraseña incorrectos")
        setLoading(false)
        return
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: "online",
      }

      const token = "mock-jwt-token-" + Date.now()

      await login(userData, token)

      console.log("✅ Login completado")

    } catch (err) {
      console.error("❌ Error en login:", err)
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        alwaysBounceVertical={true}
      >
        <View style={[styles.content, { minHeight: SCREEN_HEIGHT }]}>
          {/* Header decorativo */}
          <View style={styles.headerDecoration}>
            <View style={[styles.decorativeCircle1, { backgroundColor: colors.primary }]} />
            <View style={[styles.decorativeCircle2, { backgroundColor: colors.primary }]} />
          </View>

          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoCircle,
                {
                  backgroundColor: colors.backgroundSecondary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <LogoMaySvg width={70} height={70} />
            </View>
            <Text style={[styles.appName, { color: colors.primary }]}>
              Sindicatos App
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Input Email */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Contraseña"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            {/* Botón Login */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

            {/* Link Register */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                ¿No tienes cuenta? <Text style={[styles.linkTextBold, { color: colors.primary }]}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  headerDecoration: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
  },
  decorativeCircle1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  decorativeCircle2: {
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.15,
    position: 'absolute',
    top: 50,
    right: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md + 2,
    fontSize: 16,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    flex: 1,
  },
  button: {
    borderRadius: 16,
    padding: spacing.md + 4,
    alignItems: "center",
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.body,
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
    marginRight: spacing.sm,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.body,
  },
  linkTextBold: {
    fontWeight: "700",
  },
})