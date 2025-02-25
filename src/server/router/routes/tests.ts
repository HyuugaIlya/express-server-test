import express from 'express'
import { TDatabase } from '../../db'

import { HTTP_STATUSES } from '../../../utils'

export const getTestsRouter = (db: TDatabase) => {
    const router = express.Router()

    //TEMPORARY SOLUTION!!! FOR TESTING PURPOSES ONLY!!!
    router
        .delete('/data', (_, res) => {
            db.sources = []

            res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        })

    return router
}