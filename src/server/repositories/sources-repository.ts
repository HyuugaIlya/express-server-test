import { collections } from '../db'

import { TSourceQueryModel } from '../models'

export type TResult = {
    id: number,
    title: string
}
export const sourcesRepository = {
    async getSources(query: TSourceQueryModel): Promise<TResult[] | null> {
        const length = Object.keys(query).length
        let filter = {}

        if (length) {
            filter = {
                ...filter,
                title: query.title,
                sort: query.sort
            }
        }

        const result = await collections.sources.find(filter)
        return result.toArray()
    },

    async getSourceById(id: number): Promise<TResult | null> {
        return await collections.sources.findOne({ id })
    },

    async createSource(newSource: TResult): Promise<TResult> {
        return await collections.sources.insertOne(newSource)
    },

    async updateSource(id: number, title: string): Promise<TResult | null> {
        const isUpdated = await collections.sources.updateOne({ id }, { title })

        if (isUpdated) {
            return await collections.sources.findOne({ id })
        }

        return null
    },

    async deleteSource(id: number): Promise<void> {
        await collections.sources.deleteOne({ id })
    },
}