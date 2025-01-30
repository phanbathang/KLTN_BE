import UserRouter from './UserRouter.js';
import ProductRouter from './ProductRouter.js';
import OrderRouter from './OrderRouter.js';
import BorrowRouter from './BorrowRouter.js';
import PaymentRouter from './PaymentRouter.js';
import RuleRouter from './RuleRouter.js';

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/borrow', BorrowRouter);
    app.use('/api/payment', PaymentRouter);
    app.use('/api/rule', RuleRouter);
};

export default routes;
