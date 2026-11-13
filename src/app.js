import express from 'express'
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import session from 'express-session'
import { isAuthorized } from './middleware/authMiddleware.js';
import { sessionConfig } from './config/config.js';

const app = express();
const port = 8080;

app.use(express.urlencoded());
app.use(express.static('assets'));
app.use(session({
    secret: sessionConfig.secret,
    saveUninitialized: true,
    resave: true
}));
app.set('view engine', 'pug');

//routes
app.use(authRouter);
app.use('/users', isAuthorized(3), userRouter);
app.get('/chats', isAuthorized(1), (req, res) => {
    const userid = req.session.userid;
    const userLevel = req.session.userLevel
    res.render('chats', {user: {userid, userLevel }})
})

//404 fanger alle ukendte endpoints
app.use((req, res, next) => {
    res.send("404 not found")
})

app.listen(port, () => {
console.log(`Server is listening at http://localhost:${port}`)
})