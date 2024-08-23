import { Router } from "express";
import db from '../db';
import { incrementId } from "../utils"

const router = Router();

async function getLastTeacherId() {
    const result = await new Promise((resolve, reject) => {
        db.query(
            'SELECT teacherId FROM teacher ORDER BY teacherId DESC LIMIT 1',
            (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            }
        )
    });

    const data = JSON.parse(JSON.stringify(result));
    return data.length === 0 ? 'T0000' : data[0].teacherId;
}

router.get('/teacher', (req, res) => {
    db.query(
        'SELECT * FROM teacher',
        (err, result) => {
            res.json(result);
        }
    )
})


router.get('/teacher/:id', (req, res) => {
    const teacherId = req.params.id;

    db.query(
        'SELECT * FROM teacher WHERE teacherId=?', 
        [teacherId], 
        (err, result) => {
            res.json(result);
        }
    )
})

router.post('/teacher', async (req, res) => {
    const { fullName, lastName } = req.body;
    const teacherId = incrementId(await getLastTeacherId());

    db.query(
        `INSERT INTO teacher(teacherId, fullName, lastName) VALUES (?, ?, ?)`,
        [teacherId, fullName, lastName],
        (err, result) => {
            if (err) 
                res.json({ success: false, error: err });
            res.json({ success: true, result: result });
        }
    )
})

router.delete('/teacher', (req, res) => {
    db.query(
        `DELETE FROM teacher WHERE teacherId=?`,
        [req.body.teacherId],
        (err, result) => {
            if (err)
                res.json({ success: false, error: err })
            res.json({ success: true, result: result });
        }
    )
})

router.put('/teacher', (req, res) => {
    const { teacherId, fullName, lastName } = req.body;
    db.query(
        `UPDATE INTO teacher SET fullName=?, lastName=? WHERE teacherId=?`,
        [fullName, lastName, teacherId],
        (err, result) => {
            if (err)
                res.json({ success: false, error: err })
            res.json({ success: true, result: result });
        }
    )
})

export default router;