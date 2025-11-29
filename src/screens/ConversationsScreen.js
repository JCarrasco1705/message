import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, RefreshControl } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { spacing, typography } from "../config/theme"
import { storage } from "../utils/storage"
import { MOCK_CONVERSATIONS } from "../data/mockData"
import { useTheme } from "../context/ThemeContext"

export default function ConversationsScreen({ navigation }) {
  const [conversations, setConversations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const { colors } = useTheme()

  useEffect(() => {
    loadCurrentUser()
    loadConversations()
  }, [])

  const loadCurrentUser = async () => {
    const user = await storage.getItem("user")
    setCurrentUser(user)
  }

  const loadConversations = async () => {
    setConversations(MOCK_CONVERSATIONS)
    await storage.setItem("conversations", MOCK_CONVERSATIONS)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadConversations()
    setRefreshing(false)
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMs = now - date
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return "Ahora"
    if (diffInMins < 60) return `${diffInMins}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays === 1) return "Ayer"
    if (diffInDays < 7) return `${diffInDays}d`

    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate("Chat", { conversation: item })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.status === "online" && <View style={[styles.onlineIndicator, { backgroundColor: colors.online, borderColor: colors.background }]} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.user.name}</Text>
          <Text style={[styles.timestamp, { color: colors.textLight }]}>{formatTimestamp(item.lastMessage.timestamp)}</Text>
        </View>

        <View style={styles.messagePreview}>
          <Text style={[styles.lastMessage, { color: colors.textSecondary }, item.lastMessage.unread && { color: colors.text }]} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>{item.unreadCount > 99 ? "99+" : item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mensajes</Text>
        {currentUser && (
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Hola, {currentUser.name}! 👋</Text>
        )}
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar conversaciones..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>No hay conversaciones</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 28,
  },
  headerSubtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.subheading,
    fontSize: 16,
  },
  timestamp: {
    ...typography.small,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    ...typography.caption,
    flex: 1,
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  unreadCount: {
    ...typography.small,
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
  },
})