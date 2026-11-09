import express from 'express'
import userRouter from './routes/userRouter.js';
const app = express();
const port = 8080;

app.use('/users', userRouter)

app.get('/', (req, res) =>{
    res.send('Home')
})

app.listen(port, () => {
console.log(`Server is listening at http://localhost:${port}`)
})