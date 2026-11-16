import express from 'express';
import { insertChat, getAllChats, getChatById, deleteChat } from '../services/chatService.js';
import Chat from '../models/chatModel.js';
import { isAuthorized } from '../middleware/authMiddleware.js';

const chatRouter = express.Router();

chatRouter.get('/', isAuthorized(1), async (req, res) => {
    try {
        const chats = await getAllChats();
        res.render('chats', {chats: chats, user: {
            userLevel: req.session.userLevel, 
            userid: req.session.userid}
        })

    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

chatRouter.get('/:id', isAuthorized(1), async (req, res) => {
    try {
        const id = req.params.id;
        
        const chat = await getChatById(id);
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: 'Kunne ikke hente chat' });
    }
});

chatRouter.delete('/:id', isAuthorized(2), async (req, res) => {
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
                res.status(403).json({error: "User doesnt own the chat"})
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