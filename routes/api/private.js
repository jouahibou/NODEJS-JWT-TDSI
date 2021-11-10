const express = require('express')
const router = express.Router()

const middleware = require('../../middleware/middleware')

const admin = require('firebase-admin')
const db = admin.firestore()
const userRef = db.collection('users')

router.get('/', middleware, async (req, res) => {

        try {

            const user = await userRef.where('id', '==', req.user.id).get()

            var result

            user.forEach(doc => result = doc.data())

            res.json({name: result.name, email: result.email})

        } catch (error) {
            res.status(500).send('Server error')
        }
    }
)

module.exports = router
