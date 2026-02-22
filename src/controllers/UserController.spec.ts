import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserController } from "./UserController";
import { Request } from "express";

const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    deleteUser: jest.fn(),
    getAllUsers: jest.fn()
}

jest.mock('../services/UserService.js', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService
        })
    }
})

describe('UserController', () => {
    const userController = new UserController();

    it.each([
        { body: { name: 'Julio', email: 'julio@gmail.com', password: '123456' }, expectedStatus: 201, expectedMessage: 'Usuário criado' },
        { body: { email: 'julio@test.com', password: '123456' }, expectedStatus: 400, expectedMessage: 'Bad request! Name é obrigatório' },
        { body: { name: 'Julio', password: '123456' }, expectedStatus: 400, expectedMessage: 'Bad request! Email é obrigatório' },
        { body: { name: 'Julio', email: 'julio@gmail.com' }, expectedStatus: 400, expectedMessage: 'Bad request! Senha é obrigatório' },
    ])('Deve retornar status $expectedStatus ao criar usuário', ({ body, expectedStatus, expectedMessage }) => {
        const mockRequest = { body } as Request;

        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(expectedStatus)
        expect(mockResponse.state.json).toMatchObject({ message: expectedMessage })
    })

    describe('getUsers', () => {
        it('Deve retornar status 200 e o usuário encontrado', async () => {
            const mockUser = { id_user: '12345', name: 'Julio', email: 'julio@gmail.com', password: '123456' }
            
            mockUserService.getUser = jest.fn().mockReturnValue(mockUser)

            const mockRequest = { body: { id_user: '12345' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUsers(mockRequest, mockResponse)

            expect(mockUserService.getUser).toHaveBeenCalledWith('12345')
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toMatchObject(mockUser)
        })

        it ('Deve retornar status 400 quando o id_user não for informado', async () => {
            const mockRequest = { body: {} } as Request
            const mockResponse = makeMockResponse()

            await userController.getUsers(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(400)
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request: ID é Obrigatório' })
        })

        it ('Deve retornar status 404 quando o usuário não for encontrado', async () => {
            mockUserService.getUser = jest.fn().mockResolvedValue(null)

            const mockRequest = { body: { id_user: 'id-inexistente' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUsers(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(404)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
        })

        it ('Deve retornar status 500 quando ocorrer um erro', async () => {
            mockUserService.getUser = jest.fn().mockRejectedValue(new Error('Erro no banco'))

            const mockRequest = { body: { id_user: '12345' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUsers(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(500)
            expect(mockResponse.state.json).toMatchObject({ message: 'Erro ao buscar usuário' })
        })
    })

    describe('getAllUsers', () => {
        it('Deve retornar 200 e lista de usuários com sucesso', async () => {
            const mockUsers = [
                { id_user: '1', name: 'Julio', email: 'julio@gmail.com', password: '123456' },
                { id_user: '2', name: 'Maria', email: 'maria@gmail.com', password: '654321' }
            ]

            mockUserService.getAllUsers = jest.fn().mockResolvedValue(mockUsers)

            const mockRequest = {} as Request
            const mockResponse = makeMockResponse()

            await userController.getAllUsers(mockRequest, mockResponse)

            expect(mockUserService.getAllUsers).toHaveBeenCalled()
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toMatchObject(mockUsers)
        })

        it('Deve retornar status 500 quando ocorrer um erro', async () => {
            mockUserService.getAllUsers = jest.fn().mockRejectedValue(new Error('Erro no banco'))

            const mockRequest = {} as Request
            const mockResponse = makeMockResponse()

            await userController.getAllUsers(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(500)
            expect(mockResponse.state.json).toMatchObject({ message: 'Erro ao buscar usuários' })
        })
    })

    describe('deleteUser', () => {

        it('Deve retornar status 200 ao deletar usuário com sucesso', async () => {
            const mockRequest = {
                body: { id_user: '12345' }
            } as Request

            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado' });
            expect(mockUserService.deleteUser).toHaveBeenCalledWith('12345');
        });

        it('Deve retornar status 400 quando o id_user não for informado', async () => {
            const mockRequest = {
                body: {}
            } as Request

            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request: ID é Obrigatório' })
        })

        it('Deve retornar status 500 quando ocorrer um erro ao deletar', async () => {
            mockUserService.deleteUser = jest.fn().mockRejectedValue(new Error('Erro no banco'))

            const mockRequest = {
                body: { id_user: '12345' }
            } as Request

            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(500)
            expect(mockResponse.state.json).toMatchObject({ message: 'Erro ao deletar usuário' })
        })

    })

})