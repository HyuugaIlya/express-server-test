import express, { Express, Request, Response, NextFunction } from 'express'

import { db } from '../server/db'


import {
    getSourcesRouter,
    getHelloRouter,
    getTestsRouter,
    // getBooksRouter
} from '../server/router'
import { DBClient } from './db/db-client'

export const app: Express = express()
app.use(express.json({}))

export const client = new DBClient()

let reqCount = 0
const reqCountMiddleware = (
    _: Request,
    __: Response,
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
// app.use('/my', getBooksRouter())
