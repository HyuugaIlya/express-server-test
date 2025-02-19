import express, { Response } from 'express'

import { TSource } from '../../db'

import { sourcesRepository } from '../../repositories/sources-repository'

import { HTTP_STATUSES } from '../../utils'

import {
    TSourceAPIModel,
    TSourceQueryModel,
    TSourceURIParamsModel,
    TSourceCreateModel,
    TSourceUpdateModel
} from '../../models'
import {
    TRequestQuery,
    TRequestParams,
    TRequestBody,
    TRequestParamsNBody
} from '../../types'


const mapToAPISourceModel = (source: TSource): TSourceAPIModel => ({
    id: source.id,
    title: source.title
})

export const getSourcesRouter = () => {
    const router = express.Router()

    router
        .get('/', (req: TRequestQuery<TSourceQueryModel>, res: Response<TSourceAPIModel[]>) => {
            const sources = sourcesRepository.getSources(req.query)

            res.json(sources.map(mapToAPISourceModel))
        })
        .get('/:id(\\d+)', (req: TRequestParams<TSourceURIParamsModel>, res: Response<TSourceAPIModel>) => {
            const source = sourcesRepository.getSourceById(+req.params.id)
            if (!source) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
                return
            }

            res.json(mapToAPISourceModel(source))
        })
        .post('/', (req: TRequestBody<TSourceCreateModel>, res: Response<TSourceAPIModel>) => {
            if (!req.body.title) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
                return
            }

            const newSource = sourcesRepository.createSource(req.body.title)

            res.status(HTTP_STATUSES.CREATED).json(mapToAPISourceModel(newSource))
        })
        .put('/:id(\\d+)', (
            req: TRequestParamsNBody<TSourceURIParamsModel, TSourceUpdateModel>,
            res: Response<TSourceAPIModel>
        ) => {
            if (!req.body.title) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
                return
            }

            const updatedSource = sourcesRepository.updateSource(+req.params.id, req.body.title)
            if (updatedSource) {
                res.status(HTTP_STATUSES.OK).json(mapToAPISourceModel(updatedSource))
                return
            }

            res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        })
        .delete('/:id', (req: TRequestParams<TSourceURIParamsModel>, res) => {
            sourcesRepository.deleteSource(+req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        })

    return router
}

// export const getBooksRouter = (db: TDatabase) => {
//     const router = express.Router()

//     router
//         .get('/:id(\\d+)', (req: TRequestParams<TSourceURIParamsModel>, res: Response<{ title: string }>) => {
//             res.json({ title: `book id: ${req.params.id}` })
//         })
//         .get('/books', (req: TRequestQuery<TSourceQueryModel>, res: Response<{ title: string }>) => {

//             res.json({ title: 'books' })
//         })

//     return router
// }
