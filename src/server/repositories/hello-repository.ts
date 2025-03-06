import { collections, TSource } from '../db'

export const helloRepository = {
    async getHello(): Promise<TSource[]> {
        const result = await collections.hello.find({})
        return result.toArray()
    },
}