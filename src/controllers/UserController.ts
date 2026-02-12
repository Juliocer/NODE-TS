import { response, type Request, type Response } from 'express';
import { UserService } from '../services/UserService.js';

export class UserController {
    userService: UserService

    constructor(
        userService = new UserService()
    ) {
        this.userService = userService
    }

    createUser = (request: Request, response: Response) => {
        const { name, email } = request.body

        if (!name) {
            return response.status(400).json({ message: 'Bad request: name invalid' })
        }

        if (!email) {
            return response.status(400).json({ message: 'Bad request! Email é obrigatório' })
        }

        this.userService.creatUser(name, email)
        return response.status(201).json({ message: 'Usuário criado' })

    }

    getAllUsers = (request: Request, response: Response) => {
        const users = this.userService.getAllUsers()
        return response.status(200).json(users)
    }

    deleteUser = (request: Request, response: Response) => {
        const user = request.body

        if (!user.name && !user.email) {
            return response.status(400).json({ message: 'Bad request: name invalid' })
        } else {
            this.userService.deleteUser(user.name, user.email)
            return response.status(200).json({ message: 'Usuário deletado' })
        }
    }
}