<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react';
// import { PayPalScriptProvider } from '@paypal/react-paypal-js';
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
    // // <React.StrictMode>
    // <PayPalScriptProvider
    //     options={{
    //         'client-id':
    //             'AXNV0N2119zvdBYXXI4xakjgb5gBzzDAkThygTJD3UynJGQEHu6mSznMRsUXoUT4VGfacWP54mmFSTa5',
    //         components: 'buttons',
    //         currency: 'USD',
    //     }}
    // >
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
    {
        /* // </React.StrictMode>, */
    },
    // </PayPalScriptProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======
import express from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const URI_DBS = process.env.URI_DBS;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

connect(URI_DBS);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  // console.log("Server is running is port : ", +port);
});
>>>>>>> f8bcc43 (backend)
