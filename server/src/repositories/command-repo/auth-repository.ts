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
export const authRepository = {
    async createMeta(meta: TMeta): Promise<TMeta> {
        return await collections.auth.insertOne(meta)
    },

    async updateMeta({ userId, meta }: TMeta): Promise<TMeta | null> {
        const result = await collections.auth.updateOne({ userId }, { meta })
        return result
    },

    async deleteMeta(id: string | number): Promise<void> {
        return await collections.auth.deleteOne({ id })
    },
}