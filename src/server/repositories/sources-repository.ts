import { client } from '../app'
import { db, TSource } from '../db'

import { TSourceQueryModel } from '../models'

export const sourcesRepository = {
    async getSources(query: TSourceQueryModel): Promise<TSource[]> {
        const length = Object.keys(query).length

        if (length) {
            let result = client.db().collection('sources')
            result = query.title ? result.find({ title: query.title }) : result.find({})
            result = query.sort ? result.sort(query.sort) : result

            return result.toArray()
        }

        return client.db().collection('sources').find({}).toArray()
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
        return client.db().collection('sources').updateOne({ id }, { title })
    },

    async deleteSource(id: number): Promise<void> {
        client.db().collection('sources').deleteOne({ id })
    },
}