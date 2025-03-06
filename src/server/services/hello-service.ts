import { collections, TSource } from '../db'
import { helloRepository } from '../repositories/hello-repository'

export const helloService = {
    async getHello(): Promise<TSource[]> {
        return helloRepository.getHello()
    },
}