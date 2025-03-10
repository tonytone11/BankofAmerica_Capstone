import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';//initializes dotenv file

dotenv.config();
import path from 'path'
import { fileURLToPath } from 'url';

//initializing express
const app = express()
//enabling cors to handle cross origin request
app.use(cors())




//creating connection between db and codebase 
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME

})

connection.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log('mysql connected')
    }
});

//using express to create a route for my product information
app.get('/', (req,res)=>{
    return res.json('from backend side')
})
//creating a route for products and 
app.get('/products', (req,res)=>{
    const sql = 'SELECT * FROM products'
    db.query(sql, (err,data)=>{
        if(err) return res.json(err);
        return res.json(data)
    })
})
app.listen(5005, ()=>{
    console.log('server is running on port ')
})