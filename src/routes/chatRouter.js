
import { Router } from "express";
import { isAuthorized } from '../middleware/authMiddleware.js';

import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';

import { deleteChat, getChatById, getChats, insertChat , editChat} from '../services/chatService.js';
import { getMessagesByChatId, getSpecificMessage, insertMessage } from '../services/messageService.js'
import { encryptMessage, decryptMessage } from "../services/cryptoService.js";
import { getUserById } from "../services/userService.js";

const chatRouter = Router();

// Chat side route
chatRouter.get('/', isAuthorized(1), async (req, res) => {
    try {
        const chats = await getChats();
        
        res.render('chats', { chats, user:{userId: req.session.userId, userLevel: req.session.userLevel} })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Could not retrieve chats'
        })
    }
});

// Opret chat side route
chatRouter.get('/create', isAuthorized(2), async (req, res) => {
    try {
        res.render('createChat')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Could not retrieve chats'
        })
    }
});

//GET-Route ID
chatRouter.get('/:id', isAuthorized(1), async (req, res) => {
    try {
        const chat = await getChatById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }

        let messages = await getMessagesByChatId(chat.id);
        
        for (let message of messages) {
            const sender = await getUserById(message.senderId);
            const encryptedMessage = message.message;
            message.message = await decryptMessage(encryptedMessage, chat.owner)
            message.username = sender ? sender.username : "deleted user";
        }

        messages = messages.sort((msg1, msg2) => msg2.creationDate - msg1.creationDate);

        res.render('chat', {
            chat, 
            messages,
            user: {
                userId: req.session.userId,
                userLevel: req.session.userLevel
            }});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server fejl'
        });
    }
});

// POST - Opret en ny chat
chatRouter.post('/', isAuthorized(2), async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: 'Chat name is required'
            });
        }

        const newChat = new Chat(name.trim(), Date.now(), req.session.userId, undefined);
        await insertChat(newChat);

        res.redirect('/chats')

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Could not create chat'
        });
    }
});

// DELETE - Slet en chat
chatRouter.delete('/:id', isAuthorized(2), async (req, res) => {
    try {
        const userLevel = Number(req.session.userLevel);
        const userId = req.session.userId;
        const chatId = req.params.id;

        const chat = await getChatById(chatId);

        if (!chat) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }
        
        if (userLevel == 2 && userId != chat.owner) {
            return res.status(403).json({
                error: 'Could not delete an other users chat'
            });
        }
        
        await deleteChat(chatId);
        res.status(204).send();
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Could not delete chat'
        });
    }
})

// PUT - Rediger en chat
chatRouter.put('/:id', isAuthorized(2), async (req, res) => {
    try {
        const userLevel = Number(req.session.userLevel);
        const userId = req.session.userId;
        const chatId = req.params.id;
        const newname = req.body.name;

        if (!newname || !newname.trim()) {
            return res.status(400).json({
                error: 'Chat name is required'
            });
        }

        const chat = await getChatById(chatId);

        if (!chat) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }
        
        if (userLevel == 2 && userId != chat.owner) {
            return res.status(403).json({
                error: 'Could not edit an other users chat'
            });
        }

        await editChat(chatId, newname.trim());
        res.status(200).send();
    } catch(error) {
        console.log(error)
        res.status(500).json({
            error: 'Could not edit chat'
        });
    }
})



// Messages

// POST - Opret en besked i en chat
chatRouter.post('/:id/messages', isAuthorized(1), async (req, res) => {
    try {
        const chatId = req.params.id;
        const senderId = req.session.userId;
        const { message } = req.body;

        // Kontroller at beskeden ikke er tom
        if (!message || !message.trim()) {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        // find chattens ejer id og krypter beskedf
        const chat = await getChatById(chatId);

        if (!chat) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }

        const encryptedMessage = await encryptMessage(message, chat.owner);

        const newMessage = new Message(encryptedMessage, Date.now(), senderId, chatId, undefined);

        await insertMessage(newMessage);

        res.redirect(`/chats/${chatId}`);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Could not create message'
        });
    }
});

// GET - Hent en specifik besked fra en chat
chatRouter.get('/:chatId/messages/:messageId', isAuthorized(1), async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const chat = await getChatById(chatId);
        const messageId = req.params.messageId;

        if (!chat) {
            return res.status(404).json({
                error: 'Chat not found'
            });
        }

        const message = await getSpecificMessage(chatId, messageId);
        if (!message) return res.status(404).json({ error: 'Besked ikke fundet' });

        const encryptedMessage = message.message;
        message.message = await decryptMessage(encryptedMessage, chat.owner);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default chatRouter;
