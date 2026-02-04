import express from 'express';
import type { Request, Response } from 'express';
import { request } from 'node:http';

const server = express();

server.use(express.json())

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'DioBank API' })
})

server.post('/user', (request: Request, response: Response) => {
    const body = request.body
    console.log(body)
    return response.status(201).json({ message: 'User criado' })
})

server.listen(5000, () => console.log('Server on update'))
