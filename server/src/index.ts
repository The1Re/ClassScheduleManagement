import express from "express";
import cors from "cors";
import {
    teacherRoutes,
    studentRoutes
} from "./routes"

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api', teacherRoutes);
app.use('/api', studentRoutes);

app.get("/", (req, res) => {
    res.json({ status: 'Server on...' })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});