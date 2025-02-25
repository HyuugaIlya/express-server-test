import { Request } from "express"

export type TRequestQuery<T> = Request<{}, {}, {}, T>
export type TRequestBody<T> = Request<{}, {}, T>
export type TRequestParams<T> = Request<T>
export type TRequestParamsNBody<P, B> = Request<P, {}, B>