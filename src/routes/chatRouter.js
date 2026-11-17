import { Router } from "express";
import { isAuthorized } from '../middleware/authMiddleware.js';

import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';

import { deleteChat, getChatById, getChats, insertChat } from '../services/chatService.js';
import { getMessagesByChatId, getSpecificMessage, insertMessage } from '../services/messageService.js'
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

// Opret chat side router
chatRouter.get('/create', isAuthorized(1), async (req, res) => {
    try {
        const chats = await getChats();
        
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

        let messages = await getMessagesByChatId(chat.id);
        
        for (let message of messages) {
            const owner = await getUserById(message.owner);
            message.username = owner.username;
        }

        messages = messages.sort((msg1, msg2) => msg1.creationDate - msg2.creationDate);

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

// GET-route Hent en specifik besked fra en chat
chatRouter.get('/:chatId/messages/:messageId', isAuthorized(1), async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messageId = req.params.messageId;

        const message = await getSpecificMessage(chatId, messageId);

        res.status(200).json(message);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// POST - Opret en ny chat
chatRouter.post('/', isAuthorized(2), async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Chat name is required'
            });
        }

        const newChat = new Chat(name, Date.now(), req.session.userId, undefined);
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
chatRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteChat(id);
        res.status(204).send();
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Could not delete chat'
        });
    }
})


// POST - Opret en besked i en chat
chatRouter.post('/:id/messages', isAuthorized(1), async (req, res) => {
    try {
        const chatId = req.params.id;
        const ownerId = req.session.userId;
        const { message } = req.body;

        // Kontroller at beskeden ikke er tom
        if (!message) {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        const newMessage = new Message(message, Date.now(), ownerId, chatId, undefined);

        await insertMessage(newMessage);

        res.redirect(`/chats/${chatId}`);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: 'Could not create message'
        });
    }
});


export default chatRouter;