import { db } from '../db'

export const helloRepository = {
    getHello() {
        return { title: db.hello.title }
    },
}