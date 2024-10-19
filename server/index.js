import express from 'express';
import {connection} from './config/db.js';

import Router from './routes/routes.js';

const app = express();

connection();

app.use(express.json());
app.use(Router);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
