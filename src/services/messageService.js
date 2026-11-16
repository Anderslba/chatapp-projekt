import { dbRef } from "../config/config.js";
import Message from "../models/messageModel.js";
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";

// konverter firestore
const messageConverter = {
    toFirestore: message => {
        return {
            message: message.message,
            creationDate: message.creationDate,
            owner: message.owner,
            chat: message.chat
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        const id = snapshot.id;
        return new Chat(data.message, data.creationDate, data.owner, data.chat, data.id);
    }
};