import { collections } from '../../db'
import { TSource } from '../../db/types/db-types'

export const helloQueryRepository = {
    async getHello(): Promise<TSource[]> {
        const result = await collections.hello.find({})
        return result.toArray()
    },
}