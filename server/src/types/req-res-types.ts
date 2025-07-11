import { Request, Response } from "express"

export type TRequestQuery<T> = Request<{}, {}, {}, T>
export type TRequestBody<T> = Request<{}, {}, T>
export type TRequestParams<T> = Request<T>
export type TRequestParamsNBody<P, B> = Request<P, {}, B>

export type TResponseBody<T> = Response<T, {}>