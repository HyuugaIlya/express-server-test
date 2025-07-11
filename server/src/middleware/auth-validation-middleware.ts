import { Request, NextFunction } from 'express'

import { HTTP_STATUSES } from "../utils/common-utils"
import { TRequestBody, TResponseBody } from "../types/req-res-types"
import { TAuthResponseBody, TLoginBody, TRegistrationBody } from '../controllers/authController'

export const loginBodyValidation = async (
    req: TRequestBody<TLoginBody>,
    res: TResponseBody<TAuthResponseBody>,
    next: NextFunction
) => {
    const { username, password, email } = req.body

    if (!password || (!username && !email)) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: `Incorrect data or some data is missing!`
        })
        return
    }

    next()
}

export const registrationBodyValidation = async (
    req: TRequestBody<TRegistrationBody>,
    res: TResponseBody<TAuthResponseBody>,
    next: NextFunction
) => {
    const { username, password, email } = req.body

    if (!username || !password || !email) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: `Incorrect data or some data is missing!`
        })
        return
    }

    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: `Please enter correct email!`
        })
        return
    }

    next()
}

export const jwtSecretValidation = async (
    _: Request,
    res: TResponseBody<TAuthResponseBody>,
    next: NextFunction
) => {
    const secretKey = process.env.JWT_SECRET || 'my_secret'

    if (!secretKey) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: "Secret is missing or not valid" })
        return
    }

    next()
}