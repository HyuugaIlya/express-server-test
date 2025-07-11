import { collections } from '../../db'

type TResult = {
    id: number | string,
    title: string
}
export const sourcesRepository = {
    async createSource(newSource: TResult): Promise<TResult> {
        return await collections.sources.insertOne(newSource)
    },

    async updateSource(id: number | string, title: string): Promise<TResult | null> {
        const isUpdated = await collections.sources.updateOne({ id }, { title })

        if (isUpdated) {
            return await collections.sources.findOne({ id })
        }

        return null
    },

    async deleteSource(id: number | string): Promise<void> {
        await collections.sources.deleteOne({ id })
    },
}