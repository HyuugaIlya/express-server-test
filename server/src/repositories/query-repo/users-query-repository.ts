import { collections } from '../../db'

import { TUsersQueryModel } from '../../models'

type TUser = {
    id: number | string,
    accountData: {
        username: string,
        email: string,
        password: string,
    },
    emailConfirmation: {
        code: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}
export const usersQueryRepository = {
    async getUsers(query: TUsersQueryModel = {}): Promise<TUser[] | null> {
        const length = Object.keys(query).length
        let filter = {}

        if (length) {
            filter = {
                ...filter,
                limit: query.limit,
                page: query.page,
                username: query.username,
                sort: query.sort
            }
        }

        const result = await collections.users.find(filter)
        return result.toArray()
    },

    async getUserById(id: number | string): Promise<TUser | null> {
        return await collections.users.findOne({ id })
    },

    async getUserByUsernameOrEmail(str: string): Promise<TUser | null> {
        const obj = { 'accountData.email': str, 'accountData.username': str }
        return await collections.users.findOne(obj)
    },

    async getUserByConfirmationCode(code: string): Promise<TUser | null> {
        const obj = { 'emailConfirmation.code': code }
        return await collections.users.findOne(obj)
    },
}