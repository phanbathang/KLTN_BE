import express from 'express';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const URI_DBS = process.env.URI_DBS;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

connect(URI_DBS);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log('Server is running is port : ', +port);
});
