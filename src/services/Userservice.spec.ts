import { UserService, type User } from "./UserService.js";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);
    
    it('Deve adicionar um novo Usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.creatUser('julio', 'julio@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })
})