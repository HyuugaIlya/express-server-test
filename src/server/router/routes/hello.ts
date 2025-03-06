import express, { Response } from 'express'

import { TSource } from '../../db'
import { helloService } from '../../services/hello-service'

export const getHelloRouter = () => {
    const router = express.Router()

    router
        .get(['/', '/hello'], async (_, res: Response<TSource[]>) => {
            const hello = await helloService.getHello()
            res.json(hello)
        })

    return router
}