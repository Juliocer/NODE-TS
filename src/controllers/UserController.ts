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
        const { name, email, password } = request.body

        if (!name) {
            return response.status(400).json({ message: 'Bad request! Name é obrigatório' })
        }

        if (!email) {
            return response.status(400).json({ message: 'Bad request! Email é obrigatório' })
        }
        
        if (!password) {
            return response.status(400).json({ message: 'Bad request! Senha é obrigatório' })
        }

        this.userService.createUser(name, email, password)
        return response.status(201).json({ message: 'Usuário criado' })

    }

    getUsers = async (request: Request, response: Response) => {
        const {id_user} = request.body

        if(!id_user){
            return response.status(400).json({ message: 'Bad request: ID é Obrigatório' })
        }

        try {
            const user = await this.userService.getUser(id_user)

            if (!user) {
                return response.status(404).json({ message: 'Usuário não encontrado' })
            }
            return response.status(200).json(user)
        } catch (error) {
            return response.status(500).json({ message: 'Erro ao buscar usuário' })
        }
    }

    getAllUsers = async (request: Request, response: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({ message: 'Erro ao buscar usuários' })
        }
    }

    deleteUser = async (request: Request, response: Response) => {
        const { id_user } = request.body

        if (!id_user) {
            return response.status(400).json({ message: 'Bad request: ID é Obrigatório' })
        }

        try {
            await this.userService.deleteUser(id_user);
            return response.status(200).json({ message: 'Usuário deletado' });
        } catch (error) {
            return response.status(500).json({ message: 'Erro ao deletar usuário' });
        }
    }
}