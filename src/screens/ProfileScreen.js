import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Modal } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { spacing, typography } from "../config/theme"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  console.log("📱 ProfileScreen render - isAuthenticated:", isAuthenticated)
  console.log("📱 ProfileScreen render - user:", user?.email)

  const handleLogoutPress = () => {
    console.log("🔴 BOTÓN PRESIONADO - Mostrando modal")
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = async () => {
    console.log("✅ Usuario confirmó el logout")
    setLoggingOut(true)
    
    try {
      console.log("🚪 Llamando a logout()...")
      await logout()
      console.log("✅ Logout completado exitosamente")
      setShowLogoutModal(false)
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error)
      alert("Error al cerrar sesión. Intenta nuevamente.")
    } finally {
      setLoggingOut(false)
    }
  }

  const handleCancelLogout = () => {
    console.log("❌ Usuario canceló el logout")
    setShowLogoutModal(false)
  }

  const ProfileOption = ({ icon, label, value, onPress, showArrow = true, toggle = null }) => (
    <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]} onPress={onPress} disabled={toggle !== null}>
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && <Text style={[styles.optionValue, { color: colors.textSecondary }]}>{value}</Text>}
        {toggle !== null ? (
          <Switch
            value={toggle.value}
            onValueChange={toggle.onChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={toggle.value ? "#ffffff" : "#f4f3f4"}
          />
        ) : showArrow ? (
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        ) : null}
      </View>
    </TouchableOpacity>
  )

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Perfil</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.background }]}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          <Text style={[styles.profileName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user.email}</Text>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Cuenta</Text>
          <View style={[styles.optionsContainer, { backgroundColor: colors.background }]}>
            <ProfileOption icon="person-outline" label="Información Personal" onPress={() => {}} />
            <ProfileOption icon="lock-closed-outline" label="Privacidad y Seguridad" onPress={() => {}} />
            <ProfileOption icon="shield-checkmark-outline" label="Verificación" value="Verificado" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferencias</Text>
          <View style={[styles.optionsContainer, { backgroundColor: colors.background }]}>
            <ProfileOption
              icon="notifications-outline"
              label="Notificaciones"
              toggle={{
                value: notifications,
                onChange: setNotifications,
              }}
            />
            <ProfileOption
              icon="moon-outline"
              label="Modo Oscuro"
              toggle={{
                value: isDarkMode,
                onChange: toggleTheme,
              }}
            />
            <ProfileOption icon="language-outline" label="Idioma" value="Español" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Soporte</Text>
          <View style={[styles.optionsContainer, { backgroundColor: colors.background }]}>
            <ProfileOption icon="help-circle-outline" label="Centro de Ayuda" onPress={() => {}} />
            <ProfileOption icon="document-text-outline" label="Términos y Condiciones" onPress={() => {}} />
            <ProfileOption icon="information-circle-outline" label="Acerca de" value="v1.0.0" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.background, borderColor: colors.primary }]} 
            onPress={handleLogoutPress}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.primary} />
            <Text style={[styles.logoutText, { color: colors.primary }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      {/* Modal de confirmación de logout */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out-outline" size={48} color={colors.primary} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Cerrar Sesión</Text>
              <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
                ¿Estás seguro que quieres cerrar sesión?
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]} 
                onPress={handleCancelLogout}
                disabled={loggingOut}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]} 
                onPress={handleConfirmLogout}
                disabled={loggingOut}
              >
                <Text style={styles.confirmButtonText}>
                  {loggingOut ? "Cerrando..." : "Cerrar Sesión"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 28,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  profileName: {
    ...typography.heading,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  editButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: "#c5a05c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    ...typography.body,
    color: "#ffffff",
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: "600",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionsContainer: {
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  optionLabel: {
    ...typography.body,
    flex: 1,
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionValue: {
    ...typography.caption,
    marginRight: spacing.sm,
  },
  logoutContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md + 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  logoutText: {
    ...typography.body,
    fontWeight: "600",
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  footer: {
    height: spacing.xl,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 24,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 0,
  },
  cancelButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
  confirmButton: {
    shadowColor: "#c5a05c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    ...typography.body,
    color: '#ffffff',
    fontWeight: '600',
  },
})