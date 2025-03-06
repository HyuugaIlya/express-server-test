import { client, collections, TSource } from '../db'

import { TSourceQueryModel } from '../models'
import { sourcesRepository } from '../repositories/sources-repository'

export type TResult = {
    id: number,
    title: string
}
export const sourcesService = {
    async getSources(query: TSourceQueryModel): Promise<TResult[] | null> {
        return await sourcesRepository.getSources(query)
    },

    async getSourceById(id: number): Promise<TResult | null> {
        return await sourcesRepository.getSourceById(id)
    },

    async createSource(title: string): Promise<TResult> {
        const newSource = {
            id: +(new Date()),
            title
        }

        return await sourcesRepository.createSource(newSource)
    },

    async updateSource(id: number, title: string): Promise<TResult | null> {
        return await sourcesRepository.updateSource(id, title)
    },

    async deleteSource(id: number): Promise<void> {
        await sourcesRepository.deleteSource(id)
    },
}