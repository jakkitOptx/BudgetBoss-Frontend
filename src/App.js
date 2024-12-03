import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
