import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import instructorRouter from "./routes/instructorRoutes.js";
import cors from 'cors';
import learnerRouter from './routes/learnerRoutes.js';
import courseRouter from "./routes/courseRoutes.js";
import path from 'path';

dotenv.config();
const app= express();

mongoose.connect(process.env.CONN_URL)
    .then(() => console.log('connected to DB'))
    .catch((err) => console.log('err.msg'));

app.use(cors());
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

// https://learnershub.herokuapp.com/api/instructor/
app.use("/api/instructor",instructorRouter);

// https://learnershub.herokuapp.com/api/learner/
app.use('/api/learner', learnerRouter);

// https://learnershub.herokuapp.com/api/course/
app.use('/api/course', courseRouter);


// Invalid-Path handler Middleware
app.use((req, res, next) => {
    res.send({message: `path ${req.url} is INVALID`});
})

// Error-Handling Middleware
app.use((err, req, res, next) => {
    res.send({message: 'Error Occurred', reason: `${err.message}`});
})


// .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))

const __dirname = path.resolve();
//Serve Static assets if in production
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const PORT  = process.env.PORT||5003;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));