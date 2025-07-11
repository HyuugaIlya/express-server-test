import {
    Request,
    Response,
    NextFunction
} from 'express'

let reqCount = 0
export const reqCountMiddleware = (
    _: Request,
    __: Response,
    next: NextFunction
) => {
    reqCount += 1
    console.log(reqCount)
    next()
}