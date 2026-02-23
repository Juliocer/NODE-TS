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

    describe ('createUser', () => {
        it.each([
            { body: { name: 'Julio', email: 'julio@gmail.com', password: '123456' }, expectedStatus: 201, expectedMessage: 'Usuário criado' },
            { body: { email: 'julio@test.com', password: '123456' }, expectedStatus: 400, expectedMessage: 'Bad request! Name é obrigatório' },
            { body: { name: 'Julio', password: '123456' }, expectedStatus: 400, expectedMessage: 'Bad request! Email é obrigatório' },
            { body: { name: 'Julio', email: 'julio@gmail.com' }, expectedStatus: 400, expectedMessage: 'Bad request! Senha é obrigatório' },
        ])('Deve retornar status $expectedStatus ao criar usuário', async ({ body, expectedStatus, expectedMessage }) => {
            const mockRequest = { body } as Request;
            const mockResponse = makeMockResponse()
    
            await userController.createUser(mockRequest, mockResponse)
            expect(mockResponse.state.status).toBe(expectedStatus)
            expect(mockResponse.state.json).toMatchObject({ message: expectedMessage })
        })

        it('Deve retornar status 409 quando o email já estiver cadastrado', async () => {
            mockUserService.createUser = jest.fn().mockRejectedValue(new Error('Email já cadastrado'))

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com', password: '123456'} } as Request
            const mockResponse = makeMockResponse()

            await userController.createUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(409)
            expect(mockResponse.state.json).toMatchObject({ message: 'Email já cadastrado' })
        })

        it('Deve retornar status 500 quando ocorrer um erro ao criar usuário', async () => {
            mockUserService.createUser = jest.fn().mockRejectedValue(new Error('Error inesperado'))

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com', password: '123456' } } as Request
            const mockResponse = makeMockResponse()

            await userController.createUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(500)
            expect(mockResponse.state.json).toMatchObject({ message: 'Erro ao criar usuário' })
        })

    })

    describe('getUser', () => {
        it('Deve retornar status 200 e o usuário encontrado', async () => {
            const mockUser = { id_user: '12345', name: 'Julio', email: 'julio@gmail.com', password: '123456' }
            
            mockUserService.getUser = jest.fn().mockReturnValue(mockUser)

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUser(mockRequest, mockResponse)

            expect(mockUserService.getUser).toHaveBeenCalledWith('Julio', 'julio@gmail.com')
            expect(mockResponse.state.status).toBe(200)
            expect(mockResponse.state.json).toMatchObject(mockUser)
        })

        it ('Deve retornar status 400 quando o name e email não forem informados', async () => {
            const mockRequest = { body: {} } as Request
            const mockResponse = makeMockResponse()

            await userController.getUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(400)
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request: Nome e Email são obrigatórios' })
        })

        it ('Deve retornar status 404 quando o usuário não for encontrado', async () => {
            mockUserService.getUser = jest.fn().mockResolvedValue(null)

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(404)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
        })

        it ('Deve retornar status 500 quando ocorrer um erro', async () => {
            mockUserService.getUser = jest.fn().mockRejectedValue(new Error('Erro no banco'))

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com' } } as Request
            const mockResponse = makeMockResponse()

            await userController.getUser(mockRequest, mockResponse)

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
            mockUserService.deleteUser = jest.fn().mockResolvedValue(undefined)

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com' } } as Request
            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockUserService.deleteUser).toHaveBeenCalledWith('Julio', 'julio@gmail.com');
            expect(mockResponse.state.status).toBe(200);
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado' });
        });

        it('Deve retornar status 400 quando o name e email não for informados', async () => {
            const mockRequest = { body: {} } as Request
            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse);

            expect(mockResponse.state.status).toBe(400);
            expect(mockResponse.state.json).toMatchObject({ message: 'Bad request: Name e Email são Obrigatórios' })
        })

        it('Deve retornar status 404 quando o usuário não for encontrado', async () => {
            mockUserService.deleteUser = jest.fn().mockRejectedValue(new Error('Usuário não encontrado'))

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com', password: '123456' } } as Request
            const mockResponse = makeMockResponse()

            await userController.deleteUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(404)
            expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
        })

        it('Deve retornar status 500 quando ocorrer um erro ao deletar', async () => {
            mockUserService.deleteUser = jest.fn().mockRejectedValue(new Error('Erro no banco'))

            const mockRequest = { body: { name: 'Julio', email: 'julio@gmail.com' } } as Request
            const mockResponse = makeMockResponse();

            await userController.deleteUser(mockRequest, mockResponse)

            expect(mockResponse.state.status).toBe(500)
            expect(mockResponse.state.json).toMatchObject({ message: 'Erro ao deletar usuário' })
        })

    })

})