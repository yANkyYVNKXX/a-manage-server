const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/userModel')

const loginController = async (req, res) => {
	try {
		const candidate = req.body
		const userFromDB = await Users.findOne({email: candidate.email})
		if (userFromDB) {
			const isMatch = await bcrypt.compare(candidate.password, userFromDB.password)
			if (isMatch) {
				const token = jwt.sign(candidate, 'MyKey')
				res.status(200).json({responseCode: 1, token})
				return
			}
			res.status(200).json({responseCode: 0, message: 'Неправильный логин или пароль'})
			return
		}
		res.status(200).json({responseCode: 0, message: 'Неправильный логин или пароль'})
		return
	} catch (e) {
		res.status(400).json(e)
		return
	}
}

const singUpController = async (req, res) => {
	try {
		const candidate = req.body
		const userFromDB = await Users.findOne({email: candidate.email})
		if (!userFromDB) {
			const hashpassword = await bcrypt.hash(candidate.password, 10)
			candidate.password = hashpassword
			const user = new Users(candidate)
			await user.save()
			res.status(201).json({responseCode: 1, message: 'User created'})
			return
		}
		res.status(200).json({responseCode: 0, message: 'This user already exists'})
		return
	} catch (e) {
		res.status(400).json(e)
		return
	}
}

const authController = async (req, res) => {
	try {
		const token = req.body.token
		if (token) {
			const candidate = await jwt.decode(token)
			const userFromDB = await Users.findOne({email: candidate.email})
			if (userFromDB) {
				const isMatch = await bcrypt.compare(candidate.password, userFromDB.password)
				if (isMatch) {
					const dataForClient = {
						email: userFromDB.email
					}
					res.status(200).json(dataForClient)
					return
				}
			}
		}
		throw ({responseCode: 0, message: 'Вы не авторизованы'})
	} catch (e) {
		res.status(400).json(e)
		return
	}
}

module.exports = {loginController, singUpController, authController}