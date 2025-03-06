import express, { Response } from 'express'

import { TSource } from '../../db'

import { sourcesService } from '../../services/sources-service'
import { sourcesQueryRepository } from '../../repositories/sources-query-repository'

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

import { body } from 'express-validator'

import { inputValidationMiddleware } from '../../middleware/input-validation-middleware'


const mapToAPISourceModel = (source: TSource): TSourceAPIModel => ({
    id: source.id,
    title: source.title
})

export const getSourcesRouter = () => {
    const router = express.Router()

    const titleValidation = body('title').trim()
        .isLength({ min: 3, max: 40 })
        .withMessage('Title is required and length should be from 3 to 25 symbols')

    router
        .get('/', async (req: TRequestQuery<TSourceQueryModel>, res: Response<TSourceAPIModel[]>) => {
            const sources = await sourcesQueryRepository.getSources(req.query)
            if (!sources) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
                return
            }
            res.json(sources.map(mapToAPISourceModel))
        })
        .get('/:id(\\d+)', async (req: TRequestParams<TSourceURIParamsModel>, res: Response<TSourceAPIModel>) => {
            const source = await sourcesQueryRepository.getSourceById(+req.params.id)
            if (!source) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
                return
            }

            res.json(mapToAPISourceModel(source))
        })
        .post(
            '/',
            titleValidation,
            inputValidationMiddleware,
            async (req: TRequestBody<TSourceCreateModel>, res: Response<TSourceAPIModel>) => {
                const newSource = await sourcesService.createSource(req.body.title)
                res.status(HTTP_STATUSES.CREATED).json(mapToAPISourceModel(newSource))
            }
        )
        .put(
            '/:id(\\d+)',
            titleValidation,
            inputValidationMiddleware,
            async (
                req: TRequestParamsNBody<TSourceURIParamsModel, TSourceUpdateModel>,
                res: Response<TSourceAPIModel>
            ) => {
                const updatedSource = await sourcesService.updateSource(+req.params.id, req.body.title)

                if (updatedSource) {
                    res.status(HTTP_STATUSES.OK).json(mapToAPISourceModel(updatedSource))
                    return
                }

                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            })
        .delete('/:id', async (req: TRequestParams<TSourceURIParamsModel>, res) => {
            await sourcesService.deleteSource(+req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        })

    return router
}