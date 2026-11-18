import express from 'express';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import session from 'express-session';
import { sessionConfig } from './config/config.js';
import chatRouter from './routes/chatRouter.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080;

// Find src-mappen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'assets')));

// Session
app.use(session({
    secret: sessionConfig.secret,
    saveUninitialized: true,
    resave: true
}));

// Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use(authRouter);
app.use('/users', userRouter);
app.use('/chats', chatRouter);

// 404
app.use((req, res) => {
    res.status(404).send('404 not found');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});