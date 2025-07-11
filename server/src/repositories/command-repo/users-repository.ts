import { collections } from '../../db'

type TUser = {
    id: number | string,
    accountData: {
        username: string,
        email: string,
        password: string,
    },
    emailConfirmation: {
        code: string,
        expirationDate: any,
        isConfirmed: boolean
    }
}
export const usersRepository = {
    async createUser(newUser: TUser): Promise<TUser> {
        return await collections.users.insertOne(newUser)
    },
    async updateConfirmation(id: string | number): Promise<boolean> {
        const updatedUser = await collections.users.updateOne({ id }, { 'emailConfirmation.isConfirmed': true })
        return updatedUser !== null
    },
    async deleteUser(id: number | string): Promise<void> {
        return await collections.users.deleteOne({ id })
    },
}