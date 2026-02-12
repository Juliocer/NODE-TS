export interface User {
    name: string,
    email: string
}

const db = [
    {
        name: "Cesar",
        email: "Cesar@dio.com"
    }
]

export class UserService {
    db: User[]

    constructor(
        database = db
    ){
        this.db = database
    }

    creatUser = (name: string, email: string) => {
        const user = {
            name,
            email
        }
        
        this.db.push(user)
        console.log('DB atualizado', this.db)
    }

    getAllUsers = () => {
        return this.db
    }

    deleteUser = (name: string, email: string) => {
        const user = {
            name,
            email
        }

        const found = this.db.find(u => u.name === user.name && u.email === user.email)

        if (!found) return null

        this.db = this.db.filter(u => u.name !== user.name || u.email !== user.email)

        return found
    }
}