//.env
require("dotenv").config();
//initialize the api
const express = require("express")
const app = express()
//initialize firebase-admin
const admin = require("firebase-admin")
const credentials = require("./marmite-se-alimentacao-firebase-adminsdk-6v3p6-3c7629771c.json")
//Port
const PORT = process.env.PORT;

admin.initializeApp({credential: admin.credential.cert(credentials)})

//config json and form data response
app.use(express.json())
app.use (express.urlencoded({extended: true}))

//initialize app
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

