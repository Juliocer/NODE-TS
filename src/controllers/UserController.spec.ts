import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserService } from "../services/UserService";
import { UserController } from "./UserController";
import { Request } from "express";


describe('UserController', () => {
    const mockUserService: Partial<UserService> = {
        creatUser: jest.fn(),
        deleteUser: jest.fn(),
        getAllUsers: jest.fn().mockReturnValue([])
    }

    const userController = new UserController(mockUserService as UserService);

    it.each([
        { body: { name: 'Julio', email: 'julio@gmail.com' }, expectedStatus: 201, expectedMessage: 'Usuário criado' },
        { body: { email: 'julio@test.com' }, expectedStatus: 400, expectedMessage: 'Bad request! Name é obrigatório' },
        { body: { name: 'Julio' }, expectedStatus: 400, expectedMessage: 'Bad request! Email é obrigatório' },
    ])('Deve retornar status $expectedStatus ao criar usuário', ({ body, expectedStatus, expectedMessage }) => {
        const mockRequest = { body } as Request;

        const mockResponse = makeMockResponse() 
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(expectedStatus)
        expect(mockResponse.state.json).toMatchObject({message: expectedMessage})
    })

    it('Deve deletar um usuário', () => {
        const mockRequest = {
            body:{
                name: 'Julio',
                email: 'julio@test.com'
            }
        } as Request;

        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({message: 'Usuário deletado'})
    })

})