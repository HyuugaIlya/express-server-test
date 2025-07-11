import { Response, Request } from 'express'
import bcrypt from 'bcrypt'

import { TRequestBody, TResponseBody } from "../types/req-res-types"

import { HTTP_STATUSES } from "../utils/common-utils"
import { jwtTokens } from '../utils/auth-utils'

import { authService } from '../services/auth-service'

import { usersQueryRepository } from "../repositories/query-repo/users-query-repository"

export type TLoginBody = {
    username: string, password: string, email?: never
} | {
    username?: never, password: string, email: string
}
export type TRegistrationBody = { username: string, password: string, email: string }
export type TAuthResponseBody = { message: string, tokens?: { accessToken: string } }

export const handleLogin = async (req: TRequestBody<TLoginBody>, res: TResponseBody<TAuthResponseBody>) => {
    const { username, password, email } = req.body

    const user = await usersQueryRepository.getUserByUsernameOrEmail(username ?? email)

    if (!user) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: 'User not found!'
        })
        return
    }

    if (!user.emailConfirmation.isConfirmed) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: "Email is not confirmed!" })
        return
    }

    const isMatch = await bcrypt.compare(password, user.accountData.password)
    if (!isMatch) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: "Incorrect credentials!" })
        return
    }

    try {
        const existingMeta = await authService.getMeta(user.id)
        if (!existingMeta) {
            const result = await authService.createMeta({ id: user.id, agent: req.header('user-agent')!, ip: req.header('x-forwarded-for') ?? req.ip! })
            if (!result) {
                throw new Error('Cannot create meta or the number of max simultaneous open sessions has been exceeded')
            }
        } else {
            const result = await authService.updateMeta({ id: user.id, agent: req.header('user-agent')!, ip: req.header('x-forwarded-for') ?? req.ip! })
            if (!result) {
                throw new Error('Cannot update meta')
            }
        }
    } catch (error) {
        console.log(error)
        res.clearCookie('refresh_token', {
            httpOnly: true
        })
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: 'Incorrect meta!'
        })
    }

    const [accessToken, refreshToken] = [jwtTokens.createAccessToken(user, '10m'), jwtTokens.createRefreshToken(user.id, '30d')]

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.status(HTTP_STATUSES.OK).json({
        message: 'Successfully Authenticated!',
        tokens: {
            accessToken
        }
    })
}

export const handleRegistration = async (req: TRequestBody<TRegistrationBody>, res: TResponseBody<TAuthResponseBody>) => {
    const { username, password, email } = req.body

    const possibleUser = await usersQueryRepository.getUserByUsernameOrEmail(username ?? email)

    if (possibleUser) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: `User with this username or email already exists!`
        })
        return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await authService.createUser({ username, password: passwordHash, email })

    if (!user) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: 'Can\'t create a user with provided data!'
        })
        return
    }

    const isMatch = await bcrypt.compare(password, user.accountData.password)
    if (!isMatch) {
        res.status(HTTP_STATUSES.UNAUTHORIZED).json({ message: "Not Authenticated!" })
        return
    }

    try {
        const result = await authService.createMeta({ id: user.id, agent: req.header('user-agent')!, ip: req.header('x-forwarded-for') ?? req.ip! })
        if (result === null) {
            throw new Error('The number of max simultaneous open sessions has been exceeded')
        }
    } catch (error) {
        console.log(error)
        res.clearCookie('refresh_token', {
            httpOnly: true
        })
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: 'Incorrect meta!'
        })
    }

    const [accessToken, refreshToken] = [jwtTokens.createAccessToken(user, '10m'), jwtTokens.createRefreshToken(user.id, '30d')]

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.status(HTTP_STATUSES.OK).json({
        message: 'Successfully Authenticated!',
        tokens: {
            accessToken
        }
    })
}

export const handleRefresh = async (req: TRequestBody<{ refreshToken: string }>, res: TResponseBody<TAuthResponseBody>) => {
    const refreshToken = req.cookies['refresh_token'] as string

    try {
        const refresh = jwtTokens.verifyToken(refreshToken) as { id: string }
        const user = await usersQueryRepository.getUserById(refresh.id)
        const meta = await authService.getMeta(refresh.id)

        if (!(meta && user)) {
            res.clearCookie('refresh_token', { httpOnly: true })
            res.status(HTTP_STATUSES.BAD_REQUEST).json({
                message: 'Incorrect data!'
            })
            return
        }

        const currentSession = meta.meta.find(el => el.ip === (req.header('x-forwarded-for') ?? req.ip) && el.agent === req.header('user-agent'))

        if (!currentSession) {
            res.clearCookie('refresh_token', { httpOnly: true })
            res.status(HTTP_STATUSES.BAD_REQUEST).json({
                message: 'Incorrect meta!'
            })
            return
        }

        try {
            await authService.updateSessionMeta(user.id, currentSession.id)
        } catch (error) {
            res.clearCookie('refresh_token', { httpOnly: true })
            res.status(HTTP_STATUSES.BAD_REQUEST).json({
                message: 'Cannot update session meta!'
            })
            return
        }

        const accessToken = jwtTokens.createAccessToken(user, '10m')

        res.status(HTTP_STATUSES.OK).json({
            message: 'Successfully Refreshed!',
            tokens: {
                accessToken
            }
        })

    } catch (error) {
        console.log(error)
        res.clearCookie('refresh_token', { httpOnly: true })
        res.status(HTTP_STATUSES.BAD_REQUEST).json({
            message: 'Refresh token should be provided!'
        })
    }
}

export const handleGetUser = async (req: Request, res: Response) => {
    res.json(req.user)
    return
}

export const handleEmailConfirmation = async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)

    if (!result) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Something went wrong!' })
        return
    }
    res.status(HTTP_STATUSES.OK).json({ message: 'Successfully Confirmed!' })
}

export const handleLogout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refresh_token'] as string

    if (!refreshToken) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'Refresh token should be provided!' })
        return
    }

    const refresh = jwtTokens.verifyToken(refreshToken) as { id: string }

    const user = await usersQueryRepository.getUserById(refresh.id)
    if (!user) {
        res.clearCookie('refresh_token', { httpOnly: true })
        res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'User Not Found!' })
        return
    }

    const meta = await authService.getMeta(refresh.id)
    if (!meta) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'No meta for Current User!' })
        return
    }

    const currentSession = meta.meta.find(el => el.ip === (req.header('x-forwarded-for') ?? req.ip) && el.agent === req.header('user-agent'))

    if (!currentSession) {
        res.status(HTTP_STATUSES.BAD_REQUEST).json({ message: 'No Session For Current user!' })
        return
    }

    await authService.deleteSessionMeta(meta.userId, currentSession.id)
    res.clearCookie('refresh_token', { httpOnly: true })
    res.status(HTTP_STATUSES.OK).json({ message: 'Successfully Logout!' })
}