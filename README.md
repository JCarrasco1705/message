# Messaging App - React Native

Sistema de mensajería completo construido con React Native, compatible con Android, iOS y Web.

## Características

- Login y registro de usuarios
- Lista de conversaciones en tiempo real
- Chat individual con burbujas de mensajes
- Indicadores de estado (enviado, entregado, leído)
- Perfil de usuario con configuración
- Información detallada de contactos
- Búsqueda de conversaciones
- Notificaciones y privacidad
- Diseño responsive y moderno

## Requisitos

- Node.js 16+
- npm o yarn
- Expo CLI
- Para iOS: macOS con Xcode
- Para Android: Android Studio

## Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <url-del-repo>
cd messaging-app
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
# o
yarn install
\`\`\`

3. Configura las URLs de tu backend en:
   - \`src/services/api.js\` (línea 4: API_BASE_URL)
   - \`src/services/websocket.js\` (línea 13: WS_URL)
   - \`src/config/constants.js\` (líneas 2-3)

## Ejecución

### Desarrollo con Expo

\`\`\`bash
# Iniciar el servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web
\`\`\`

### Escanear código QR

1. Instala Expo Go en tu dispositivo móvil
2. Ejecuta \`npm start\`
3. Escanea el código QR con la cámara (iOS) o con Expo Go (Android)

## Estructura del Proyecto

\`\`\`
messaging-app/
├── App.js                 # Navegación principal y rutas
├── app.json              # Configuración de Expo
├── src/
│   ├── screens/          # Pantallas de la app
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ConversationsScreen.js
│   │   ├── ChatScreen.js
│   │   ├── ProfileScreen.js
│   │   └── UserInfoScreen.js
│   ├── services/         # Servicios de API y WebSocket
│   │   ├── api.js
│   │   └── websocket.js
│   ├── hooks/            # Custom hooks
│   │   └── useWebSocket.js
│   ├── context/          # React Context
│   │   └── AuthContext.js
│   ├── config/           # Configuración
│   │   ├── theme.js
│   │   └── constants.js
│   └── utils/            # Utilidades
│       └── storage.js
└── package.json
\`\`\`

## API Backend

Esta app requiere un backend con los siguientes endpoints:

### Autenticación
- POST \`/auth/login\` - Iniciar sesión
- POST \`/auth/register\` - Registrar usuario
- POST \`/auth/logout\` - Cerrar sesión

### Usuarios
- GET \`/user/profile\` - Obtener perfil
- PUT \`/user/profile\` - Actualizar perfil
- GET \`/user/:id\` - Información de usuario
- GET \`/users/search?q=\` - Buscar usuarios

### Conversaciones
- GET \`/conversations\` - Listar conversaciones
- POST \`/conversations\` - Crear conversación
- GET \`/conversations/:id\` - Obtener conversación

### Mensajes
- GET \`/conversations/:id/messages\` - Obtener mensajes
- POST \`/conversations/:id/messages\` - Enviar mensaje
- PUT \`/conversations/:id/messages/:mid/read\` - Marcar como leído
- DELETE \`/conversations/:id/messages/:mid\` - Eliminar mensaje

### WebSocket

El WebSocket debe soportar los siguientes eventos:

**Cliente → Servidor:**
- \`message\` - Enviar mensaje
- \`typing\` - Indicador de escritura
- \`presence\` - Actualizar estado

**Servidor → Cliente:**
- \`message\` - Nuevo mensaje recibido
- \`typing\` - Usuario escribiendo
- \`presence\` - Cambio de estado de usuario
- \`read\` - Mensaje leído

## Personalización

### Colores y Tema

Edita \`src/config/theme.js\` para cambiar los colores:

\`\`\`javascript
export const colors = {
  primary: '#6366f1',        // Color principal
  secondary: '#8b5cf6',       // Color secundario
  background: '#ffffff',      // Fondo
  text: '#111827',           // Texto principal
  // ...más colores
};
\`\`\`

### Configuración

Edita \`src/config/constants.js\` para cambiar la configuración general de la app.

## Build para Producción

### Android (APK)

\`\`\`bash
expo build:android
\`\`\`

### iOS (IPA)

\`\`\`bash
expo build:ios
\`\`\`

### Web

\`\`\`bash
expo build:web
npm run build
\`\`\`

## Testing

El proyecto usa datos mock por defecto. Para conectar con un backend real:

1. Implementa los endpoints listados arriba
2. Actualiza las URLs en los archivos de configuración
3. Reemplaza los datos mock en las pantallas con llamadas a \`api.js\`

## Próximas Características

- [ ] Mensajes de voz
- [ ] Compartir ubicación
- [ ] Stickers y GIFs
- [ ] Grupos de chat
- [ ] Videollamadas
- [ ] Historias/Estados
- [ ] Cifrado end-to-end

## Soporte

Para preguntas o problemas, contacta a: support@messagingapp.com

## Licencia

MIT
\`\`\`
