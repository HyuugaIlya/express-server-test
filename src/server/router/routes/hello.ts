import express, { Response } from 'express'

import { TSource } from '../../db'

import { helloQueryRepository } from '../../repositories/hello-query-repository'

export const getHelloRouter = () => {
    const router = express.Router()

    router
        .get(['/', '/hello'], async (_, res: Response<TSource[]>) => {
            const hello = await helloQueryRepository.getHello()
            res.json(hello)
        })

    return router
}