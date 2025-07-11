import { rateLimit } from "express-rate-limit"

export const HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    TOO_MANY_ATTEMPTS: 429
}

/**
    * @param id Should provide string type id
    * @returns boolean
*/
export const checkIsNaN = (id: string) => {
    return isNaN(+id) ? id : +id
}

export const requestLimiter = rateLimit({
    windowMs: 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})