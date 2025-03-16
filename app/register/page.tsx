'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/firebaseConfig';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // const router = useRouter();

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const getDoc = doc(db, '/librarians', credential.user.uid);
      await setDoc(getDoc, {name: name})
      window.location.href = '/login'; // Redireciona para a página de login
     // router.push("/login")
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao registrar. Tente novamente.');
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
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registrar Funcionário</h2>
          <form onSubmit={handleRegister} className="space-y-4">
          <div>
              <input
                type="name"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;