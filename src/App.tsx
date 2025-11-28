import './App.css'
import 'aos/dist/aos.css';
import "@/config/i18n";
import Aos from 'aos';
import { useLoading } from './hooks/useLoading';
import { useEffect } from 'react';
import Loading from './packages/Loading';
import { LanguageProvider } from './content/LanguageContext';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { router } from './routes';

function App() {
  const loading = useLoading();
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <LanguageProvider>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-left" autoClose={5000} />
      </LanguageProvider>
    </>
  )
}

export default App
