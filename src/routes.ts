import { Router, Request, Response } from 'express'
import { UserController } from './controllers/UserController.js'

export const router = Router()

const userController = new UserController()

router.post('/user', (req, res) => userController.createUser(req, res))
router.get('/user', userController.getUsers)
router.delete('/user', (req, res) => userController.deleteUser(req, res))