import { collections } from '../../db'

import { TSourceQueryModel } from '../../models'

type TResult = {
    id: number | string,
    title: string
}
export const sourcesQueryRepository = {
    async getSources(query: TSourceQueryModel = {}): Promise<TResult[] | null> {
        const length = Object.keys(query).length
        let filter = {}

        if (length) {
            filter = {
                ...filter,
                limit: query.limit,
                page: query.page,
                title: query.title,
                sort: query.sort
            }
        }

        const result = await collections.sources.find(filter)
        return result.toArray()
    },

    async getSourceById(id: number | string): Promise<TResult | null> {
        const obj = await collections.sources.findOne({ id })
        return obj
    },
}