import { dbRef } from "../config/config.js";
import Message from "../models/messageModel.js";
import { decryptMessage } from "./cryptoService.js";
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

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

async function getMessagesByChatId(chatid) {
    const q = query(messageCollection, where("chat", "==", chatid));
    const snapshot = await getDocs(q);

    let messages = snapshot.docs.map((doc) => {
        return doc.data();
    })

    messages = messages.sort((msg1, msg2) => msg2.creationDate - msg1.creationDate);

    return messages;
}

async function getSpecificMessage(chatid, messageid) {
    const messageDocRef = doc(messageCollection, messageid);
    const snapshot = await getDoc(messageDocRef);

    if (!snapshot.exists()) return null;

    const message = snapshot.data();

    if (message.chat != chatid) {
        return null;
    }

    return message;
}

async function insertMessage(message) {
    const docRef = await addDoc(messageCollection, message);
    message.id = docRef.id;
    return message;
}

export { getMessagesByChatId, getSpecificMessage, insertMessage };