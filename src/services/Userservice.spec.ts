import { describe } from "node:test";
import { UserService } from "./UserService.js";

describe('UserService', () => {
    const userService = new UserService();
    
    it('Deve adicionar um novo Usuário', () => {
        userService.creatUser()
    })
})