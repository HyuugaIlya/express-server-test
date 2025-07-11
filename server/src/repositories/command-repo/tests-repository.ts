import { client } from '../../db'

import { TSourceQueryModel } from '../../models'

type TCollection = {
    id: number,
    title: string
}
export const testsRepository = {
    async getSources(query: TSourceQueryModel): Promise<TCollection[] | null> {
        const length = Object.keys(query).length

        let collection = client.db('main').collection<TCollection>('products')

        if (length) {
            const result = await collection.find({ title: query.title, sort: query.sort })

            return result.toArray()
        }

        const result = await collection.find({})
        return result.toArray()
    },

    async getSourceById(id: number): Promise<TCollection | null> {
        return await client.db('main').collection<TCollection>('products').findOne({ id })
    },

    async createSource(title: string): Promise<TCollection> {
        const newSource = {
            id: +(new Date()),
            title
        }

        return await client.db('main').collection<TCollection>('products').insertOne(newSource)
    },

    async updateSource(id: number, title: string): Promise<TCollection | null> {
        return await client.db('main').collection<TCollection>('products').updateOne({ id }, { title })
    },

    async deleteSource(id: number): Promise<void> {
        await client.db('main').collection<TCollection>('products').deleteOne({ id })
    },
}