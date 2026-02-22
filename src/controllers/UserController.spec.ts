import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserService } from "../services/UserService";
import { UserController } from "./UserController";
import { Request } from "express";

const mockUserService = {
    createUser: jest.fn(),
    deleteUser: jest.fn()
}

jest.mock('../services/UserService.js', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService
        })
    }
})

describe('UserController - deleteUser', () => {
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

    it('Deve retornar erro caso o Usuario não preencher os campos', () => {
        const mockRequest = {
            body: {}
        } as Request

        const mockResponse = makeMockResponse();

        userController.createUser(mockRequest, mockResponse);
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Todos os campos são obrigatórios' })
    }) 

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
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request: ID é obrigatório' })
    })

})