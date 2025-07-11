import { v4 as uuid } from 'uuid'

import { sourcesRepository } from '../repositories/command-repo/sources-repository'

export type TResult = {
    id: number | string,
    title: string
}
export const sourcesService = {
    async createSource(title: string): Promise<TResult> {
        const newSource = {
            // id: +(new Date()),
            id: uuid(),
            title
        }

        return await sourcesRepository.createSource(newSource)
    },

    async updateSource(id: number | string, title: string): Promise<TResult | null> {
        return await sourcesRepository.updateSource(id, title)
    },

    async deleteSource(id: number | string): Promise<void> {
        await sourcesRepository.deleteSource(id)
    },
}