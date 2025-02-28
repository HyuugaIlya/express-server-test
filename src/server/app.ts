import express, {
    Express,
    Request,
    Response,
    NextFunction
} from 'express'

import {
    getSourcesRouter,
    getHelloRouter
} from '../server/router'

export const app: Express = express()
app.use(express.json({}))

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
