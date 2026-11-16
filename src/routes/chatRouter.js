import express from 'express';
import { insertChat, getAllChats, getChatById, deleteChat } from '../services/chatService.js';
import Chat from '../models/chatModel.js';
import { isAuthorized } from '../middleware/authMiddleware.js';

import express from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import {collection,query,where,getDocs,doc, getDoc} from 'firebase/firestore';
import { dbRef } from '../config/config.js';

const router = express.Router();

//Get-Route chats
//Skal kunne retunere en liste alle chars
router.get('/', isAuthorized(1), async (req, res) => {
    try {
        const chats = await getAllChats();

        res.status(200).json(chats)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Could not retrieve chats'
        })
    }
})

//GET-Route ID
router.get('/:id', isAuthorized(1), async (req, res) => {
    try {
        const chat = await getChatById(req.params.id)
        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server fail'
        });
    }
});

router.delete('/:id', isAuthorized(2), async (req, res) => {
    try {
        const chatid = req.params.id;
        const userLevel = req.session.userLevel;
        if (userLevel == 2) {
            const userid = req.params.userid;
            const chat = await getChatById(chatid);
            if (chat.owner == userid) {
                await deleteChat(chatid);
                res.status(200).json("success");
            } else {
                res.status(403).json({error: "User doesnt own the chat"});
            }
        } else if (userLevel == 3) {
            await deleteChat(chatid);
            res.status(200).json("success");
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'Kunne ikke slette chat' });
    }
})

router.post('/', isAuthorized(2), async (req, res) => {
    try {
        const name = req.body.name;
        const userid = req.session.userid;
        if (name) {
            const chat = new Chat(name, Date.now(), userid, null);
            await insertChat(chat);
            return res.status(201).json("success");
        }
        return res.status(400).json("name required");
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//GET-route ID:messages
router.get('/:id/messages', async (req, res) => {
    try {
        const chatId = req.params.id;

        //Flyttes ind i messagesService
        const chatRef = doc(dbRef, 'chats', chatId);
        const chatSnapshot = await getDoc(chatRef);

        if (!chatSnapshot.exists()) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }

        const messagesRef = collection(dbRef, 'messages');

        const q = query(
            messagesRef,
            where('chatAffiliation', '==', chatId)
        );

        const snapshot = await getDocs(q);

        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(messages);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET-route Hent en specifik besked fra en chat
router.get('/:chatId/messages/:messageId', isAuthorized(1), async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messageId = req.params.messageId;

        //Flyttes ind i messagesService
        // Find beskeden i Firestore
        const messageRef = doc(dbRef, 'messages', messageId);
        const snapshot = await getDoc(messageRef);

        // Tjek om beskeden eksisterer
        if (!snapshot.exists()) {
            return res.status(404).json({
                error: 'Message not found'
            });
        }

        // Tjek om beskeden tilhører den angivne chat
        if (snapshot.data().chatAffiliation !== chatId) {
            return res.status(404).json({
                error: 'Message not found in this chat'
            });
        }

        const message = {
            id: snapshot.id,
            ...snapshot.data()
        };

        res.status(200).json(message);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default router