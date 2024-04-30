const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/database_config")
require('dotenv').config();


router.post("/register", async (req, res) => {
    const { username, password, first_name, last_name, email } = req.body;
    bcrypt.hash(req.body.password, 10, async(err, hashed_password) => {
        if(err) res.json({success: false, error: err}).status(500)
        try {
            await pool.query('insert into users (first_name, last_name, email, username, password) values($1,$2,$3,$4,$5)',
            [req.body.first_name, req.body.last_name,req.body.email ,req.body.username, hashed_password])
            res.json({success: true}).status(200)
        } catch (error) {
            res.json({success: false, error: error}).status(500)
        }
    })
})

router.post("/login", async (req, res) => {
    const { email, password} = req.body;
    const data = ( await pool.query('select * from users where email = $1', [email])).rows;
    if(data[0]){
        bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) res.json({success: false, error: err}).status(500)
            if (result) {
                res.json({success: true, status:"User successfully logged in", username:data[0].username})
                
            }
            else {
                res.json({status:"You entered the wrong password", success: false})
            }
        })
    }else{
        res.json({status:"You entered the wrong email", success: false})
    }
})





module.exports = router