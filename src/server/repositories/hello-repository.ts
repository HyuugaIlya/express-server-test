import { db } from '../db'

type THello = {
    id: number
    title: string
}
export const helloRepository = {
    async getHello(): Promise<THello[]> {
        return db.hello.data
    },
}