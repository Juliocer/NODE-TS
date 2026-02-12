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
        const user = { name, email }

        const found = this.db.find(u => u.name === user.name && u.email === user.email)

        if (!found) return null

        const index = this.db.findIndex(u => u.name === user.name && u.email === user.email)
        this.db.splice(index, 1)

        return found
    }
}