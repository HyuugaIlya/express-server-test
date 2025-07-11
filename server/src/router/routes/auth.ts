import express from 'express'

import { body } from 'express-validator'

import {
    jwtAuthMiddleware,
    loginBodyValidation,
    inputValidationMiddleware,
    registrationBodyValidation,
    jwtSecretValidation
} from '../../middleware'

import {
    handleLogin,
    handleRegistration,
    handleRefresh,
    handleEmailConfirmation,
    handleLogout,
    handleGetUser
} from '../../controllers/authController'
import { loginLimiter } from '../../utils/auth-utils'

const validationHelper = (filed: string, options: { min: number, max: number }, text: string) => {
    return body(filed).trim().isLength(options).withMessage(text)
}
const usernameValidation = validationHelper('username', { min: 3, max: 20 }, 'Username is required and length should be from 3 to 20 symbols')
const passwordValidation = validationHelper('password', { min: 5, max: 40 }, 'Password is required and length should be from 5 to 40 symbols')

export const authRouter = () => {
    const router = express.Router()

    router
        .post(
            '/login',
            loginLimiter,
            jwtSecretValidation,
            loginBodyValidation,
            handleLogin
        )
        .post(
            '/signup',
            usernameValidation,
            passwordValidation,
            inputValidationMiddleware,
            jwtSecretValidation,
            registrationBodyValidation,
            handleRegistration
        )
        .post(
            '/refresh',
            jwtSecretValidation,
            handleRefresh
        )
        .get(
            '/get-user',
            jwtAuthMiddleware,
            handleGetUser
        )
        .post(
            '/confirm-email',
            handleEmailConfirmation
        )
        .post(
            '/logout',
            jwtSecretValidation,
            handleLogout
        )

    return router
}