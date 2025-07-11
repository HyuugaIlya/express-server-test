import {
    Request,
    Response,
    NextFunction
} from 'express'
import { HTTP_STATUSES } from '../utils/common-utils'

export const basicAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.get('Authorization')
    if (!auth) {
        const err = new Error('Not Authenticated!')
        res.status(HTTP_STATUSES.UNAUTHORIZED).set('WWW-Authenticate', 'Basic')
        next(err)
    } else {
        const credentials = Buffer.from(auth.split(' ')[1], 'base64')
            .toString()
            .split(':')

        const [login, password] = credentials

        if (!(login === 'admin' && password === 'admin123')) {
            const err = new Error('Not Authenticated!')
            res.status(HTTP_STATUSES.UNAUTHORIZED).set('WWW-Authenticate', 'Basic')
            next(err)
        }

        res.status(HTTP_STATUSES.OK)
        next()
    }
}