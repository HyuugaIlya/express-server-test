import {
    fetchDB,
    TDBCollection,
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
type TCollection = { data: TSource[] } & TCollectionMethods
type TFetchedDB = {
    [key: string]: TDBCollection & {
        [key: string]: TCollectionMethods
    }
} & {
    dbName: string
}
type TDatabaseCLient = {
    db: TFetchedDB
    collection: (rep: string) => TCollection
}
export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = {
            db: {},
        } as TDatabaseCLient

        this._db.collection = (repository: string) => {
            const name = this._db.db.dbName
            const methods: TCollectionMethods = {
                toArray: (): TSource[] => {
                    return this._db.db[name][repository].data
                },
                find: (obj?: TDatabaseSource) => {
                    let result = this._db.db[name][repository].data
                    if (obj && (obj.id || obj.title)) {
                        result = [...this._db.db[name][repository].data]
                            .filter((el: TSource) => el.id === obj.id || obj.title?.length && el.title.includes(obj.title))
                    }

                    return {
                        ...this._db.db[name][repository],
                        data: result
                    }
                },
                sort: (str?: 'asc' | 'desc') => {
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

                    return {
                        ...this._db.db[name][repository],
                        data: result
                    }
                },
                findOne: (obj?: TDatabaseSource): TSource | null => {
                    if (obj && (obj.id || obj.title)) {
                        return this._db.db[name][repository].data
                            .find((el: TSource) => el.id === obj.id || el.title === obj.title) ?? null
                    }

                    return this._db.db[name][repository].data[0] ?? null
                },
                insertOne: async (obj: TSource): Promise<TSource> => {

                    this._db.db[name][repository].data = [...this._db.db[name][repository].data, obj]

                    return obj
                },

                insertMany: async (arr: TSource[]): Promise<TSource[]> => {
                    this._db.db[name][repository].data = [...this._db.db[name][repository].data, ...arr]
                    return arr
                },

                updateOne: async (get: { id: number }, set: { title: string }): Promise<TSource | null> => {
                    let source = this._db.db[name][repository].data.find((el: TSource) => el.id === get.id)

                    if (source) source.title = set.title

                    return source ?? null
                },
                deleteOne: async (obj: { id: number }) => {
                    this._db.db[name][repository].data = this._db.db[name][repository].data
                        .filter((el: TSource) => el.id !== obj.id)
                }
            }

            if (!this._db.db[name][repository]) {
                this._db.db[name][repository] = {
                    data: [],
                    ...methods
                }
            }

            this._db.db[name][repository] = {
                ...this._db.db[name][repository],
                ...methods
            }
            return this._db.db[name][repository]
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
        this._db.db.dbName = dbName

        return this._db
    }

    async connect() {
        const db = await fetchDB()
        this._db.db = db as TFetchedDB
    }

    async close() {
        console.log('Connection closed')
    }
}

