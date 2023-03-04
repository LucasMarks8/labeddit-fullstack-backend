import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import { postRouter } from './router/postRouter'
import { userRouter } from './router/UserRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/posts", postRouter)

app.use("/users", userRouter)


