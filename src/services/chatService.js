import { dbRef } from "../config/config.js";
import Chat from "../models/chatModel.js";
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";

// konverter firestore
const chatConverter = {
    toFirestore: chat => {
        return {
            name: chat.name,
            creationDate: chat.creationDate,
            owner: chat.owner
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Chat(data.name, data.creationDate, data.owner, id);
    }
};

const chatCollection = collection(dbRef, "chats").withConverter(chatConverter);

// Opret ny chat
async function insertChat(chat) {
    const docRef = await addDoc(chatCollection, chat);
    chat.id = docRef.id;
    return chat;
}

// Få en liste af alle chats
async function getAllChats() {
    const snapshot = await getDocs(chatCollection);
    return snapshot.docs.map(doc => doc.data());
}

// Returner en specifik chat med ID
async function getChatById(id) {
    const chatDocRef = doc(dbRef, "chats", id).withConverter(chatConverter);
    const snapshot = await getDoc(chatDocRef);
    
    if (!snapshot.exists()) {
        return null;
    }
    
    return snapshot.data();
}

// Slet chat med ID
async function deleteChat(id) {
    const chatDocRef = doc(dbRef, "chats", id);
    await deleteDoc(chatDocRef);
    return { deletedId: id };
}

export { insertChat, getAllChats, getChatById, deleteChat };