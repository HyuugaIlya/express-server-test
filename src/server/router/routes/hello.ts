import express, { Response } from 'express'

import { TDatabase } from "../../db"
import { helloRepository } from '../../repositories/hello-repository'

export const getHelloRouter = () => {
    const router = express.Router()

    router
        .get(['/', '/hello'], async (_, res: Response<{ title: string }>) => {
            const hello = await helloRepository.getHello()
            res.json(hello)
        })

    return router
}