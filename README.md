# Guía de Implementación: Sistema de Mensajes Privados

A continuación detallo el código y las instrucciones para que puedas implementar un sistema exclusivamente de **Mensajería Privada** (Direct Messages) entre usuarios, utilizando Socket.io y MongoDB.

## 1. Nuevos archivos del Backend

### A. Crea el modelo `server/models/ChatMessage.model.js`
Este modelo servirá estrictamente para guardar los mensajes entre dos usuarios.

```javascript
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Índice para asegurar búsquedas veloces entre emisor y receptor
chatMessageSchema.index({ sender: 1, receiver: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
```

### B. Crea el controlador `server/controllers/chat.controller.js`
Contiene la lógica para obtener los historiales de chats directos y la lista de conversaciones recientes (la gente con la que has hablado).

```javascript
import ChatMessage from '../models/ChatMessage.model.js';

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Obtener todos los mensajes donde participamos para sacar las conversaciones recientes
        const messages = await ChatMessage.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender receiver', 'discordUsername discordAvatar')
        .sort({ createdAt: -1 });

        // Extraer usuarios únicos con los que interactuamos
        const usersMap = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
            if (otherUser && !usersMap.has(otherUser._id.toString())) {
                usersMap.set(otherUser._id.toString(), {
                    _id: otherUser._id,
                    discordUsername: otherUser.discordUsername,
                    discordAvatar: otherUser.discordAvatar,
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt
                });
            }
        });

        res.json({ success: true, conversations: Array.from(usersMap.values()) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDirectHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { targetUserId } = req.params;

        const messages = await ChatMessage.find({
            $or: [
                { sender: userId, receiver: targetUserId },
                { sender: targetUserId, receiver: userId }
            ]
        })
        .populate('sender', 'discordUsername discordAvatar')
        .sort({ createdAt: -1 })
        .limit(100);

        res.json({ success: true, messages: messages.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

### C. Crea las rutas en `server/routes/chat.routes.js`

```javascript
import express from 'express';
import { getConversations, getDirectHistory } from '../controllers/chat.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/conversations', isAuthenticated, getConversations);
router.get('/direct/:targetUserId', isAuthenticated, getDirectHistory);

export default router;
```

---

## 2. Editar archivos existentes del Backend

### A. Edita `server/app.js`:
**1. Arriba en los imports donde traes el resto de rutas añade:**
```javascript
import chatRoutes from './routes/chat.routes.js';
```
**2. Más abajo, cerca del registro de otras rutas API:**
```javascript
app.use('/api/chat', chatRoutes);
```

### B. Edita `server/socket.js`:
Añade la escucha exclusiva para el envío privado. Recuerda importar tu modelo arriba.

```javascript
// Arriba del todo:
import ChatMessage from './models/ChatMessage.model.js';

// Dentro de tu io.on('connection', (socket) => { ...

        // ============================================
        // NUEVO SISTEMA MENSAJERÍA PRIVADA DM
        // ============================================
        
        // Evento para enviar mensaje privado directo a otro usuario
        socket.on('chat-sys:send', async ({ content, receiverId }) => {
            try {
                // socket.data.userId se define en el evento 'user:join' de tu backend actual
                const userId = socket.data.userId; 
                if (!userId || !receiverId || !content) return;

                const newMsg = await ChatMessage.create({
                    sender: userId,
                    receiver: receiverId,
                    content
                });

                const populatedMsg = await ChatMessage.findById(newMsg._id)
                     .populate('sender receiver', 'discordUsername discordAvatar');

                // Enviar silenciosamente al receptor y retornar al creador
                ioInstance.to(`user:${receiverId}`).emit('chat-sys:receive', populatedMsg);
                socket.emit('chat-sys:receive', populatedMsg);
            } catch (error) {
                console.error('Error enviando DM:', error);
            }
        });
        // ============================================
```

---

## 3. Frontend: Componentes Visuales y Zustand

### A. Crea el manejador de estados `src/store/useChatStore.ts`
*Ajusta la variable apiURL o usa tu instancia de axios central si tienes cookies extrañas.*

```typescript
import { create } from 'zustand';
import axios from 'axios';

interface Message {
  _id: string;
  sender: { _id: string; discordUsername: string; discordAvatar?: string };
  receiver?: { _id: string };
  content: string;
  createdAt: string;
}

interface ConversationUser {
  _id: string;
  discordUsername: string;
  discordAvatar?: string;
  lastMessage?: string;
}

interface ChatState {
  conversations: ConversationUser[];
  directMessages: Record<string, Message[]>; // Clave: _id del otro usuario
  isOpen: boolean;
  activeChatUserId: string | null;
  activeChatUserName: string | null;
  unreadCount: number;
  
  toggleChat: () => void;
  goBackToList: () => void;
  openPrivateChat: (userId: string, userName: string, userAvatar?: string) => void;
  
  fetchConversations: () => Promise<void>;
  fetchDirectHistory: (targetId: string) => Promise<void>;
  receiveMessage: (msg: Message, currentUser: any) => void;
}

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  directMessages: {},
  isOpen: false,
  activeChatUserId: null,
  activeChatUserName: null,
  unreadCount: 0,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen, unreadCount: state.isOpen ? state.unreadCount : 0 })),
  goBackToList: () => set({ activeChatUserId: null, activeChatUserName: null }),
  
  openPrivateChat: (userId, userName, avatar) => {
     set({ activeChatUserId: userId, activeChatUserName: userName, isOpen: true });
     
     // Añadirlo provisionalmente a conversaciones por si es un chat nuevo al requerir
     const state = get();
     if (!state.conversations.find(c => c._id === userId)) {
         set({ conversations: [{ _id: userId, discordUsername: userName, discordAvatar: avatar, lastMessage: 'Nuevo chat...' }, ...state.conversations] });
     }
  },

  fetchConversations: async () => {
    try {
      const { data } = await axios.get(`${apiURL}/api/chat/conversations`, { withCredentials: true });
      if (data.success) set({ conversations: data.conversations });
    } catch (e) {}
  },

  fetchDirectHistory: async (targetId: string) => {
    if (get().directMessages[targetId]) return; 
    try {
      const { data } = await axios.get(`${apiURL}/api/chat/direct/${targetId}`, { withCredentials: true });
      if (data.success) {
        set((state) => ({ directMessages: { ...state.directMessages, [targetId]: data.messages } }));
      }
    } catch (e) {}
  },

  receiveMessage: (msg, currentUser) => {
      const state = get();
      const isSender = msg.sender._id === currentUser._id;
      const targetUserId = isSender ? msg.receiver?._id : msg.sender._id;
      
      if (!targetUserId) return;

      const currentList = state.directMessages[targetUserId] || [];
      set({ directMessages: { ...state.directMessages, [targetUserId]: [...currentList, msg] }});
      
      // Actualiza lista de ultimos mensajes
      const existingConv = state.conversations.find(c => c._id === targetUserId);
      const updatedConversations = state.conversations.filter(c => c._id !== targetUserId);
      
      updatedConversations.unshift({
          _id: targetUserId,
          discordUsername: isSender ? existingConv?.discordUsername || 'Usuario' : msg.sender.discordUsername,
          discordAvatar: isSender ? existingConv?.discordAvatar : msg.sender.discordAvatar,
          lastMessage: msg.content
      });

      set({ conversations: updatedConversations });

      // Contador de no leídos
      if (!state.isOpen || state.activeChatUserId !== targetUserId) {
          set({ unreadCount: state.unreadCount + 1 });
      }
  }
}));
```

### B. Crea el Widget Principal `src/components/chat/ChatWidget.tsx`
Contiene la vista principal (lista de tus DMs pasados) y la vista activa (la sala que estés charlando).

```tsx
import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { MessageCircle, X, Send, User as UserIcon, ArrowLeft, MessageSquareText } from 'lucide-react';
import { io } from 'socket.io-client';

let socket: any;

export const ChatWidget = () => {
    const { user } = useAuthStore();
    const { 
        isOpen, toggleChat, goBackToList, conversations, 
        fetchConversations, receiveMessage, activeChatUserId, activeChatUserName,
        directMessages, fetchDirectHistory, openPrivateChat, unreadCount
    } = useChatStore();
    const [text, setText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;
        
        if (!socket) {
             socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
                 withCredentials: true
             });
             // Importante: autenticar para recibir DMs
             socket.emit('user:join', user._id); 
        }

        fetchConversations();

        const handleSysMessage = (msg: any) => {
            receiveMessage(msg, user);
            setTimeout(() => {
                if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 100);
        };

        socket.on('chat-sys:receive', handleSysMessage);

        return () => {
            socket.off('chat-sys:receive', handleSysMessage);
        };
    }, [user, fetchConversations, receiveMessage]);

    useEffect(() => {
        if (activeChatUserId) {
            fetchDirectHistory(activeChatUserId);
            setTimeout(() => {
                if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 100);
        }
    }, [activeChatUserId, fetchDirectHistory, directMessages]);

    const handleSend = () => {
        if (!text.trim() || !socket || !activeChatUserId) return;
        
        socket.emit('chat-sys:send', {
            content: text,
            receiverId: activeChatUserId
        });
        
        setText('');
    };

    const activeMessages = activeChatUserId ? directMessages[activeChatUserId] || [] : [];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Ventana de Mensajes */}
            {isOpen && (
                <div className="bg-neutral-900 border border-white/10 shadow-2xl rounded-xl w-80 h-[450px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    
                    {/* Header */}
                    <div className="bg-primary-600 p-3 flex items-center justify-between text-white shadow-md z-10">
                        {activeChatUserId ? (
                            <div className="flex items-center gap-2">
                                <button onClick={goBackToList} className="hover:bg-white/20 p-1 rounded transition">
                                    <ArrowLeft size={18} />
                                </button>
                                <span className="font-bold text-sm truncate max-w-[150px]">{activeChatUserName}</span>
                            </div>
                        ) : (
                            <span className="font-bold font-sans tracking-wide text-sm flex items-center gap-2">
                                <MessageSquareText size={18}/> MENSAJES PRIVADOS
                            </span>
                        )}

                        <button onClick={toggleChat} className="text-white/60 hover:text-white transition rounded p-1 border-none bg-transparent">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Vistas (Lista vs Chat en sí) */}
                    {!activeChatUserId ? (
                        // VISTA 1: Lista de Conversaciones Activas
                        <div className="flex-1 overflow-y-auto bg-neutral-950/80 p-2 space-y-1">
                            {conversations.length === 0 ? (
                                <p className="text-center text-xs text-white/30 mt-10">No tienes conversaciones activas aún.</p>
                            ) : (
                                conversations.map((conv) => (
                                    <button 
                                        key={conv._id} 
                                        onClick={() => openPrivateChat(conv._id, conv.discordUsername, conv.discordAvatar)}
                                        className="w-full text-left bg-white/5 hover:bg-white/10 p-3 rounded-xl flex items-center gap-3 transition group"
                                    >
                                        {conv.discordAvatar ? (
                                            <img src={conv.discordAvatar} className="w-10 h-10 rounded-full bg-white/5" alt={conv.discordUsername} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-600/30 flex items-center justify-center text-primary-400">
                                                <UserIcon size={20} />
                                            </div>
                                        )}
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-white mb-0.5 truncate group-hover:text-primary-400 transition">{conv.discordUsername}</p>
                                            <p className="text-xs text-white/40 truncate">{conv.lastMessage}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    ) : (
                        // VISTA 2: Chat en vivo con alguien
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-950/50" ref={scrollRef}>
                                {activeMessages.map((msg, i) => {
                                    const isMe = msg.sender._id === user?._id;
                                    return (
                                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-2.5 rounded-xl text-sm break-words max-w-[85%] ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                                                <p className="leading-snug">{msg.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-3 bg-neutral-900 border-t border-white/5 flex gap-2">
                                 <input 
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Mensaje privado..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                                 />
                                 <button onClick={handleSend} className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-500 transition cursor-pointer active:scale-95">
                                     <Send size={18} />
                                 </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Bubble Circular (Abrir/Cerrar) */}
            <button 
                onClick={toggleChat}
                className="w-14 h-14 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-900/40 transition-transform hover:scale-105 active:scale-95 relative cursor-pointer"
            >
                <MessageCircle size={28} />
                 {(!isOpen && unreadCount > 0) && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-neutral-950 shadow-sm animate-pulse">
                         {unreadCount}
                     </span>
                 )}
            </button>
        </div>
    );
};
```

### C. Añade el ChatWidget en `src/components/layout/DashboardLayout.tsx`
Inserta este código en tu layout para que esté presente en todo el sistema.

**1. Importación (Arriba del todo):**
```tsx
import { ChatWidget } from '../chat/ChatWidget';
```

**2. Renderizado (Antes de finalizar de retornar el componente Layout):**
```tsx
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex overflow-hidden">
        {/* ... (tu código de Sidebar, topbar, etc.) */}
        
        <main className="flex-1 overflow-hidden">
             {/* tu Outlet y contenido */} 
        </main>
        
        {/* Agrega el Widget Visual aquí al final: */}
        <ChatWidget />
    </div>
  )
```

## Para abrir un chat privado con un usuario (Ej: Desde otra página, un avatar en una lista, grupo, etc)
Simplemente debes importar el store y utilizar la función de apertura de DM en cualquier botón:
```tsx
import { useChatStore } from '../store/useChatStore';

// Dentro del componente que ocupes:
const openPrivateChat = useChatStore(state => state.openPrivateChat);

<button onClick={() => openPrivateChat(discordUserInfo._id, discordUserInfo.discordUsername, discordUserInfo.discordAvatar)}>
  Enviar DM
</button>
```

