import { Router } from "express";
import { getUserByUsername } from "../services/userService.js";
import crypto from 'crypto'

const authRouter = Router();

authRouter.get('/login', (req, res) => {
    res.render('login.pug');
})

authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const user = await getUserByUsername(username);
            
            if (user) {
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
                if (user.password == hashedPassword) {

                    // opret session token her også
                    req.session.userid = user.userid;
                    req.session.userLevel = user.level;
                    return res.status(200).json({ "status": "login ok" });
                }
            }
        }
        return res.status(400).json({ error: "Forkert brugernavn eller password" });
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Serverfejl" });
    }
})

authRouter.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})

export default authRouter;