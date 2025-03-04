import { DBClient } from "./db-client"

export type TSource<T = any> = Record<string | number, T>

export type TDBCollection<T = any> = {
    data: TSource<T>[],
    totalCount: number
}
export type TDBCollections = {
    [key: string]: TDBCollection
}

export type TDatabase = {
    [key: string]: TDBCollections
}
export let db: TDatabase = {
    main: {
        hello: {
            data: [
                { id: 1, title: 'Hello World!' }
            ],
            totalCount: 1
        },
        sources: {
            data: [
                { id: 1, title: 'express' },
                { id: 2, title: 'server' },
                { id: 3, title: 'typescript' },
                { id: 4, title: 'project' },
            ],
            totalCount: 4
        }
    },
}

export const fetchDB = async (newDb?: TDatabase): Promise<TDatabase> => {
    if (newDb) db = structuredClone(newDb)

    return await new Promise((res) => {
        setTimeout(() => {
            res(db)
        }, 5000)
    })
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