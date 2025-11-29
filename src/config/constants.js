// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://tu-api-backend.com/api",
  WS_URL: "wss://tu-api-backend.com/ws",
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
}

// App Configuration
export const APP_CONFIG = {
  NAME: "Messaging App",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@messagingapp.com",
}

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_LENGTH: 1000,
  MAX_ATTACHMENTS: 5,
  PAGINATION_LIMIT: 50,
}

// Media Configuration
export const MEDIA_CONFIG = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/quicktime"],
}

// Status Types
export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  AWAY: "away",
}

export const MESSAGE_STATUS = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
}
