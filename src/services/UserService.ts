const db = [
    {
        name: "Julio",
        email: "julio@dio.com"
    }
]

export class UserService {
    creatUser = (name: string, email: string) => {
        const user = {
            name,
            email
        }
        
        db.push(user)
        console.log('DB atualizado', db)
    }

    getAllUsers = () => {
        return db
    }
}