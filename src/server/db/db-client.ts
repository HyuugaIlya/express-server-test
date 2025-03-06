import {
    fetchDB,
    TDatabase,
    TDBCollection,
    TSource
} from "."

type TDatabaseSource = Record<string, any>
type TCollectionMethods<T = TSource> = {
    toArray: () => T[]
    find: (obj?: TDatabaseSource) => Promise<TCollection<T>>
    findOne: (obj?: TDatabaseSource) => Promise<T | null>
    insertOne: (obj: T) => Promise<T>
    insertMany: (arr: T[]) => Promise<T[]>
    updateOne: (get: { id: number }, set: { title: string }) => Promise<T | null>
    updateMany: (get: { id: number }[], set: { title: string }[]) => Promise<T[] | null>
    deleteOne: (obj: { id: number }) => Promise<void>
}
type TCollection<T = TSource> = {
    data: T[],
    toArray: () => T[]
}

type TCurrent = {
    dbName: string
    repository: string
}
type TDatabaseCLient = {
    current: TCurrent
    collection: <T>(rep: string) => TCollectionMethods<T>
    methods: <T>() => TCollectionMethods<T>
}

export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = {
            current: {}
        } as TDatabaseCLient

        this._db.collection = <T = TSource>(repository: string) => {
            this._db.current.repository = repository

            return {
                ...this._db.methods<T>()
            }
        }

        this._db.methods = <T = TSource>(): TCollectionMethods<T> => {
            const name = this._db.current.dbName
            const repository = this._db.current.repository

            return {
                toArray: function (this: TDBCollection<T>) {
                    return this.data
                },

                find: async (obj?: TDatabaseSource & { sort?: 'asc' | 'desc' }) => {
                    try {
                        const result = await this.resultDB()

                        if (obj) {
                            for (let key of Object.keys(obj)) {
                                if ((typeof obj[key] === 'string' || typeof obj[key] === 'number') && key !== 'sort') {
                                    result[name][repository].data = [...result[name][repository].data].filter((el: TSource) => typeof obj[key] === 'string'
                                        ? el[key].includes(obj[key])
                                        : el[key] === obj[key]
                                    )
                                }
                            }

                            if (obj.sort) {
                                if (obj.sort === 'asc') {
                                    result[name][repository].data = [...result[name][repository].data]
                                        .sort((a: TSource, b: TSource) => a.title > b.title ? 1 : -1)
                                } else if (obj.sort === 'desc') {
                                    result[name][repository].data = [...result[name][repository].data]
                                        .sort((a: TSource, b: TSource) => a.title < b.title ? 1 : -1)
                                }
                            }
                        }

                        return {
                            toArray: this._db.methods<T>().toArray,
                            data: result[name][repository].data as T[]
                        }
                    } catch (error) {
                        console.log(error)
                        return {
                            toArray: this._db.methods<T>().toArray,
                            data: []
                        } as TCollection<T>
                    }
                },

                findOne: async (obj?: TDatabaseSource) => {
                    try {
                        const db = await this.refetch()

                        if (obj) {
                            for (let key of Object.keys(obj)) {
                                if ((typeof obj[key] === 'string' || typeof obj[key] === 'number')) {
                                    return db[name]?.[repository]?.data
                                        .find((el: TSource) => el[key] === obj[key]) as T ?? null
                                }
                            }
                        }

                        return null
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                },

                insertOne: async (obj: T) => {
                    // fetch('http://localhost:3003/sources', { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: 'asdf' }) })

                    try {
                        let result = await this.resultDB()

                        obj = structuredClone(obj)

                        const newData = [...result[name][repository].data as T[], obj]

                        result[name][repository] = {
                            data: newData as TSource[],
                            totalCount: newData.length
                        }

                        await this.refetch(result)

                        return obj
                    } catch (error) {
                        console.log(error)
                        return {} as T
                    }
                },

                insertMany: async (arr: T[]) => {
                    try {
                        let result = await this.resultDB()

                        arr = structuredClone(arr)

                        const newData = [...result[name][repository].data as T[], ...arr]

                        result[name][repository] = {
                            data: newData as TSource[],
                            totalCount: newData.length
                        }

                        await this.refetch(result)

                        return arr
                    } catch (error) {
                        console.log(error)
                        return []
                    }
                },

                updateOne: async (get: { id: number }, set: Record<string, any>) => {
                    try {
                        let result = await this.resultDB()

                        let source = result[name][repository].data.find((el: TSource) => el.id === get.id)

                        let key = Object.keys(set)[0]

                        if (source) {
                            source[key] = set[key]

                            await this.refetch(result)
                        }

                        return source as T ?? null
                    } catch (error) {
                        console.log(error)
                        return null
                    }

                },

                updateMany: async (get: { id: number }[], set: Record<string, any>[]) => {
                    try {
                        let result = await this.resultDB()

                        const sources: T[] = []

                        get.map((obj, i) => {
                            let key = Object.keys(set)[0][0]
                            let source = result[name][repository].data.find((el: TSource) => el.id === obj.id)
                            if (source) {
                                source[key] = set[i][key]
                                sources.push(source as T)
                            }
                        })

                        await this.refetch(result)

                        return sources.length ? sources : null
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                },

                deleteOne: async (obj: { id: number }) => {
                    try {
                        let result = await this.resultDB()

                        const filteredData = result[name][repository].data.filter((el: TSource) => el.id !== obj.id)

                        result[name][repository] = {
                            data: filteredData,
                            totalCount: filteredData.length
                        }

                        await this.refetch(result)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    }

    async resultDB() {
        const name = this._db.current.dbName
        const repository = this._db.current.repository

        const db = await this.refetch()

        let result = structuredClone(db)

        return await this.create(result, !result[name], !result[name]?.[repository])
    }

    async createDB(result: TDatabase) {
        const name = this._db.current.dbName
        const repository = this._db.current.repository

        const newDb: TDatabase = {
            ...result,
            [name]: {
                [repository]: {
                    data: [],
                    totalCount: 0
                }
            }
        }

        return structuredClone(await this.refetch(newDb))
    }

    async createCollection(result: TDatabase) {
        const name = this._db.current.dbName
        const repository = this._db.current.repository

        const newDb: TDatabase = {
            ...result,
            [name]: {
                ...result[name],
                [repository]: {
                    data: [],
                    totalCount: 0
                }
            }
        }

        return structuredClone(await this.refetch(newDb))
    }

    async create(result: TDatabase, isDb?: boolean, isCol?: boolean) {
        if (isDb) {
            return await this.createDB(result)
        }

        if (isCol) {
            return await this.createCollection(result)
        }

        return result
    }

    db(dbName: string) {
        this._db.current.dbName = dbName

        return {
            ...this._db,
            ...this.refetch
        }
    }

    async refetch(newDb?: TDatabase) {
        const db = newDb
            ? await fetchDB(newDb)
            : await fetchDB()

        return db
    }

    async connect() {
        try {
            await this.refetch()
        } catch {
            await this.close()

            return 0
        }

        return 1
    }

    async close() {
        this._db = {} as TDatabaseCLient
        console.log('Connection closed')
    }
}