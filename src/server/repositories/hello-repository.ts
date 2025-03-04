import { db, TSource } from '../db'

export const helloRepository = {
    async getHello(): Promise<TSource[]> {
        return db.main.hello.data
    },
}