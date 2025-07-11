import {
    Request,
    Response,
    NextFunction
} from 'express'

import { jwtTokens } from '../utils/auth-utils'
import { HTTP_STATUSES } from '../utils/common-utils'

import { TUser } from '../services/auth-service'

export const jwtAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: 'Not Authenticated!' })
        return
    }

    const authToken = req.headers.authorization.split(' ')[1]

    const isToken = authToken
        && authToken.length
        && authToken !== 'null'
        && authToken !== 'undefined'

    try {
        if (isToken) {
            try {
                req.user = jwtTokens.verifyToken(authToken) as TUser
                next()
            } catch (error: any) {
                res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: error.message || 'Not Authenticated!' })
                return
            }
        } else {
            throw new Error('Token is missing or expired!')
        }
    } catch (err: any) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: err.message || 'Not Authenticated!' })
        next(err)
    }
}