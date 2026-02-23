import { EntityManager } from "typeorm"
import { getMockEntityManager } from "../__mocks__/mockEntityManager.mock"
import { User } from "../entities/User"
import { UserRepository } from "./UserRepository"

describe('UserRepository', () => {
    let userRepository: UserRepository
    let managerMock: Partial<EntityManager>

    const mockUser: User = {
        id_user: '12345',
        name: 'test User',
        email: 'test@dio.com',
        password: 'password'
    }

    beforeAll(async () => {
        managerMock = await getMockEntityManager({
            saveReturn: mockUser,
            findOneReturn: mockUser
        })
        userRepository = new UserRepository(managerMock as EntityManager)
    })

    it('Deve cadastrar um novo usuário no banco de dados', async () => {
        const response = await userRepository.createUser(mockUser)
        expect(managerMock.save).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar um usuário pelo ID', async () => {
        const response = await userRepository.getUser('12345')
        expect(managerMock.findOne).toHaveBeenCalledWith(User, {
            where: { id_user: '12345' }
        })
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar null se o usuário não for encontrado', async () => {
        managerMock.findOne = jest.fn().mockResolvedValue(null)

        const response = await userRepository.getUser('id-inexistente')
        expect(response).toBeNull()
    })

    it('Deve retornar todos os usuários', async () => {
        const mockUsers = [mockUser, { ...mockUser, id_user: '67890', name: 'Other User'}]
        managerMock.find = jest.fn().mockResolvedValue(mockUsers)

        const response = await userRepository.getAllUsers()
        expect(managerMock.find).toHaveBeenCalledWith(User)
        expect(response).toMatchObject(mockUsers)
    })

    it('Deve chamar o método delete com o ID correto', async () => {
        const userId = '12345';

        await userRepository.deleteUser(userId);

        expect(managerMock.delete).toHaveBeenCalledWith(User, {
            id_user: mockUser.id_user
        });
    })
})