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
}