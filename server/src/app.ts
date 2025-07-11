import express, { Express } from 'express'

import cors from 'cors'
import cookieParser from 'cookie-parser'

import {
    redirect,
    authRouter,
    getSourcesRouter,
    getHelloRouter,
    getTestsRouter,
    emailRouter
} from './router'

import {
    // basicAuthMiddleware,
    jwtAuthMiddleware,
    jwtSecretValidation,
    reqCountMiddleware
} from './middleware'
import { requestLimiter } from './utils/common-utils'

export const app: Express = express()

app.use(express.json({}))
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
// app.use((req, _, next) => {
//     cors({ credentials: true, origin: req.headers.origin })
//     next()
// })
app.use(cookieParser())
app.use(requestLimiter)

app.use(reqCountMiddleware)

app.use('/email', emailRouter())

app.use('/', redirect('/hello'))

app.use('/auth', authRouter())

app.use(
    '/hello',
    // Пример Basic авторизации
    // basicAuthMiddleware,
    getHelloRouter()
)
app.use(
    '/sources',
    jwtSecretValidation,
    jwtAuthMiddleware,
    getSourcesRouter()
)
app.use(
    '/__tests__',
    jwtSecretValidation,
    jwtAuthMiddleware,
    getTestsRouter()
)