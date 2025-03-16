
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401); //unauthorized message 

    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err){ 
            return res.sendStatus(403); //forbidden
            req.user = user; // add user data to request object
            next();
        }
    });
};

// // ** Route to Log Training Hours (Store MM-DD-YY Format) **
//route to log training hours 

app.post(('/profile/practice-log'), async (req,res)=>{let connection ; //declaring variable connection
    try{
        const {user_id, date, hours} = req.body;
    // using pool.getConnection to query database
        connection = await pool.getConnection();
    
        // check if entry already exists for that d\ate. will update.
    
        const [existingEntry] = connection.query(
            'SELECT FROM hoursLogged WHERE user_id = ? AND date = ?',
            [user_id, date]
        );
        // updating existing entry
        if(existingEntry.length>0){
            await connection.query('UPDATE hoursLogged SET hours = ? WHERE user_id =? and date = ?'),
            [user_id, hours, date]
        } else{
            // insert new entry 
            await connection.query(' INSERT INTO hoursLogged(user_id, date, hours) VALUES(?,?,?)',
            [user_id, date, hours]);
        }
        res.status(200).json({message:'Hours logged successfully'})
    } catch(error){
console.error(error);
res.status(500).json({error: 'internal server error'})
    } finally{
        if(connection) connection.release();
    }
});


// route to fetch user specific hours
app.get('/profile/practice-log',  verifyToken, async (req,res)=>{
let connection ;
try{
    const userId = req.user.user_id; //extracts userid from token

    // using pool.getConnection to query database 
    connection = await pool.getConnection();
    // creating varaiable hoursData so that i can save results from connection query
    const [hoursData] = await connection.query('SELECT date, hours FROM hoursLogged Where user_id = ?', [user_id]);
    const formattedData = {}; //saving data as object
    hoursData.forEach(row =>{
        formattedData[row.date] = row.hours;
    }); //displaying data on calender using foreach 
    res.status(200).json(formattedData);;

}catch(error){
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
} finally{
    if(connection) connection.release ;
}
});
