type THello = {
    id: number
    title: string
}

export type TSource = {
    id: number
    title: string
}

export type TDatabase = {
    hello: {
        data: THello[]
    }
    sources: {
        data: TSource[]
    }
}

export const dbF = (db?: TDatabase): Promise<TDatabase> => {
    return db
        ? new Promise(res => res(db))
        : new Promise(res => res(
            {
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
            }
        ))
}
export const db = {
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
}