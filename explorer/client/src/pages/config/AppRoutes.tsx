import { Navigate, Route, Routes } from 'react-router-dom';

import Home from '../home/Home';
import ObjectResult from '../object-result/ObjectResult';
import TransactionResult from '../transaction-result/TransactionResult';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/objects/:id" element={<ObjectResult />} />
            <Route path="/transactions/:id" element={<TransactionResult />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    );
};

export default AppRoutes;
