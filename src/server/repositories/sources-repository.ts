import { client } from '../app'
import { TSource } from '../db'

import { TSourceQueryModel } from '../models'

export const sourcesRepository = {
    async getSources(query: TSourceQueryModel): Promise<TSource[] | null> {
        const length = Object.keys(query).length

        if (length) {
            let result = client.db('main').collection('sources')
            result = query.title ? result.find({ title: query.title }) : result.find({})
            result = query.sort ? result.sort(query.sort) : result

            return result.toArray()
        }

        return client.db('main').collection('sources').find({}).toArray()
    },

    async getSourceById(id: number): Promise<TSource | null> {
        return client.db('main').collection('sources').findOne({ id })
    },

    async createSource(title: string): Promise<TSource> {
        const newSource = {
            id: +(new Date()),
            title
        }

        return client.db('main').collection('sources').insertOne(newSource)
    },

    async updateSource(id: number, title: string): Promise<TSource | null> {
        return client.db('main').collection('sources').updateOne({ id }, { title })
    },

    async deleteSource(id: number): Promise<void> {
        client.db('main').collection('sources').deleteOne({ id })
    },
}