import express from 'express';
import type { Request, Response } from 'express';
import { router } from './routes.js';

const server = express();

server.use(express.json())
server.use(router)

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'DioBank API' })
})

server.listen(5000, () => console.log('Server on'))
