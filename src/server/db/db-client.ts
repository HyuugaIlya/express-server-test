import {
    db,
    dbF,
    TDatabase,
    TSource
} from "."

const database = async function () {
    const result = await dbF()
    return result
}

type TDBSource = {
    id?: number,
    title?: string
}
export class DBClient {
    private _db: any

    constructor() {

        this._db = database()

        this._db.collection = (rep: keyof TDatabase) => {
            return this._db[rep]
        }

        for (let key of Object.keys(this._db)) {
            if (Array.isArray(this._db[key].data)) {

                this._db[key].toArray = function (): Promise<TSource[]> {
                    if (this.isFind) {
                        return this.find
                    }

                    return this.data
                }

                this._db[key].find = function (obj?: TDBSource): Promise<{ data: TSource[] } | null> {
                    this.isFind = false
                    if (obj && (obj.id || obj.title)) {
                        this.isFind = true
                        this.find = this.data.filter((el: TSource) => el.id === obj.id || obj.title && el.title.includes(obj.title))
                    }
                    return this
                }


                this._db[key].sort = function (str?: 'asc' | 'desc'): Promise<{ data: TSource[] } | null> {
                    if (str) {
                        if (str === 'asc') {
                            this.data = this.data.sort((a: TSource, b: TSource) => a.title > b.title ? 1 : -1)
                        } else if (str === 'desc') {
                            this.sort = this.data.sort((a: TSource, b: TSource) => a.title < b.title ? 1 : -1)
                        }
                    }
                    return this ?? null
                }

                this._db[key].findOne = function (obj?: TSource): Promise<TSource | null> {
                    if (obj && (obj.id || obj.title)) {
                        return this.data.find((el: TSource) => el.id === obj.id || el.title === obj.title) ?? null
                    }

                    return this.data[0] ?? null
                }

                this._db[key].insertOne = function (obj: TSource): TSource {
                    this.data = [...this.data, obj]
                    return obj
                }

                this._db[key].insertMany = function (arr: TSource[]): TSource[] {
                    this.data = [...this._db[key].data, ...arr]
                    return arr
                }

                this._db[key].updateOne = function (get: { id: number }, set: { title: string }): TSource | null {
                    let source: TSource = this.data.find((el: TSource) => el.id === get.id)

                    source.title = set.title

                    return source ?? null
                }

                // this._db[key].updateMany = (get: {id: number}[], set: {title: string}[]): Promise<TSource[] | null> => {
                //     const result: TSource[] = []
                //     get.map((obj, i) => {
                //         let source = this._db[key].data.find((el: TSource) => el.id === obj.id)
                //         if (source) {
                //             source.title = set[i].title
                //             result.push(source)
                //         }
                //     })
                //     return result.length ? result : null
                // }

                this._db[key].deleteOne = function (obj: { id: number }) {
                    this.data = this.data.filter((el: TSource) => el.id !== obj.id)
                }
            }
        }
    }

    db() {
        return this._db
    }
}
