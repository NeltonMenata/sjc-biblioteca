'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function LoginPage () {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Inicializa o router

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      //onLogin(true);  // Chama a função de login com sucesso
     // window.location.href = '/'; 
      router.push("/");
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case 'auth/wrong-password':
          setError('Senha incorreta. Tente novamente.');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado. Verifique seu e-mail.');
          break;
        case 'auth/invalid-email':
          setError('E-mail inválido.');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Container para a imagem e o formulário */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        {/* Imagem à esquerda */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Image 
            src="/sign.png" // Caminho da imagem na pasta public
            alt="Descrição da imagem"
            objectFit="cover" // Cobre a área da div
            width={350} // Largura da imagem em pixels
            height={350} // Altura da imagem em pixels
          />
        </div>

        {/* Formulário à direita */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login do Funcionário</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={loading} // Desabilita o botão enquanto está carregando
                  className={`w-full py-3 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300`}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-blue-600 hover:underline"
                onClick={(e)=>{
                  e.preventDefault();
                  router.push('/register')
                  //window.location.href="/Register"
                }}
                >
                  Registre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
