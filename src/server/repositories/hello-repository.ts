import { db } from '../db'

type THello = {
    title: string
}
export const helloRepository = {
    async getHello(): Promise<THello> {
        return { title: db.hello.title }
    },
}