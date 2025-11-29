import { useEffect, useCallback } from "react"
import websocketService from "../services/websocket"

export function useWebSocket(token, userId) {
  useEffect(() => {
    if (token && userId) {
      websocketService.connect(token, userId)

      return () => {
        websocketService.disconnect()
      }
    }
  }, [token, userId])

  const sendMessage = useCallback((conversationId, text) => {
    websocketService.sendMessage(conversationId, text)
  }, [])

  const markTyping = useCallback((conversationId, isTyping) => {
    websocketService.markTyping(conversationId, isTyping)
  }, [])

  const updatePresence = useCallback((status) => {
    websocketService.updatePresence(status)
  }, [])

  const on = useCallback((event, callback) => {
    websocketService.on(event, callback)
  }, [])

  const off = useCallback((event, callback) => {
    websocketService.off(event, callback)
  }, [])

  return {
    sendMessage,
    markTyping,
    updatePresence,
    on,
    off,
  }
}