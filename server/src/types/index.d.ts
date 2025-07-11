import { Request, Response } from 'express'

import { TUser } from '../services/auth-service'

declare global {
    namespace Express {
        interface Request {
            rateLimit: {
                limit: number,
                used: number,
                remaining: number,
                resetTime: Date
            }
            user: TUser | null
        }
        interface Response {
            user: TUser | null
        }
    }
}