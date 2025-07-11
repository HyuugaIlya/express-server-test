import { TResult } from "../services/sources-service"
import { TMeta, TUser } from "../services/auth-service"
import { DBClient } from "./db-client"
import { TDatabase } from "./types/db-types"

let db: TDatabase = {
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
        },
        users: {
            data: [
                {
                    id: 1,
                    accountData: {
                        username: 'admin',
                        email: 'testEmail@test.test',
                        password: '$2b$10$XoePUcw17jFmSho6paTO5etpDwUNT8ZrljZsnQKBvOs9Sr3UOQq9m',
                    },
                    emailConfirmation: {
                        code: 'admin-code',
                        expirationDate: new Date(),
                        isConfirmed: true
                    }
                },
            ],
            totalCount: 1
        }
    },
}

export const fetchDB = async (newDb?: TDatabase): Promise<TDatabase> => {
    if (newDb) db = structuredClone(newDb)

    return await new Promise((res) => {
        setTimeout(() => {
            res(db)
        }, 200)
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

export const collections = {
    sources: client.db('main').collection<TResult>('sources'),
    hello: client.db('main').collection<TResult>('hello'),
    users: client.db('main').collection<TUser>('users'),
    auth: client.db('main').collection<TMeta>('auth'),
}