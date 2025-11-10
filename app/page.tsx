'use client';
import Link from "next/link";
import Background from "./components/background/Background";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { auth, db } from "./utils/firebaseConfig";
import IndexContext from "./context/index_context";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const user = auth.currentUser;
  const { updateIndex } = useContext(IndexContext);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const getName = useCallback(async()=>{
    setLoading(true)
    const docLibrarians = doc(db, '/librarians', user.uid);
    const userName = await getDoc(docLibrarians);
    if(userName.exists()){
      setName(userName.data().name)
    }
   setLoading(false)
  }, [])

  useEffect(()=>{
    getName();
  },[]);
  
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Background />
      <div className=" border-2 border-blue-400 p-8 rounded-xl bg-zinc-900 bg-opacity-70">
        <h2 className="text-white text-lg font-normal">
        {
        loading && 'Carregando o nome...'
        }{
          name
        }
        </h2>
        <h1 className="text-xl font-bold text-blue-400 sm:text-2xl md:text-3xl xl:text-4xl">
          Bem-vindo a Biblioteca Escolar
        </h1>
        <p className="text-lg font-extrabold text-gray-400 mt-4">
          Gerencie livros, usuários e empréstimos com facilidade.
        </p>
        <div className="mt-8 space-x-4 font-bold flex gap-4 flex-col items-center justify-center  sm:flex-row sm:gap-1">
          <Link href="/books">
            <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-teal-600"
            onClick={(e)=>{
              //e.preventDefault();
              updateIndex(1)}}
            >
              Gerenciar Pedidos
            </button>
          </Link>
          <Link href="/adminpage">
            <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-teal-600"
            onClick={(e)=>{
              //e.preventDefault();
              updateIndex(2)}}
            >
              Acessar Administração
            </button>
          </Link>
          <Link href="/statistics">
            <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-teal-600"
            onClick={(e)=>{
              //e.preventDefault();
              updateIndex(3)}}
            >
              Ver Estatistica
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
