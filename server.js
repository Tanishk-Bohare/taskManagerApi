const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors')

dotenv.config({ path: './config/config.env' })

const users = require('./src/routes/users');
const tasks = require('./src/routes/tasks');

connectDB()

const app= express()

app.use(cors())

app.use(express.json())

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/users', users)
app.use('/api/v1/tasks', tasks)

if(process.env.NODE_ENV==='production'){
    // app.use(express.static('client/build'))
    
    // app.get('*', (req, res) => {
    //     console.log('IT WORKS!!')
    //     //res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    // })
}

const PORT= process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bold.bgGrey))

