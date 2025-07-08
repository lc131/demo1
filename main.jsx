import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App'; // vì bây giờ export default là AppWrapper
import './index.css';
import './Login.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppWrapper />
    </React.StrictMode>
);
