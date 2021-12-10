const express = require('express')
const config = require('./config')
const authRouter = require('./routes/authRouter')
const messagesRouter = require('./routes/messagesRouter')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors({origin:'*'}))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/messages', messagesRouter)

const start = async ()=>{
	await mongoose.connect(
		"mongodb+srv://admin:1234@cluster0.pjgwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	app.listen(config.PORT,()=>console.log(config.PORT))
}

start()
