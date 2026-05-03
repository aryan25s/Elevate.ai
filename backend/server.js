import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import { requireAuth } from './middleware/auth.js';
import queryRouter from './routes/query.js';
import conversationsRouter from './routes/conversations.js';
import filesRouter from './routes/files.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ message: 'Elevate API running' }));

// All routes below require a valid Supabase JWT
app.use('/query',         requireAuth, queryRouter);
app.use('/conversations', requireAuth, conversationsRouter);
app.use('/files',         requireAuth, filesRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));