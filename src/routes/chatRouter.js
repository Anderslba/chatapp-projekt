import express from 'express';
import { insertChat } from '../services/chatService.js';
import Chat from '../models/chatModel.js';
import { isAuthorized } from '../middleware/authMiddleware.js';

const chatRouter = express.Router();

chatRouter.get('/:id', isAuthorized(1), async (req, res) => {
    try {
        const id = req.params.id;
        const messages = await chatService.getAllMessages(id);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke hente beskeder', details: error.message });
    }
});

chatRouter.post('/', isAuthorized(2), async (req, res) => {
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

export default chatRouter;