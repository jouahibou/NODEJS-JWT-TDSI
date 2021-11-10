const express = require('express')
const router = express.Router()

const middleware = require('../../middleware/middleware')

const admin = require('firebase-admin')
const db = admin.firestore()
const beaconRef = db.collection('beacons')

router.get("/", middleware, async (req, res) => {
    const beacon = await beaconRef.get();
    const list = beacon.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});

router.post("/create", middleware, async (req, res) => {
    const data = req.body;
    await beaconRef.add({ data });
    res.send({ msg: "Beacon Added" });
});

router.post("/update", middleware, async (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    const data = req.body;
    await beaconRef.doc(id).update(data);
    res.send({ msg: "Updated" });
});

router.post("/delete", middleware, async (req, res) => {
    const id = req.body.id;
    await beaconRef.doc(id).delete();
    res.send({ msg: "Deleted" });
});

module.exports = router
