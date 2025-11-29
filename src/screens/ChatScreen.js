import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ScrollView,
} from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { spacing, typography } from "../config/theme"
import { storage } from "../utils/storage"
import { MOCK_MESSAGES } from "../data/mockData"
import { useTheme } from "../context/ThemeContext"

// Plantillas de mensajes
const MESSAGE_TEMPLATES = [
  {
    id: 1,
    category: "Saludos",
    icon: "hand-left-outline",
    messages: [
      "¡Hola! ¿Cómo estás?",
      "Buenos días 🌅",
      "Buenas tardes ☀️",
      "Buenas noches 🌙",
      "¿Qué tal tu día?",
    ]
  },
  {
    id: 2,
    category: "Reuniones",
    icon: "calendar-outline",
    messages: [
      "¿Podemos agendar una reunión?",
      "Confirmando nuestra reunión de hoy",
      "¿A qué hora te viene bien?",
      "¿Nos reunimos mañana?",
      "Necesito reagendar nuestra reunión",
    ]
  },
  {
    id: 3,
    category: "Respuestas Rápidas",
    icon: "flash-outline",
    messages: [
      "Perfecto, gracias ✅",
      "Entendido 👍",
      "De acuerdo",
      "Claro, sin problema",
      "Lo reviso y te confirmo",
      "En un momento te respondo",
    ]
  },
  {
    id: 4,
    category: "Trabajo",
    icon: "briefcase-outline",
    messages: [
      "¿Cómo va el proyecto?",
      "Necesito el reporte actualizado",
      "¿Tienes los documentos?",
      "Revisé tu propuesta",
      "¿Podemos coordinar esto?",
    ]
  },
  {
    id: 5,
    category: "Despedidas",
    icon: "exit-outline",
    messages: [
      "Hasta luego 👋",
      "Nos vemos pronto",
      "Que tengas un buen día",
      "Hasta mañana",
      "Cuídate mucho",
    ]
  },
]

export default function ChatScreen({ route, navigation }) {
  const { conversation } = route.params
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const [inputHeight, setInputHeight] = useState(40)
  const [showTemplates, setShowTemplates] = useState(false)
  const flatListRef = useRef(null)
  const { colors } = useTheme()

  useEffect(() => {
    loadCurrentUser()
    loadMessages()

    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
      headerTitle: () => (
        <TouchableOpacity
          style={styles.headerUser}
          onPress={() => navigation.navigate("UserInfo", { user: conversation.user })}
        >
          <Image source={{ uri: conversation.user.avatar }} style={styles.headerAvatar} />
          <View>
            <Text style={[styles.headerName, { color: colors.text }]}>{conversation.user.name}</Text>
            <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>
              {conversation.user.status === "online" ? "En línea" : "Desconectado"}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    })
  }, [colors])

  useEffect(() => {
    if (inputText.trim() === "") {
      setInputHeight(40)
    }
  }, [inputText])

  const loadCurrentUser = async () => {
    const user = await storage.getItem("user")
    setCurrentUser(user)
  }

  const loadMessages = async () => {
    const conversationMessages = MOCK_MESSAGES[conversation.id] || []
    setMessages(conversationMessages)
  }

  const sendMessage = async (messageText = inputText) => {
    const textToSend = messageText || inputText
    if (!textToSend.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      senderId: currentUser.id,
      timestamp: new Date().getTime(),
      status: "sent",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")
    setInputHeight(40)
    setShowTemplates(false)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const selectTemplate = (message) => {
    sendMessage(message)
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleContentSizeChange = (event) => {
    if (inputText.trim() === "") {
      setInputHeight(40)
      return
    }
    
    const height = event.nativeEvent.contentSize.height
    const newHeight = Math.min(Math.max(height, 40), 100)
    setInputHeight(newHeight)
  }

  const renderMessage = ({ item, index }) => {
    const isOwnMessage = item.senderId === currentUser?.id
    const prevMessage = index > 0 ? messages[index - 1] : null
    const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId

    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer]}>
        {!isOwnMessage && showAvatar && (
          <Image source={{ uri: conversation.user.avatar }} style={styles.messageAvatar} />
        )}
        {!isOwnMessage && !showAvatar && <View style={styles.messageAvatarSpacer} />}

        <View style={[
          styles.messageBubble, 
          isOwnMessage ? { backgroundColor: colors.messageSent } : { backgroundColor: colors.messageReceived }
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : { color: colors.text }
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isOwnMessage ? styles.ownMessageTime : { color: colors.textLight }
            ]}>
              {formatMessageTime(item.timestamp)}
            </Text>
            {isOwnMessage && (
              <Ionicons
                name={
                  item.status === "read"
                    ? "checkmark-done"
                    : item.status === "delivered"
                      ? "checkmark-done"
                      : "checkmark"
                }
                size={16}
                color={item.status === "read" ? colors.primary : "#ffffff"}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => setShowTemplates(true)}
        >
          <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>

        <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundSecondary, height: inputHeight + 16 }]}>
          <TextInput
            style={[styles.input, { color: colors.text, height: inputHeight }]}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            scrollEnabled={false}
            onContentSizeChange={handleContentSizeChange}
            maxLength={1000}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? colors.primary : colors.backgroundSecondary }
          ]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? "#ffffff" : colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Modal de Plantillas */}
      <Modal
        visible={showTemplates}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTemplates(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={() => setShowTemplates(false)}
          />
          <View style={[styles.templatesContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.templatesHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.templatesTitle, { color: colors.text }]}>Plantillas de Mensajes</Text>
              <TouchableOpacity onPress={() => setShowTemplates(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {MESSAGE_TEMPLATES.map((category) => (
                <View key={category.id} style={styles.categoryContainer}>
                  <View style={styles.categoryHeader}>
                    <Ionicons name={category.icon} size={20} color={colors.primary} />
                    <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.category}</Text>
                  </View>
                  
                  {category.messages.map((message, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.templateItem, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                      onPress={() => selectTemplate(message)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.templateText, { color: colors.text }]}>{message}</Text>
                      <Ionicons name="arrow-forward" size={18} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
  },
  headerName: {
    ...typography.subheading,
    fontSize: 16,
  },
  headerStatus: {
    ...typography.small,
  },
  backButton: {
    paddingHorizontal: spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    paddingHorizontal: spacing.sm,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  ownMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.xs,
  },
  messageAvatarSpacer: {
    width: 32,
    marginRight: spacing.xs,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: spacing.sm + 2,
    borderRadius: 16,
  },
  messageText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#ffffff",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs - 2,
  },
  messageTime: {
    ...typography.small,
    fontSize: 11,
  },
  ownMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  statusIcon: {
    marginLeft: spacing.xs - 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    gap: spacing.sm - 2,
  },
  attachButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    padding: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  templatesContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xl,
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  templatesTitle: {
    ...typography.heading,
    fontSize: 20,
  },
  categoryContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    ...typography.subheading,
    fontSize: 16,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  templateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  templateText: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.sm,
  },
})