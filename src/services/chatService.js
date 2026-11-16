import { child, get, push, set, remove } from 'firebase/database';
import { dbRef } from '../config/config.js'; // Tilpas stien så den rammer jeres config.js (linje 28)
import { ChatMessage } from '../models/chatModel.js';

const MESSAGES_PATH = 'messages';

export const chatService = {
    // Hent alle beskeder (evt. filtreret på rum)
    async getAllMessages(room = null) {
        const snapshot = await get(child(dbRef, MESSAGES_PATH));
        if (!snapshot.exists()) {
            return [];
        }

        const data = snapshot.val();
        const messages = Object.entries(data).map(([id, msg]) => new ChatMessage({ id, ...msg }));

        if (room) {
            return messages.filter(msg => msg.room === room);
        }
        return messages;
    },

    // Opret og gem en ny besked i Firebase
    async createMessage(messageData) {
        const newMessage = new ChatMessage(messageData);
        const messagesRef = child(dbRef, MESSAGES_PATH);
        const newMsgRef = push(messagesRef); // Genererer unikt ID i Firebase

        await set(newMsgRef, newMessage.toFirebaseObject());
        
        newMessage.id = newMsgRef.key;
        return newMessage;
    },

    // Slet en besked ud fra ID
    async deleteMessage(id) {
        const msgRef = child(dbRef, `${MESSAGES_PATH}/${id}`);
        await remove(msgRef);
        return { deletedId: id };
    }
};