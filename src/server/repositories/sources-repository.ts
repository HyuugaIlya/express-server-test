import { db, TSource } from '../db'

import { TSourceQueryModel } from '../models'

export const sourcesRepository = {
    async getSources(query: TSourceQueryModel): Promise<TSource[]> {
        const length = Object.keys(query).length

        if (length) {
            let sortedDB = [...db.sources]
            if (query.title) {
                sortedDB = sortedDB.filter(source => source.title.includes(query.title))
            }
            if (query.sort) {
                if (query.sort === 'asc') {
                    sortedDB = sortedDB.sort((a, b) => a.title > b.title ? 1 : -1)
                } else if (query.sort === 'desc') {
                    sortedDB = sortedDB.sort((a, b) => a.title < b.title ? 1 : -1)
                }
            }

            return sortedDB
        }

        return db.sources
    },

    async getSourceById(id: number): Promise<TSource | null> {
        return db.sources.find(s => s.id === id) ?? null
    },

    async createSource(title: string): Promise<TSource> {
        const newSource = {
            id: +(new Date()),
            title
        }
        db.sources.push(newSource)
        return newSource
    },

    async updateSource(id: number, title: string): Promise<TSource | null> {
        const source = db.sources.find(source => source.id === id)
        if (!source) {
            return null
        }
        source.title = title
        return source
    },

    async deleteSource(id: number): Promise<void> {
        db.sources = db.sources.filter(source => source.id !== id)
    },
}