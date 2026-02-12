import { UserService, type User } from "./UserService.js";

describe('UserService', () => {
    let mockDb: User[]
    let userService: UserService

    beforeEach(() => {
        mockDb = []
        userService = new UserService(mockDb)
    })
    
    it('Deve adicionar um novo Usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.creatUser('julio', 'julio@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })

    it('Deve deletar um usuário existente', () => {
        userService.creatUser('julio', 'julio@test.com')
        const deleted = userService.deleteUser('julio', 'julio@test.com')
        expect(deleted).toMatchObject({ name: 'julio', email: 'julio@test.com' })
        expect(mockDb).toHaveLength(0)
    })

    it('Deve retornar null ao deletar usuário inexistente', () => {
        const deleted = userService.deleteUser('inexistente', 'inexistente@test.com')
        expect(deleted).toBeNull()
    })
})