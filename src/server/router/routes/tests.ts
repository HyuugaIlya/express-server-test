import express from 'express'
import { TDBCollection } from '../../db'

import { HTTP_STATUSES } from '../../utils'

export const getTestsRouter = (db: TDBCollection) => {
    const router = express.Router()

    //TEMPORARY SOLUTION!!! FOR TESTING PURPOSES ONLY!!!
    router
        .delete('/data', (_, res) => {
            db.sources.data = []

            res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        })

    return router
}