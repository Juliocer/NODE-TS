import { UserService } from "./UserService.js";

jest.mock('../repositories/UserRepository')
jest.mock('../database', () => {
    intialize: jest.fn()
})

const mockUserRepository = require('../repositories/UserRepository')

describe('UserService', () => {
    const userService = new UserService(mockUserRepository)

    it('Deve adicionar um novo Usuário', async () => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve({
            id_user: '123456',
            name: 'julio',
            email: 'julio@test.com',
            password: '12345'
        }))
        const response = await userService.createUser('julio', 'julio@test.com', '123456');
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject({
            id_user: '123456',
            name: 'julio',
            email: 'julio@test.com',
            password: '12345'
        })
    })

    it('Deve retornar um usuário existente', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve({
            id_user: '123456',
            name: 'julio',
            email: 'julio@test.com',
            password: '12345'
        }))
        const response = await userService.getUser('123456')
        expect(mockUserRepository.getUser).toHaveBeenCalled()
        expect(response).toMatchObject({
            id_user: '123456',
            name: 'julio',
            email: 'julio@test.com',
            password: '12345'
        })
    })

    it('Deve retornar null ao deletar usuário inexistente', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(null))
        const response = await userService.getUser('id-inexistente')
        expect(mockUserRepository.getUser).toHaveBeenCalled()
        expect(response).toBeNull()
    })

    it('Deve deletar um usuário existente', async () => {
        mockUserRepository.deleteUser = jest.fn().mockResolvedValue(undefined);
        
        const userId = '123456';
        await userService.deleteUser(userId);

        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
    })
})