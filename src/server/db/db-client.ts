import {
    fetchDB,
    TDBCollection,
    TDBCollections,
    TSource
} from "."

type TDatabaseSource = {
    id?: number,
    title?: string
}
type TCollectionMethods = {
    toArray: () => TSource[]
    find: (obj?: TDatabaseSource) => TCollection
    sort: (str?: 'asc' | 'desc') => TCollection
    findOne: (obj?: TDatabaseSource) => TSource | null
    insertOne: (obj: TSource) => Promise<TSource>
    insertMany: (arr: TSource[]) => Promise<TSource[]>
    updateOne: (get: { id: number }, set: { title: string }) => Promise<TSource | null>
    deleteOne: (obj: { id: number }) => Promise<void>
}
type TCollection = TDBCollection & TCollectionMethods
type TFetchedDB = {
    [key: string]: TDBCollections
}
type TCurrent = {
    dbName: string
    repository: string
}
type TDatabaseCLient = {
    db: TFetchedDB
    current: TCurrent
    collection: (rep: string) => TCollection
    methods: () => TCollectionMethods
}

export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = {
            db: {},
            current: {}
        } as TDatabaseCLient

        this._db.collection = (repository: string) => {
            this._db.current.repository = repository
            const name = this._db.current.dbName

            if (!this._db.db[name][repository]) {
                this._db.db[name][repository] = {
                    data: [],
                    totalCount: 0
                }
            }

            return {
                ...this._db.db[name][repository],
                ...this._db.methods()
            }
        }

        this._db.methods = (): TCollectionMethods => {
            const name = this._db.current.dbName
            const repository = this._db.current.repository

            return {
                toArray: (): TSource[] => {
                    return this._db.db[name][repository].data
                },
                find: (obj?: TDatabaseSource) => {
                    this.refetch()

                    let result = this._db.db[name][repository].data

                    if (obj && (obj.id || obj.title)) {
                        result = [...this._db.db[name][repository].data]
                            .filter((el: TSource) => el.id === obj.id || obj.title?.length && el.title.includes(obj.title))
                    }

                    this._db.db[name][repository] = {
                        ...this._db.db[name][repository],
                        data: result
                    }

                    return {
                        ...this._db.db[name][repository],
                        ...this._db.methods(),
                        data: result
                    }
                },
                sort: (str?: 'asc' | 'desc') => {
                    this.refetch()

                    let result = this._db.db[name][repository].data

                    if (str) {
                        if (str === 'asc') {
                            result = [...this._db.db[name][repository].data]
                                .sort((a: TSource, b: TSource) => a.title > b.title ? 1 : -1)
                        } else if (str === 'desc') {
                            result = [...this._db.db[name][repository].data]
                                .sort((a: TSource, b: TSource) => a.title < b.title ? 1 : -1)
                        }
                    }

                    this._db.db[name][repository] = {
                        ...this._db.db[name][repository],
                        data: result
                    }

                    return {
                        ...this._db.db[name][repository],
                        ...this._db.methods(),
                        data: result
                    }
                },
                findOne: (obj?: TDatabaseSource): TSource | null => {
                    this.refetch()

                    if (obj && (obj.id || obj.title)) {
                        return this._db.db[name][repository].data
                            .find((el: TSource) => el.id === obj.id || el.title === obj.title) ?? null
                    }

                    return this._db.db[name][repository].data[0] ?? null
                },
                insertOne: async (obj: TSource): Promise<TSource> => {
                    // fetch('http://localhost:3003/sources', { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: 'asdf' }) })

                    const result = [...this._db.db[name][repository].data, obj]

                    this._db.db[name][repository] = {
                        data: result,
                        totalCount: result.length
                    }

                    this.refetch(true)

                    return obj
                },

                insertMany: async (arr: TSource[]): Promise<TSource[]> => {
                    const result = [...this._db.db[name][repository].data, ...arr]

                    this._db.db[name][repository] = {
                        data: result,
                        totalCount: result.length
                    }

                    this.refetch(true)

                    return arr
                },

                updateOne: async (get: { id: number }, set: { title: string }): Promise<TSource | null> => {

                    let source = this._db.db[name][repository].data.find((el: TSource) => el.id === get.id)

                    if (source) source.title = set.title

                    this.refetch(true)

                    return source ?? null
                },
                deleteOne: async (obj: { id: number }) => {
                    const result = this._db.db[name][repository].data.filter((el: TSource) => el.id !== obj.id)

                    this._db.db[name][repository] = {
                        data: result,
                        totalCount: result.length
                    }

                    this.refetch(true)
                }
            }
        }

        // this._db[key].updateMany = (get: {id: number}[], set: {title: string}[]): TSource[] | null => {
        //     const result: TSource[] = []
        //     get.map((obj, i) => {
        //         let source = this.data.find((el: TSource) => el.id === obj.id)
        //         if (source) {
        //             source.title = set[i].title
        //             result.push(source)
        //         }
        //     })
        //     return result.length ? result : null
        // }

    }

    db(dbName: string) {
        this._db.current.dbName = dbName

        return {
            ...this._db,
            ...this.refetch
        }
    }

    async refetch(isUpdate?: boolean) {
        const db = isUpdate
            ? await fetchDB(this._db.db)
            : await fetchDB()

        this._db.db = structuredClone(db)

        // return db
    }

    async connect() {
        await this.refetch()

        return 1
    }

    async close() {
        console.log('Connection closed')
    }
}