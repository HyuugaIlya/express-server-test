type THello = {
    title: string
}
export type TSource = {
    id: number
    title: string
}
export type TDatabase = {
    hello: THello
    sources: TSource[]
}
export const db: TDatabase = {
    hello: {
        title: 'Hello World!'
    },
    sources: [
        { id: 1, title: 'express' },
        { id: 2, title: 'server' },
        { id: 3, title: 'typescript' },
        { id: 4, title: 'project' },
    ]
}