import { DBClient } from "./db-client"

export type TSource = {
    id: number
    title: string
}

export type TDBCollection = {
    [key: string]: {
        data: TSource[]
    }
}

export type TDatabase = {
    [key: string]: TDBCollection
}
export const db: TDatabase = {
    main: {
        hello: {
            data: [
                { id: 1, title: 'Hello World!' }
            ]
        },
        sources: {
            data: [
                { id: 1, title: 'express' },
                { id: 2, title: 'server' },
                { id: 3, title: 'typescript' },
                { id: 4, title: 'project' },
            ]
        }
    },
}

export const fetchDB = async (newDb?: TDatabase): Promise<TDatabase> => {
    return newDb
        ? Promise.resolve(newDb)
        : Promise.resolve(db)
}

export const client = new DBClient()

export async function runDb() {
    try {
        await client.connect()
        console.log('Successfully connected!')
    } catch {
        await client.close()
    }
}