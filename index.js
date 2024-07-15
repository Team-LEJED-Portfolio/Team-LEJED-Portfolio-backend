import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {educationRouter} from "./routes/education_route.js";
import { userRouter } from "./routes/user_route.js";
import { skillRouter } from "./routes/skills_route.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { userProfileRouter } from "./routes/userProfile_route.js";



const app = express();

// Apply middlewares
app.use(express.json());
app.use(cors());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    // cookie: { secure: true}
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}));


// Use routes
app.use('/api/v1', userRouter);
app.use('/api/v1', skillRouter);
app.use('/api/v1', userProfileRouter);
app.use('/api/v1', educationRouter)
app.use((req, res) => res.redirect('/api-docs/'));



// Listen for incoming requests
const port = process.env.PORT || 4800;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


// Connect to database
await mongoose.connect(process.env.MONGO_URL);
console.log('Database is connected');