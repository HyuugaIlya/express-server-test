import { v4 as uuid } from 'uuid'
import { add } from 'date-fns/add'

import { emailService } from './email-service'

import { usersRepository } from '../repositories/command-repo/users-repository'
import { usersQueryRepository } from '../repositories/query-repo/users-query-repository'
import { authRepository } from '../repositories/command-repo/auth-repository'
import { authQueryRepository } from '../repositories/query-repo/auth-query-repository'

export type TMeta = {
    userId: string | number,
    meta: {
        agent: string,
        issuedAt: Date,
        id: string,
        ip: string
    }[]
}
export type TUser = {
    id: number | string,
    accountData: {
        username: string,
        email: string,
        password: string,
    }

    emailConfirmation: {
        code: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

type TCreateUser = {
    username: string,
    password: string,
    email: string
}
export const authService = {
    async createUser({
        username,
        password,
        email
    }: TCreateUser): Promise<TUser | null> {
        const newUser: TUser = {
            id: uuid(),
            accountData: {
                username,
                password,
                email,
            },
            emailConfirmation: {
                code: uuid(),
                expirationDate: add(new Date(), { hours: 1 }),
                isConfirmed: false
            }
        }

        const result = await usersRepository.createUser(newUser)

        try {
            await emailService.sendEmail(
                email,
                'Back-end App',
                `<h1>Confirm email page</h1><div><a href='http://localhost:5173/auth/emailConfirmation?code=${result.emailConfirmation.code}'>Confirm</a></div>`
            )
        } catch (error) {
            await usersRepository.deleteUser(newUser.id)
            console.log(error)
            return null
        }

        return result
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersQueryRepository.getUserByConfirmationCode(code)

        let result = false

        if (!user) return result
        if (user.emailConfirmation.isConfirmed) return result
        if (user.emailConfirmation.code !== code) return result
        if (user.emailConfirmation.expirationDate < new Date()) return result

        try {
            result = await usersRepository.updateConfirmation(user.id)
        } catch (error) {
            console.log(error)
            return result
        }

        return result
    },

    async createMeta(data: { id: string | number, agent: string, ip: string }) {
        const oldMeta = await authQueryRepository.getMeta(data.id)

        if (oldMeta?.meta.length && oldMeta?.meta.length > 5) {
            return null
        }

        let newMeta: TMeta
        if (!oldMeta) {
            newMeta = { userId: data.id, meta: [{ agent: data.agent, issuedAt: new Date(), id: uuid(), ip: data.ip }] }
        } else {
            newMeta = { userId: data.id, meta: [...oldMeta.meta, { agent: data.agent, issuedAt: new Date(), id: uuid(), ip: data.ip }] }
        }

        const result = await authRepository.createMeta(newMeta)
        return result
    },

    async getMeta(id: string | number) {
        return await authQueryRepository.getMeta(id)
    },

    async updateMeta(data: { id: string | number, agent: string, ip: string }) {
        const oldMeta = await authQueryRepository.getMeta(data.id)
        if (!oldMeta) {
            return null
        }

        const newMeta = {
            ...oldMeta,
            meta: [
                ...oldMeta.meta,
                {
                    agent: data.agent,
                    id: uuid(),
                    ip: data.ip,
                    issuedAt: new Date()
                }
            ]
        }
        return await authRepository.updateMeta(newMeta)
    },

    async updateSessionMeta(userId: string | number, sessionId: string) {
        const oldMeta = await authQueryRepository.getMeta(userId)
        if (!oldMeta) {
            return null
        }

        const newMeta = {
            ...oldMeta,
            meta: [...oldMeta.meta].map(el => (el.id === sessionId) ? { ...el, issuedAt: new Date() } : el)
        }
        return await authRepository.updateMeta(newMeta)
    },

    async deleteSessionMeta(userId: string | number, sessionId: string) {
        const oldMeta = await authQueryRepository.getMeta(userId)
        if (!oldMeta) {
            return null
        }

        const newMeta = {
            ...oldMeta,
            meta: [...oldMeta.meta].filter(el => el.id !== sessionId)
        }
        return await authRepository.updateMeta(newMeta)
    },

    // async deleteUser(id: number | string): Promise<void> {
    //     return await usersRepository.deleteUser(id)
    // },
}