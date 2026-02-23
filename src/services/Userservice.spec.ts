import { UserService } from "./UserService.js";

jest.mock('../repositories/UserRepository')
jest.mock('../database', () => {
    intialize: jest.fn()
})

const mockUserRepository = require('../repositories/UserRepository')

describe('UserService', () => {
    const userService = new UserService(mockUserRepository)

    it('Deve adicionar um novo Usuário', async () => {
        const mockUser = { id_user: '123456', name: 'julio', email: 'julio@test.com', password: '12345' }

        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser))
        const response = await userService.createUser('julio', 'julio@test.com', '123456');
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar um usuário existente', async () => {
        const mockUser = { id_user: '123456', name: 'julio', email: 'julio@test.com', password: '12345' }

        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser))
        const response = await userService.getUser('123456')
        expect(mockUserRepository.getUser).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar null quando o usuário não for encontrado', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(() => Promise.resolve(null))
        const response = await userService.getUser('id-inexistente')
        expect(mockUserRepository.getUser).toHaveBeenCalled()
        expect(response).toBeNull()
    })

    it('Deve retornar todos os usuários', async () => {
        const mockUsers = [
            { id_user: '123456', name: 'julio', email: 'julio@gmail.com', password: '12345' },
            { id_user: '654321', name: 'maria', email: 'maria@gmail.com', password: '54321' }
        ]

        mockUserRepository.getAllUsers = jest.fn().mockResolvedValue(mockUsers)
        const response = await userService.getAllUsers()
        expect(mockUserRepository.getAllUsers).toHaveBeenCalled()
        expect(response).toMatchObject(mockUsers)
    })

    it('Deve deletar um usuário existente', async () => {
        mockUserRepository.deleteUser = jest.fn().mockResolvedValue(undefined);
        
        const userId = '123456';
        await userService.deleteUser(userId);

        expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
    })
})