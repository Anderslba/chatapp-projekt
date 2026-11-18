import { dbRef } from "../config/config.js";
import Chat from "../models/chatModel.js";
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

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
async function getChats() {
    const snapshot = await getDocs(chatCollection);
    const chats = snapshot.docs.map(doc => doc.data());
    return chats;
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
    const snapshot = await getDoc(chatDocRef);

    if (!snapshot.exists()) {
        return null;
    }

    await deleteDoc(chatDocRef);
    return { deletedId: id };
}

// Rediger navn på chat
async function editChat(id, name) {
    const chatDocRef = doc(dbRef, "chats", id);
    const snapshot = await getDoc(chatDocRef);

    if (!snapshot.exists()) {
        return null;
    }

    await updateDoc(chatDocRef, { name: name });
    return { id, name };
}

async function deleteChatsByUserid(userId) {
    const q = query(chatCollection, where("owner", "==", userId));
    const snapshot = await getDocs(q);
    
    Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)))
}

export { insertChat, getChats, getChatById, deleteChat, editChat, deleteChatsByUserid };