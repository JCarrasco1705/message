import React, { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { spacing, typography } from "../config/theme"
import { useTheme } from "../context/ThemeContext"

export default function UserInfoScreen({ route, navigation }) {
  const { user } = route.params
  const [isMuted, setIsMuted] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const { colors } = useTheme()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Información",
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    })
  }, [navigation, colors])

  const InfoSection = ({ icon, label, value }) => (
    <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
      <View style={[styles.infoIconContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textLight }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  )

  const ActionButton = ({ icon, label, onPress, danger = false }) => (
    <TouchableOpacity 
      style={[
        styles.actionButton, 
        { borderBottomColor: colors.border },
        danger && { backgroundColor: 'rgba(239, 68, 68, 0.05)' }
      ]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={danger ? colors.error : colors.text} />
      <Text style={[styles.actionButtonText, { color: danger ? colors.error : colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={danger ? colors.error : colors.textLight} />
    </TouchableOpacity>
  )

  const handleMute = () => {
    setIsMuted(!isMuted)
    Alert.alert(
      isMuted ? "Notificaciones activadas" : "Notificaciones silenciadas",
      isMuted ? "Recibirás notificaciones de este contacto" : "No recibirás notificaciones de este contacto",
    )
  }

  const handleBlock = () => {
    Alert.alert(
      isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario",
      isBlocked ? `¿Deseas desbloquear a ${user.name}?` : `¿Estás seguro que quieres bloquear a ${user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: isBlocked ? "Desbloquear" : "Bloquear",
          style: isBlocked ? "default" : "destructive",
          onPress: () => setIsBlocked(!isBlocked),
        },
      ],
    )
  }

  const handleReport = () => {
    Alert.alert("Reportar Usuario", `¿Deseas reportar a ${user.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Reportar",
        style: "destructive",
        onPress: () => {
          Alert.alert("Usuario Reportado", "Gracias por tu reporte")
        },
      },
    ])
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: user.status === "online" ? colors.online : colors.textLight }]}
          />
          <Text style={[styles.status, { color: colors.textSecondary }]}>
            {user.status === "online" ? "En línea" : "Desconectado"}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="call" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="videocam" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información</Text>
        <View style={[styles.infoContainer, { backgroundColor: colors.background }]}>
          <InfoSection icon="mail-outline" label="Email" value={user.email || "No disponible"} />
          <InfoSection icon="call-outline" label="Teléfono" value="+34 612 345 678" />
          <InfoSection icon="location-outline" label="Ubicación" value="Madrid, España" />
          <InfoSection icon="information-circle-outline" label="Acerca de" value="Disponible para chatear" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Multimedia</Text>
        <View style={[styles.mediaContainer, { backgroundColor: colors.background }]}>
          <View style={styles.mediaStats}>
            <View style={styles.mediaStat}>
              <Text style={[styles.mediaStatNumber, { color: colors.text }]}>48</Text>
              <Text style={[styles.mediaStatLabel, { color: colors.textSecondary }]}>Fotos</Text>
            </View>
            <View style={styles.mediaStat}>
              <Text style={[styles.mediaStatNumber, { color: colors.text }]}>12</Text>
              <Text style={[styles.mediaStatLabel, { color: colors.textSecondary }]}>Videos</Text>
            </View>
            <View style={styles.mediaStat}>
              <Text style={[styles.mediaStatNumber, { color: colors.text }]}>5</Text>
              <Text style={[styles.mediaStatLabel, { color: colors.textSecondary }]}>Archivos</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[styles.viewAllButtonText, { color: colors.primary }]}>Ver Todo</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Configuración</Text>
        <View style={[styles.settingsContainer, { backgroundColor: colors.background }]}>
          <ActionButton
            icon={isMuted ? "notifications-off-outline" : "notifications-outline"}
            label={isMuted ? "Activar Notificaciones" : "Silenciar Notificaciones"}
            onPress={handleMute}
          />
          <ActionButton
            icon="ban-outline"
            label={isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario"}
            onPress={handleBlock}
            danger={!isBlocked}
          />
          <ActionButton icon="flag-outline" label="Reportar Usuario" onPress={handleReport} danger />
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: spacing.md,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  status: {
    ...typography.caption,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    ...typography.caption,
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
  infoContainer: {
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.small,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body,
  },
  mediaContainer: {
    padding: spacing.lg,
  },
  mediaStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  mediaStat: {
    alignItems: "center",
  },
  mediaStatNumber: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  mediaStatLabel: {
    ...typography.caption,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  viewAllButtonText: {
    ...typography.body,
    fontWeight: "600",
    marginRight: spacing.xs,
  },
  settingsContainer: {
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  actionButtonText: {
    ...typography.body,
    flex: 1,
    marginLeft: spacing.md,
  },
  footer: {
    height: spacing.xl,
  },
})