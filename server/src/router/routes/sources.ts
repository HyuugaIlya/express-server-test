import express from 'express'

import { body } from 'express-validator'

import { inputValidationMiddleware } from '../../middleware/input-validation-middleware'
import {
    handleCreateSource,
    handleDeleteSource,
    handleGetSources,
    handleGetSourcesById,
    handleUpdateSource
} from '../../controllers/sourcesController'


export const getSourcesRouter = () => {
    const router = express.Router()

    const titleValidation = body('title').trim()
        .isLength({ min: 3, max: 40 })
        .withMessage('Title is required and length should be from 3 to 40 symbols')

    router
        .get('/', handleGetSources)
        .get('/:id', handleGetSourcesById)
        .post(
            '/',
            titleValidation,
            inputValidationMiddleware,
            handleCreateSource
        )
        .put(
            '/:id',
            titleValidation,
            inputValidationMiddleware,
            handleUpdateSource
        )
        .delete('/:id', handleDeleteSource)

    return router
}