import jwt from 'jsonwebtoken'
import { rateLimit } from 'express-rate-limit'

import { TUser } from "../services/auth-service"
import { HTTP_STATUSES } from './common-utils'

const secretKey = process.env.JWT_SECRET || 'my_secret'
export const jwtTokens = {
    /**
        * @param user Should provide an object that fits TUser type
        * @param expiresIn String with value in years, days, hours, minutes or seconds 
        * @example '1y' | '1d' | '1h' | '1d' | '1m' | '1s'
        * @returns string
    */
    createAccessToken: (user: TUser, expiresIn: any) => {
        return jwt.sign({
            id: user.id,
            accountData: {
                username: user.accountData.username,
                email: user.accountData.email
            },
            emailConfirmation: {
                code: user.emailConfirmation.code,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        }, secretKey, { expiresIn })
    },
    /**
        * @param id Should provide an id that fits (string | number) type
        * @param expiresIn String with value in years, days, hours, minutes or seconds 
        * @example '1y' | '1d' | '1h' | '1d' | '1m' | '1s'
        * @returns string
    */
    createRefreshToken: (id: string | number, expiresIn: any) => {
        return jwt.sign({ id }, secretKey, { expiresIn })
    },
    /**
        * @param token Should provide a string type jwt token
        * @returns string | jwt.JwtPayload
    */
    verifyToken: (token: string) => {
        return jwt.verify(token, secretKey)
    }
}

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => {
        const date = new Date(req.rateLimit.resetTime)
        res.status(HTTP_STATUSES.TOO_MANY_ATTEMPTS).json({
            message: `Too Many Failed Login Attempts! Please Retry At ${date.toLocaleTimeString()}`
        })
    },
    requestWasSuccessful: (_, res) => res.statusCode === 200,
    skipSuccessfulRequests: true
})