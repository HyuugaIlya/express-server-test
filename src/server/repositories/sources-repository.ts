import { client } from '../app'
import { db, TSource } from '../db'

import { TSourceQueryModel } from '../models'

export const sourcesRepository = {
    async getSources(query: TSourceQueryModel): Promise<TSource[]> {
        // const length = Object.keys(query).length

        // if (length) {
        //     let result = client.db().collection('sources')
        //     result = query.title && query.title.length ? result.find({ title: query.title }) : result.find({})
        //     result = query.sort && query.sort.length ? result.sort(query.sort) : result.sort()

        //     return result.toArray()
        // }

        return client.db().collection('sources').find({}).toArray()

        // if (length) {
        //     let sortedDB = [...db.sources.data]
        //     if (query.title) {
        //         sortedDB = sortedDB.filter(source => source.title.includes(query.title))
        //     }
        //     if (query.sort) {
        //         if (query.sort === 'asc') {
        //             sortedDB = sortedDB.sort((a, b) => a.title > b.title ? 1 : -1)
        //         } else if (query.sort === 'desc') {
        //             sortedDB = sortedDB.sort((a, b) => a.title < b.title ? 1 : -1)
        //         }
        //     }

        //     return sortedDB
        // }

        // return db.sources.data
    },

    async getSourceById(id: number): Promise<TSource | null> {
        return client.db().collection('sources').findOne({ id })
    },

    async createSource(title: string): Promise<TSource> {
        const newSource = {
            id: +(new Date()),
            title
        }

        return client.db().collection('sources').insertOne(newSource)
    },

    async updateSource(id: number, title: string): Promise<TSource | null> {
        const source = db.sources.data.find(source => source.id === id)
        if (!source) {
            return null
        }
        source.title = title
        return source
    },

    async deleteSource(id: number): Promise<void> {
        db.sources.data = db.sources.data.filter(source => source.id !== id)
    },
}