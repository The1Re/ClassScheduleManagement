import { Router } from "express";
import db from '../db';
import { incrementId } from "../utils"

const router = Router();

async function getLastStudentId() {
    const result = await new Promise((resolve, reject) => {
        db.query(
            'SELECT studentId FROM student ORDER BY studentId DESC LIMIT 1',
            (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            }
        )
    });

    const data = JSON.parse(JSON.stringify(result));
    return data.length === 0 ? 'S0000' : data[0].studentId;
}

router.get('/student', (req, res) => {
    db.query(
        'SELECT * FROM student',
        (err, result) => {
            res.json(result);
        }
    )
})


router.get('/student/:id', (req, res) => {
    const studentId = req.params.id;

    db.query(
        'SELECT * FROM student WHERE studentId=?', 
        [studentId], 
        (err, result) => {
            res.json(result);
        }
    )
})

router.post('/student', async (req, res) => {
    const { fullName, lastName } = req.body;
    const studentId = incrementId(await getLastStudentId());

    db.query(
        `INSERT INTO student(studentId, fullName, lastName) VALUES (?, ?, ?)`,
        [studentId, fullName, lastName],
        (err, result) => {
            if (err) 
                res.json({ success: false, error: err });
            res.json({ success: true, result: result });
        }
    )
})

router.delete('/student', (req, res) => {
    db.query(
        `DELETE FROM student WHERE studentId=?`,
        [req.body.studentId],
        (err, result) => {
            if (err)
                res.json({ success: false, error: err })
            res.json({ success: true, result: result });
        }
    )
})

router.put('/student', (req, res) => {
    const { studentId, fullName, lastName } = req.body;
    db.query(
        `UPDATE INTO student SET fullName=?, lastName=? WHERE studentId=?`,
        [fullName, lastName, studentId],
        (err, result) => {
            if (err)
                res.json({ success: false, error: err })
            res.json({ success: true, result: result });
        }
    )
})

export default router;