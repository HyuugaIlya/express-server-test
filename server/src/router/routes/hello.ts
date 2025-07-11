import express, { Response, Request } from 'express'

import { TSource } from '../../db/types/db-types'

import { helloQueryRepository } from '../../repositories/query-repo/hello-query-repository'

export const getHelloRouter = () => {
    const router = express.Router()

    router
        .get('/', async (_: Request, res: Response<TSource[]>) => {
            const hello = await helloQueryRepository.getHello()
            res.json(hello)
        })

    return router
}