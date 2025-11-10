"use client";
import './globals.css';
import Navbar from './components/Navbar';
import React, {useEffect, useState } from 'react';
import LoginPage from './login/page';
import { auth } from '../app/utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { IndexProvider } from './context/index_context';

export default function RootLayout({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Verifica se o usuário está logado ao carregar a página
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false); // Define o carregamento como falso após a verificação
    });

    // Limpa o listener quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    // Você pode armazenar o estado de login no localStorage
    localStorage.setItem('isLoggedIn', status.toString());
  };

  return (
    <IndexProvider>
      <html lang="pt-br" suppressHydrationWarning>

        <body className="bg-gray-100 flex flex-col h-screen overflow-hidden">
          {isLoggedIn && (<Navbar />)}
          {loading ? ( // Verifica se está carregando
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
              </div>
            </div>
          ) : isLoggedIn ? (
            <div className='max-w-screen-xl mx-auto w-full h-full'>
    {
            // Se o usuário estiver logado, exibe os filhos
      children
    } 
            </div>

          ) : (
             <LoginPage></LoginPage>  

          )}
        </body>
      </html>
    </IndexProvider>
  );
}