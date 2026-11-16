import express from 'express';
import { chatService } from '../services/chatService.js';

const router = express.Router();

// GET /api/chat (eller /api/chat?room=general)
router.get('/', async (req, res) => {
    try {
        const { room } = req.query;
        const messages = await chatService.getAllMessages(room);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke hente beskeder', details: error.message });
    }
});

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        // Du kan evt. hente sender fra req.session.user, da I har express-session installeret
        const { sender, text, room } = req.body;
        const createdMessage = await chatService.createMessage({ sender, text, room });
        res.status(201).json(createdMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/chat/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await chatService.deleteMessage(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke slette besked', details: error.message });
    }
});

export default router;