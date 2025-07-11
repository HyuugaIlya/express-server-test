import { Response } from 'express'

import {
    TRequestBody,
    TRequestParams,
    TRequestParamsNBody,
    TRequestQuery
} from "../types/req-res-types"

import { checkIsNaN, HTTP_STATUSES } from "../utils/common-utils"
import { mapToAPISourceModel } from '../utils/sources-utils'

import {
    TSourceQueryModel,
    TSourceAPIModel,
    TSourceURIParamsModel,
    TSourceCreateModel,
    TSourceUpdateModel
} from "../models"

import { sourcesQueryRepository } from "../repositories/query-repo/sources-query-repository"
import { sourcesService } from '../services/sources-service'


export const handleGetSources = async (req: TRequestQuery<TSourceQueryModel>, res: Response<{ data: TSourceAPIModel[] }>) => {
    const sources = await sourcesQueryRepository.getSources(req.query)
    if (!sources) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }

    res.json({ data: sources.map(mapToAPISourceModel) })
}

export const handleGetSourcesById = async (req: TRequestParams<TSourceURIParamsModel>, res: Response<TSourceAPIModel>) => {
    const source = await sourcesQueryRepository.getSourceById(checkIsNaN(req.params.id))
    if (!source) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
    }

    res.json(mapToAPISourceModel(source))
}

export const handleCreateSource = async (req: TRequestBody<TSourceCreateModel>, res: Response<TSourceAPIModel>) => {
    // fetch('http://localhost:3003/sources', { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: 'asdf' }) })

    const newSource = await sourcesService.createSource(req.body.title)
    res.status(HTTP_STATUSES.CREATED).json(mapToAPISourceModel(newSource))
}

export const handleUpdateSource = async (
    req: TRequestParamsNBody<TSourceURIParamsModel, TSourceUpdateModel>,
    res: Response<TSourceAPIModel>
) => {
    const updatedSource = await sourcesService.updateSource(checkIsNaN(req.params.id), req.body.title)

    if (updatedSource) {
        res.status(HTTP_STATUSES.OK).json(mapToAPISourceModel(updatedSource))
        return
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
}

export const handleDeleteSource = async (req: TRequestParams<TSourceURIParamsModel>, res: Response) => {
    await sourcesService.deleteSource(checkIsNaN(req.params.id))

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
}