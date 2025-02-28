import {
    db,
    TDBCollection,
    TSource
} from "."

type TDatabaseSource = {
    id?: number,
    title?: string
}
type TCollection = {
    toArray: () => TSource[]
    find: (obj?: TDatabaseSource) => ({ data: TSource[]; } & TCollection)
    sort: (str?: 'asc' | 'desc') => ({ data: TSource[]; } & TCollection)
    findOne: (obj?: TDatabaseSource) => TSource | null
    insertOne: (obj: TSource) => TSource
    insertMany: (arr: TSource[]) => TSource[]
    updateOne: (get: { id: number }, set: { title: string }) => TSource | null
    deleteOne: (obj: { id: number }) => void
}
type TDatabaseCLient = {
    db: TDBCollection & { [key: string]: TCollection }
    collection: (rep: string) => { data: TSource[] } & TCollection
}
export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = {
            db: {},
        } as TDatabaseCLient

        this._db.collection = (repository: string) => {
            const methods: TCollection = {
                toArray: (): TSource[] => {
                    return this._db.db[repository].data
                },
                find: (obj?: TDatabaseSource) => {
                    let result = this._db.db[repository].data
                    if (obj && (obj.id || obj.title)) {
                        result = [...this._db.db[repository].data].filter((el: TSource) => el.id === obj.id || obj.title?.length && el.title.includes(obj.title))
                    }
                    return {
                        ...this._db.db[repository],
                        data: result
                    }
                },
                sort: (str?: 'asc' | 'desc') => {
                    let result = this._db.db[repository].data

                    if (str) {
                        if (str === 'asc') {
                            result = [...this._db.db[repository].data].sort((a: TSource, b: TSource) => a.title > b.title ? 1 : -1)
                        } else if (str === 'desc') {
                            result = [...this._db.db[repository].data].sort((a: TSource, b: TSource) => a.title < b.title ? 1 : -1)
                        }
                    }

                    return {
                        ...this._db.db[repository],
                        data: result
                    }
                },
                findOne: (obj?: TDatabaseSource): TSource | null => {
                    if (obj && (obj.id || obj.title)) {
                        return this._db.db[repository].data.find((el: TSource) => el.id === obj.id || el.title === obj.title) ?? null
                    }

                    return this._db.db[repository].data[0] ?? null
                },
                insertOne: (obj: TSource): TSource => {
                    this._db.db[repository].data = [...this._db.db[repository].data, obj]
                    return obj
                },

                insertMany: (arr: TSource[]): TSource[] => {
                    this._db.db[repository].data = [...this._db.db[repository].data, ...arr]
                    return arr
                },

                updateOne: (get: { id: number }, set: { title: string }): TSource | null => {
                    let source = this._db.db[repository].data.find((el: TSource) => el.id === get.id)

                    if (source) source.title = set.title

                    return source ?? null
                },
                deleteOne: (obj: { id: number }) => {
                    this._db.db[repository].data = this._db.db[repository].data.filter((el: TSource) => el.id !== obj.id)
                }
            }

            if (!this._db.db[repository]) {
                this._db.db[repository] = {
                    data: [],
                    ...methods
                }
            }
            this._db.db[repository] = {
                ...this._db.db[repository],
                ...methods
            }
            return this._db.db[repository]
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
        const set = new Set()

        if (!set.has(dbName)) {
            set.add(dbName)
            this._db.db = db[dbName] as TDBCollection & { [key: string]: TCollection } || {}
        }

        return this._db
    }
}
