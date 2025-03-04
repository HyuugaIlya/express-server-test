import express, { Response } from 'express'

import { helloRepository } from '../../repositories/hello-repository'
import { TSource } from '../../db'

export const getHelloRouter = () => {
    const router = express.Router()

    router
        .get(['/', '/hello'], async (_, res: Response<TSource[]>) => {
            const hello = await helloRepository.getHello()
            res.json(hello)
        })

    return router
}