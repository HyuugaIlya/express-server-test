import express, { Express, Request, Response, NextFunction } from 'express'

import { db } from './db'

import {
    getSourcesRouter,
    getHelloRouter,
    getTestsRouter,
    // getBooksRouter
} from './router'

export const app: Express = express()
app.use(express.json({}))

let reqCount = 0
const reqCountMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    reqCount += 1
    console.log(reqCount)
    next()
}
app.use(reqCountMiddleware)

app.use('/', getHelloRouter())
app.use('/sources', getSourcesRouter())
app.use('/__tests__', getTestsRouter(db))
// app.use('/my', getBooksRouter(db))
