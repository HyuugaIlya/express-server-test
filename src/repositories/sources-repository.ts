import { db, TSource } from '../db'

import { TSourceQueryModel } from '../models'

export const sourcesRepository = {
    getSources(query: TSourceQueryModel) {
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

    getSourceById(id: number) {
        return db.sources.find(s => s.id === id)
    },

    createSource(title: string): TSource {
        const newSource = {
            id: +(new Date()),
            title
        }
        db.sources.push(newSource)
        return newSource
    },

    updateSource(id: number, title: string) {
        const source = db.sources.find(source => source.id === id)
        if (!source) {
            return
        }
        source.title = title
        return source
    },

    deleteSource(id: number) {
        db.sources = db.sources.filter(source => source.id !== id)
    },
}