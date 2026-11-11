import { Router } from "express";
import { insertUser, getUsers } from "../services/userService.js";
import User from "../models/userModel.js";
import crypto from 'crypto'

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(201).json({users})
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Kunne ikke hente users" });
    }
    
});

userRouter.post('/', async (req, res) => {
  try {
    const { username, password, level } = req.body;

    if (!username || !password || !level) {
      return res.status(400).json({ error: "Username, password og level er påkrævet" });
    }


    //Generer id
    const userid = crypto.randomUUID();
    //Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = new User(userid, username, hashedPassword, Date.now(), level)
    await insertUser(newUser);

    res.status(201).json({ message: "Bruger oprettet successfuldt"});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Der skete en fejl under oprettelsen af brugeren" });
  }
});

export default userRouter;