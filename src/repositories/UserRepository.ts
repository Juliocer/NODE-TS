import { EntityManager } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
    private manager: EntityManager

    constructor(
        manager: EntityManager
    ){
        this.manager = manager;
    }

    createUser = async (user: User): Promise<User> => {
        return this.manager.save(user)
    }

    getUserByEmail = async (email: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: {
                email
            }
        })
    }

    getUser = async (name: string, email: string): Promise<User | null> => {
        return this.manager.findOne(User, {
            where: {
                name,
                email
            }
        })
    }

    getAllUsers = async (): Promise<User[]> => {
        return this.manager.find(User);
    }
    
    deleteUser = async (userId: string): Promise<void> => {
        await this.manager.delete(User, { id_user: userId })
    }
}