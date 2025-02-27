import {
    db,
    TDatabase,
    TSource
} from "."

export type TDatabaseSource = {
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
type TDatabaseCLient = TDatabase & {
    collection: (rep: keyof TDatabase) => { data: TDatabaseSource[] } & TCollection
    hello: TCollection
    sources: TCollection
}
export class DBClient {
    private _db: TDatabaseCLient

    constructor() {
        this._db = db as TDatabaseCLient

        this._db.collection = (rep: keyof TDatabase) => {
            return this._db[rep]
        }

        for (let key of Object.keys(this._db)) {
            if (Array.isArray(this._db[key as keyof TDatabase].data)) {

                this._db[key as keyof TDatabase].toArray = function (): TSource[] {
                    return this.data
                }

                this._db[key as keyof TDatabase].find = function (obj?: TDatabaseSource) {
                    let result = this.data
                    if (obj && (obj.id || obj.title)) {
                        result = [...this.data].filter((el: TSource) => el.id === obj.id || obj.title?.length && el.title.includes(obj.title))
                    }
                    return {
                        ...this,
                        data: result
                    }
                }

                this._db[key as keyof TDatabase].sort = function (str?: 'asc' | 'desc') {
                    let result = this.data

                    if (str) {
                        if (str === 'asc') {
                            result = [...this.data].sort((a: TSource, b: TSource) => a.title > b.title ? 1 : -1)
                        } else if (str === 'desc') {
                            result = [...this.data].sort((a: TSource, b: TSource) => a.title < b.title ? 1 : -1)
                        }
                    }

                    return {
                        ...this,
                        data: result
                    }
                }

                this._db[key as keyof TDatabase].findOne = function (obj?: TDatabaseSource): TSource | null {
                    if (obj && (obj.id || obj.title)) {
                        return this.data.find((el: TSource) => el.id === obj.id || el.title === obj.title) ?? null
                    }

                    return this.data[0] ?? null
                }

                this._db[key as keyof TDatabase].insertOne = function (obj: TSource): TSource {
                    this.data = [...this.data, obj]
                    return obj
                }

                this._db[key as keyof TDatabase].insertMany = function (arr: TSource[]): TSource[] {
                    this.data = [...this.data, ...arr]
                    return arr
                }

                this._db[key as keyof TDatabase].updateOne = function (get: { id: number }, set: { title: string }): TSource | null {
                    let source = this.data.find((el: TSource) => el.id === get.id)

                    if (source) source.title = set.title

                    return source ?? null
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

                this._db[key as keyof TDatabase].deleteOne = function (obj: { id: number }) {
                    this.data = this.data.filter((el: TSource) => el.id !== obj.id)
                }
            }
        }
    }

    db() {
        return this._db
    }
}
