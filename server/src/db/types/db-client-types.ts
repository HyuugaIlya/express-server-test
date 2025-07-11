import { TSource } from "./db-types"

export type TPagination<T> = {
    data: T[],
    toArray: () => T[]
}

export type TSkip<T> = (skip?: number) => TPagination<T> & { limit: TLimit<T> }
export type TLimit<T> = (limit?: number) => TPagination<T>

export type TFilter = {
    sort?: 'asc' | 'desc',
    limit?: string,
    page?: string
}

export type TDatabaseSource<T = TSource> = Partial<T>

export type TCollectionMethods<T> = {
    skip: TSkip<T>
    limit: TLimit<T>
    toArray: () => T[]
    find: (obj?: TDatabaseSource & TFilter) => Promise<TCollection<T>>
    findOne: (obj?: TDatabaseSource) => Promise<T | null>
    insertOne: (obj: T) => Promise<T>
    insertMany: (arr: T[]) => Promise<T[]>
    updateOne: (get: Record<string, any>, set: Record<string, any>) => Promise<T | null>
    deleteOne: (obj: { id: number | string }) => Promise<void>
}

export type TCollection<T> = {
    data: T[],
    skip: TSkip<T>,
    limit: TLimit<T>,
    toArray: () => T[]
}

export type TDatabaseCLient = {
    collection: <T>(rep: string) => TCollectionMethods<T>
    methods: <T>() => TCollectionMethods<T>
}

export type TCollectionThis = {
    collection: <T>(rep: string) => TCollectionMethods<T>
    methods: <T>() => TCollectionMethods<T>
    dbName: string
}

export type TMethodsThis = {
    collection: <T>(rep: string) => TCollectionMethods<T>
    methods: <T>() => TCollectionMethods<T>
    dbName: string
    repository: string
}
