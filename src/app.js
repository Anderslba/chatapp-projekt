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

app.get('/', (req, res) =>{
    res.send('Home')
})

app.listen(port, () => {
console.log(`Server is listening at http://localhost:${port}`)
})