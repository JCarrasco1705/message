import AsyncStorage from "@react-native-async-storage/async-storage"

// Configuración de la API
const API_BASE_URL = "https://tu-api-backend.com/api" // Cambia esto por tu URL

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL
  }

  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem("userToken")
      return token
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getAuthToken()

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name, email, password) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // User endpoints
  async getProfile() {
    return this.request("/user/profile")
  }

  async updateProfile(userData) {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async getUserInfo(userId) {
    return this.request(`/user/${userId}`)
  }

  // Conversations endpoints
  async getConversations() {
    return this.request("/conversations")
  }

  async createConversation(userId) {
    return this.request("/conversations", {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  }

  async getConversation(conversationId) {
    return this.request(`/conversations/${conversationId}`)
  }

  // Messages endpoints
  async getMessages(conversationId, page = 1, limit = 50) {
    return this.request(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`)
  }

  async sendMessage(conversationId, text, attachments = []) {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text, attachments }),
    })
  }

  async markAsRead(conversationId, messageId) {
    return this.request(`/conversations/${conversationId}/messages/${messageId}/read`, {
      method: "PUT",
    })
  }

  async deleteMessage(conversationId, messageId) {
    return this.request(`/conversations/${conversationId}/messages/${messageId}`, {
      method: "DELETE",
    })
  }

  // Search endpoints
  async searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`)
  }

  async searchMessages(conversationId, query) {
    return this.request(`/conversations/${conversationId}/messages/search?q=${encodeURIComponent(query)}`)
  }
}

export default new ApiService()
