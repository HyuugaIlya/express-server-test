import { TSource } from "../db/types/db-types";
import { TSourceAPIModel } from "../models";

export const mapToAPISourceModel = (source: TSource): TSourceAPIModel => ({
    id: source.id,
    title: source.title
})