import { collections } from '../db'

import { TSourceQueryModel } from '../models'

export type TResult = {
    id: number,
    title: string
}
export const sourcesQueryRepository = {
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
}