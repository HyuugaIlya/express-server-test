import { collections } from '../../db'

type TMeta = {
    userId: string | number,
    meta: {
        agent: string,
        issuedAt: Date,
        id: string,
        ip: string
    }[]
}
export const authQueryRepository = {
    async getMeta(id: string | number): Promise<TMeta | null> {
        const result = await collections.auth.findOne({ userId: id })
        return result
    }
}