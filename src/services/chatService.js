import { dbRef } from "../config/config.js"
import Chat from "../models/chatModel.js"
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";

//konverter firestore
const chatConverter = {
    toFirestore: chat => {
        return {
            name: chat.name, 
            creationDate: chat.creationDate, 
            owner: chat.owner
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Chat(data.name, data.creationDate, data.owner, id);
    }
}

const chatCollection = collection(dbRef, "chats").withConverter(chatConverter);

async function insertChat(chat) {
    addDoc(chatCollection.withConverter(chatConverter), chat)   
}

export { insertChat }