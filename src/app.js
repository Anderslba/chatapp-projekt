import express from 'express'
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
const app = express();
const port = 8080;

app.use(express.urlencoded())
app.use(express.static('assets'))
app.set('view engine', 'pug')

//routes
app.use(authRouter);
app.use('/users', userRouter)

app.get('/', (req, res) =>{
    res.send('Home')
})

app.listen(port, () => {
console.log(`Server is listening at http://localhost:${port}`)
})