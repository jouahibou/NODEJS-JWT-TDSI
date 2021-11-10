const express = require('express')
const router = express.Router()

const middleware = require('../../middleware/middleware')

const admin = require('firebase-admin')
const db = admin.firestore()
const raspRef = db.collection('raspberry')

router.get("/", middleware, async (req, res) => {
    const rasp = await raspRef.get();
    const list = rasp.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});

router.post("/create", middleware, async (req, res) => {
    const data = req.body;
    await raspRef.add({ data });
    res.send({ msg: "Raspberry Added" });
});

router.post("/update", middleware, async (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    const data = req.body;
    await raspRef.doc(id).update(data);
    res.send({ msg: "Updated" });
});

router.post("/delete", middleware, async (req, res) => {
    const id = req.body.id;
    await raspRef.doc(id).delete();
    res.send({ msg: "Deleted" });
});

module.exports = router
