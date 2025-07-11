import express, { Response } from 'express'

import { testsRepository } from '../../repositories/command-repo/tests-repository'

import { HTTP_STATUSES } from '../../utils/common-utils'

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
} from '../../types/req-res-types'

import { body } from 'express-validator'

import { inputValidationMiddleware } from '../../middleware/input-validation-middleware'
import { mapToAPISourceModel } from '../../utils/sources-utils'


export const getTestsRouter = () => {
    const router = express.Router()

    const titleValidation = body('title').trim()
        .isLength({ min: 3, max: 40 })
        .withMessage('Title is required and length should be from 3 to 25 symbols')

    router
        .get('/', async (req: TRequestQuery<TSourceQueryModel>, res: Response<TSourceAPIModel[]>) => {
            const sources = await testsRepository.getSources(req.query)
            if (!sources) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
                return
            }
            res.json(sources.map(mapToAPISourceModel))
        })
        .get('/:id(\\d+)', async (req: TRequestParams<TSourceURIParamsModel>, res: Response<TSourceAPIModel>) => {
            const source = await testsRepository.getSourceById(+req.params.id)
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
                const newSource = await testsRepository.createSource(req.body.title)
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
                const updatedSource = await testsRepository.updateSource(+req.params.id, req.body.title)
                if (updatedSource) {
                    res.status(HTTP_STATUSES.OK).json(mapToAPISourceModel(updatedSource))
                    return
                }

                res.sendStatus(HTTP_STATUSES.NOT_FOUND)
            })
        .delete('/:id', async (req: TRequestParams<TSourceURIParamsModel>, res) => {
            await testsRepository.deleteSource(+req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        })

    return router
}