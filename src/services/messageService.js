import { dbRef } from "../config/config.js";
import Message from "../models/messageModel.js";
import { collection, addDoc, getDoc, doc, getDocs, query, where } from "firebase/firestore";

// konverter firestore
const messageConverter = {
    toFirestore: message => {
        return {
            message: message.message,
            creationDate: message.creationDate,
            senderId: message.senderId,
            chat: message.chat
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Message(data.message, data.creationDate, data.senderId, data.chat, id);
    }
};

const messageCollection = collection(dbRef, "messages").withConverter(messageConverter);

async function getMessagesByChatId(chatId) {
    const q = query(messageCollection, where("chat", "==", chatId));
    const snapshot = await getDocs(q);

    const messages = snapshot.docs.map((doc) => {
        return doc.data();
    });

    return messages;
}

async function getSpecificMessage(chatId, messageId) {
    const messageDocRef = doc(messageCollection, messageId);
    const snapshot = await getDoc(messageDocRef);

    if (!snapshot.exists()) return null;

    const message = snapshot.data();

    if (message.chat != chatId) {
        return null;
    }

    return message;
}

async function insertMessage(message) {
    const docRef = await addDoc(messageCollection, message);
    message.id = docRef.id;
    return message;
}

async function getMessagesBySenderId(senderId) {
    const q = query(messageCollection, where("senderId", "==", senderId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data());
}

export { getMessagesByChatId,
    getSpecificMessage,
    insertMessage, 
    getMessagesBySenderId };