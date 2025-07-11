export type TSource = Record<string, any>
export type TDBCollection<T = TSource> = {
    data: T[],
    totalCount: number
}
export type TDBCollections = {
    [key: string]: TDBCollection
}
export type TDatabase = {
    [key: string]: TDBCollections
}