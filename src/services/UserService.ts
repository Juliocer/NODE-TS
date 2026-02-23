import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository"

export class UserService {
    private userRepository: UserRepository;

    constructor (
        userRepository = new UserRepository(AppDataSource.manager),
    ){
        this.userRepository = userRepository;
    }

    createUser = async (name: string, email: string, password: string): Promise<User> => {
        const existingUser = await this.userRepository.getUserByEmail(email)

        if (existingUser) {
            throw new Error('Email já cadastrado')
        }

       const user = new User(name, email, password)
       return this.userRepository.createUser(user)
    }

    getUser = async (name: string, email: string): Promise<User | null> => {
        return this.userRepository.getUser(name, email)
    }

    getAllUsers = async (): Promise<User[]> => {
        return this.userRepository.getAllUsers();
    }

    deleteUser = async (name: string, email: string): Promise<void> => {
        const user = await this.userRepository.getUser(name, email)
        if(!user) {
            throw new Error('Usuário não encontrado')
        }
        return this.userRepository.deleteUser(user.id_user)
    }
}