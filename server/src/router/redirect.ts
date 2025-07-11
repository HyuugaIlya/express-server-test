import express, {
    Response,
    Request
} from 'express'

export const redirect = (path: string) => {
    const router = express.Router()

    router
        .get('/', async (_: Request, res: Response) => {
            res.redirect(path)
        })

    return router
}