import dotenv from "dotenv"
import express from "express"
import pg from "pg"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path  from "path";
import bcrypt from "bcrypt"

const currentFileUrl = import.meta.url;
const __dirname = dirname(fileURLToPath(currentFileUrl));

const app = express()
const port = 5020


dotenv.config()

const pool = new pg.Pool({

    user: 'postgres',
    host: 'localhost',
    database: 'anrental',
    password: process.env.PG_PASS,
    port: 5432


})

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.get('/user', (req,res,next)=>{
    res.sendFile(path.join(__dirname, 'public', 'user', 'user.html'))
})
app.get('/aaron', (req,res,next)=>{
    console.log(req.body)
    res.sendFile(path.join(__dirname, 'public', 'user', 'aaron.html'))
})
app.get('/sam', (req,res,next)=>{
    res.sendFile(path.join(__dirname, 'public', 'user', 'sam.html'))
})



app.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
})

app.post('/login', async (req,res, next)=>{
    const {username, password} = req.body
    console.log(username)
    try{
        const client = await pool.connect();
        const result = await client.query('SELECT username, password FROM users WHERE username = $1', [username])
        if (result.rows.length === 1){
            const hashedPass = result.rows[0].password

            bcrypt.compare(password, hashedPass, (err, match)=>{
                if (err){
                    next(err)
                }else if(match){
                    console.log("Authentication Successful")
                    if (username === "Aaron"){
                        res.redirect('/aaron')
                    }else if (username === "Sam"){
                        res.redirect('/sam')
                    }else{
                        res.redirect('/user')
                    }
                    
                }else{
                    console.log("Authentication Failed")
                    res.status(401).json({error: 'Authentication Failed'})
                }
            })
        }else{
            res.status(404).json({error: 'User not found'})
        }
        client.release()
    }catch (err){
        next(err)
    }

})


app.get('/register', (req,res,next)=>{
    res.sendFile(path.join(__dirname, 'public', 'register', 'register.html'))
})
app.post('/register', async (req, res, next)=>{
    const {username, password} = req.body
    try{
        const client = await pool.connect();
        const userCheck = await client.query('SELECT username FROM users WHERE username = $1', [username])
        
        if (userCheck.rows.length > 0){
            res.status(400).json({error: "Username Already Taken"}) 
        }else{
            const salt = bcrypt.genSaltSync(10);
            const hashedPass = bcrypt.hashSync(password,salt)
            const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING ID', [username, hashedPass])
            const newID = result.rows[0].id
            res.json({message: 'Entry added successfully', id: newID})
            
        }
        client.release()
    }
    catch (err){
        next(err)
    }

})


app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).json({error: "Internal Error"})
})

app.listen(port, ()=>{
    console.log("Server Listening on Port", port)
})
