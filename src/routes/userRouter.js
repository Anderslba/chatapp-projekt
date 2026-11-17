import { Router } from "express";
import { insertUser, getUsers, deleteUser } from "../services/userService.js";
import User from "../models/userModel.js";
import crypto from 'crypto'
import { isAuthorized } from "../middleware/authMiddleware.js";
import { isActive } from "../services/activityService.js";

const userRouter = Router();

// valider bruger og brugerlevel
userRouter.use(isAuthorized(3));

// hent user page
userRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        const safeUsers = users.map(user => {
            const safeUser = user.userWithoutPassword();
            safeUser.isActive = isActive(safeUser.userid);
            return safeUser;
        });

        res.render('users', { users: safeUsers });
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "Kunne ikke hente users" });
    }
});

// hent create user page
userRouter.get('/create', (req, res) => {
  try {
        res.render('createUser');
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: "fejl" });
    }
})

userRouter.post('/', async (req, res) => {
  try {
    const { username, password, level } = req.body;

    if (!username || !password || !level) {
      return res.status(400).json({ error: "Username, password og level er påkrævet" });
    }

    //Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    //userid
    const userid = crypto.randomUUID();

    const newUser = new User(userid, username, hashedPassword, Date.now(), level)
    await insertUser(newUser);

    res.redirect('/users');
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Der skete en fejl under oprettelsen af brugeren" });
  }
});

// delete user
userRouter.delete('/:id', isAuthorized(3), async (req, res) => {
  try {
    const userid = req.params.id;
    await deleteUser(userid);
    res.status(204).send();
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: "fejl" });
  }
})

export default userRouter;