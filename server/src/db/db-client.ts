import { fetchDB } from "."

import {
    TDatabaseCLient,
    TCollectionThis,
    TMethodsThis,
    TCollectionMethods,
    TLimit,
    TDatabaseSource,
    TFilter,
    TCollection
} from "./types/db-client-types"

import {
    TSource,
    TDBCollection,
    TDatabase
} from "./types/db-types"

export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = {} as TDatabaseCLient

        this._db.collection = function <T = TSource>(this: TCollectionThis, repository: string) {
            return {
                ...this.methods.bind({ ...this, repository })<T>()
            }
        }

        this._db.methods = function <T>(this: TMethodsThis): TCollectionMethods<T> {
            const { dbName: name, repository } = this
            const { resultDB, refetch } = DBClient

            return {
                //mongodb pagination style
                skip: function (this: TDBCollection<T> & { toArray: () => T[], limit: TLimit<T> }, skip?: number) {
                    const currentSkip = skip || 0
                    return {
                        data: [...this.data].splice(currentSkip),
                        limit: this.limit,
                        toArray: this.toArray,
                    }
                },

                limit: function (this: TDBCollection<T> & { toArray: () => T[] }, limit?: number) {
                    const currentLimit = limit || 10
                    return {
                        data: [...this.data].splice(0, currentLimit),
                        toArray: this.toArray,
                    }
                },

                toArray: function (this: TDBCollection<T>) {
                    return this.data
                },

                find: async (obj?: TDatabaseSource & TFilter) => {
                    const { toArray, limit, skip } = this.methods<T>()

                    try {
                        const result = await resultDB(name, repository)

                        const l = obj?.limit?.length ? +obj?.limit : result[name][repository].data.length
                        const start = (obj?.page?.length ? (+obj?.page - 1) : 0) * l
                        const end = start + l

                        if (result) {
                            (result[name][repository].data as T[]) = [...result[name][repository].data as T[]].splice(start, end)
                        }

                        if (obj) {
                            const filterKeys = (k: string) => k !== 'sort' && k !== 'limit' && k !== 'page'
                            for (let key of Object.keys(obj).filter(filterKeys)) {
                                if ((typeof obj[key] === 'string' || typeof obj[key] === 'number')) {
                                    result[name][repository].data = [...result[name][repository].data].filter((el) => typeof obj[key] === 'string'
                                        ? el[key].includes(obj[key])
                                        : el[key] === obj[key]
                                    )
                                }
                            }

                            if (obj.sort && typeof obj.sort === 'string') {
                                if (obj.sort === 'asc') {
                                    result[name][repository].data = [...result[name][repository].data]
                                        .sort((a, b) => a.title > b.title ? 1 : -1)
                                } else if (obj.sort === 'desc') {
                                    result[name][repository].data = [...result[name][repository].data]
                                        .sort((a, b) => a.title < b.title ? 1 : -1)
                                }
                            }
                        }

                        return {
                            toArray, limit, skip,
                            data: result[name][repository].data as T[]
                        }
                    } catch (error) {
                        console.log(error)
                        return {
                            toArray,
                            data: [{ error: error }]
                        } as TCollection<T>
                    }
                },

                findOne: async (obj?: TDatabaseSource) => {
                    try {
                        const db = await resultDB(name, repository)

                        if (obj) {
                            for (let key of Object.keys(obj)) {
                                const data = db[name]?.[repository]?.data

                                if (!data) {
                                    return null
                                }

                                const subKeys = key.split('.').filter(el => el.length)
                                if (subKeys.length > 1) {
                                    const foundObj = data.find((el) => subKeys.reduce((s, c) => s?.[c], el) === obj[key]) as T
                                    if (foundObj) return foundObj

                                    continue
                                } else {
                                    if ((typeof obj[key] === 'string' || typeof obj[key] === 'number')) {
                                        const foundObj = data.find((el) => el[key] === obj[key]) as T
                                        if (foundObj) return foundObj

                                        continue
                                    }
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
                    try {
                        let result = await resultDB(name, repository)

                        obj = structuredClone(obj)

                        const newData = [...result[name][repository].data as T[], obj]

                        result[name][repository] = {
                            data: newData as TSource[],
                            totalCount: newData.length
                        }

                        await refetch(result)

                        return obj
                    } catch (error: any) {
                        console.log(error)
                        return {} as T
                    }
                },

                insertMany: async (arr: T[]) => {
                    try {
                        let result = await resultDB(name, repository)

                        arr = structuredClone(arr)

                        const newData = [...result[name][repository].data as T[], ...arr]

                        result[name][repository] = {
                            data: newData as TSource[],
                            totalCount: newData.length
                        }

                        await refetch(result)

                        return arr
                    } catch (error) {
                        console.log(error)
                        return []
                    }
                },

                updateOne: async (get: Record<string, any>, set: Record<string, any>) => {
                    try {
                        let result = await resultDB(name, repository)

                        const data = result[name]?.[repository]?.data

                        if (!data) {
                            return null
                        }

                        const getKey = Object.keys(get)[0]
                        const subGetKeys = getKey.split('.').filter(el => el.length)

                        let source: TSource | undefined
                        if (subGetKeys.length > 1) {
                            source = data.find((el) => subGetKeys.reduce((s, c) => s?.[c], el) === get[getKey])
                        } else {
                            source = data.find((el) => el?.[getKey] === get[getKey])
                        }

                        if (source) {
                            for (let key of Object.keys(set)) {
                                const subSetKeys = key.split('.').filter(el => el.length)

                                if (subSetKeys.length > 1) {
                                    let setData = subSetKeys.slice(0, subSetKeys.length - 1).reduce((s, c) => s?.[c], source)
                                    const dataKey = subSetKeys[subSetKeys.length - 1]
                                    if (setData) {
                                        setData[dataKey] = set[key]
                                    }
                                } else {
                                    source[key] = set[key]
                                }
                            }

                            await refetch(result)

                            return source as T
                        }

                        return null
                    } catch (error) {
                        console.log(error)
                        return null
                    }

                },

                deleteOne: async (obj: { id: number | string }) => {
                    try {
                        let result = await resultDB(name, repository)

                        const filteredData = result[name][repository].data.filter((el: TSource) => el.id !== obj.id)

                        result[name][repository] = {
                            data: filteredData,
                            totalCount: filteredData.length
                        }

                        await refetch(result)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    }

    static async refetch(newDb?: TDatabase | null) {
        const db = !newDb
            ? await fetchDB()
            : await fetchDB(newDb)

        return db
    }

    static async resultDB(name: string, repository: string) {
        const db = structuredClone(await DBClient.refetch())
        return await DBClient.create(db, name, repository)
    }

    static async create(db: TDatabase, name: string, repository: string) {
        let newDb: TDatabase | null = null

        if (!db[name] || !db[name]?.[repository]) {
            newDb = {
                ...db,
                [name]: {
                    ...db[name],
                    [repository]: {
                        data: [],
                        totalCount: 0
                    }
                }
            }
        }

        return structuredClone(await DBClient.refetch(newDb))
    }

    db(dbName: string) {
        return {
            ...this._db,
            dbName
        }
    }

    async connect() {
        try {
            await DBClient.refetch()
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