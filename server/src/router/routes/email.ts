import { Router } from 'express'
import { handleSendEmail } from '../../controllers/emailController'

export const emailRouter = () => {
    const router = Router()

    router
        .post('/send', handleSendEmail)

    return router
}