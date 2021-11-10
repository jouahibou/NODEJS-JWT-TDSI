const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const generatePassword = require('password-generator')

const admin = require('firebase-admin')
const db = admin.firestore()

router.get('/', (req, res)=>{
    res.send('register page')
})

router.post(
    '/', 
    [
    check('name', 'Name is required').not().isEmpty(),
    check('email','Email is not the correct format').isEmail(),
    check('password', 'Password must be more than 5 characters').isLength({min: 5})
    ], 

    async (req, res) => {
        const errors = validationResult(req)
    
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body

    try {

        const userRef = db.collection('users')
        
        let user = await userRef.where('email', '==', email).get()

        console.log(user)

        if(!user.empty) {
            return res.status(400).json({errors: 'This email has already been used.'})
        }

        const id = generatePassword(6, false)

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        await db.collection('users').doc(id).set({
            id,
            name,
            email,
            password: hashedPassword
        })

        const payload = {
            user: {
                id,
                name
            }
        }

        jwt.sign(
            payload,
            config.get('jwtpass'),
            {expiresIn: 40000},
            (err, token) => {
                if (err) throw err
                res.json({token})
            }

        )

    } catch (error) {
        res.status(500).send('Server error')
    }
})

module.exports = router 