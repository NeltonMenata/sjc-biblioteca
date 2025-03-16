"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import React from "react";
import Image from "next/image";
import {
  IconAddressBook,
  IconBook2,
} from "@tabler/icons-react";

function AddBooks() {
  
  const [index, setIndex] = useState(0);
  const [inputTitle, setInputTitle] = useState("");
  const [inputSubtitle, setInputSubTitle] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  const [inputEdition, setInputEdition] = useState(1);
  const [inputPublisher, setInputPublisher] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputId, setInputId] = useState("");
  const [inputContact, setInputContact] = useState("");
  const [status, setStatus] = useState("");
  const [statusReader, setStatusReader] = useState("");

  const changeIndex = (n: number) => {
    setIndex(n);
  };

  const clearBooks = () => {
    setInputTitle("");
    setInputSubTitle("");
    setInputAuthor("");
    setInputPublisher("");
    setInputEdition(1);
    setInputYear(new Date().getFullYear());
  };

  const clearReaders = () => {
    setInputName("");
    setInputContact("");
    setInputId("");
  };

  const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  const saveReader = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputName || !inputId || !inputContact) {
      return;
    }

    try {
      setStatusReader("Salvando Leitor...");
      const refAddDoc = doc(db, "/readers", inputId);
      await setDoc(refAddDoc, {
        name: inputName.toLowerCase(),
        contact: inputContact,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setStatusReader("Leitor salvo com sucesso");
      await delay(1000);
    } catch (error) {
      setStatusReader("Erro ao salvar leitor");
    } finally {
      clearReaders();
      setStatusReader("");
    }
  };

  const saveBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputTitle) {
      return;
    }

    try {
      setStatus("Salvando o livro...");
      const refAddDoc = collection(db, "/books");
      await addDoc(refAddDoc, {
        title: inputTitle.toLowerCase(),
        subtitle: inputSubtitle.toLowerCase(),
        author: inputAuthor.toLowerCase(),
        publisher: inputPublisher.toLowerCase(),
        year: inputYear,
        edition: inputEdition,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setStatus("Livro salvo com sucesso");
      await delay(2000);
    } catch (error) {
      setStatus("Falha ao salvar o livro");
      setTimeout(() => {
        setStatus("");
      }, 1000);
    } finally {
      clearBooks();
      setStatus("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start mt-2 w-full h-full">
      <div className="flex gap-4 border-2 p-2 rounded-md justify-center items-center text-xl font-bold">
        <h2
          onClick={() => changeIndex(0)}
          className={`cursor-pointer ${index === 0 ? "bg-teal-600 p-2 rounded-md text-white" : ""}`}
        >
          Adicionar Livro
        </h2>
        |
        <h2
          onClick={() => changeIndex(1)}
          className={`cursor-pointer ${index === 1 ? "bg-teal-600 p-2 rounded-md text-white" : ""}`}
        >
          Adicionar Leitor
        </h2>
      </div>
      <br />
      {index === 0 ? (
        <div className="rounded-xl bg-zinc-200 grid grid-cols-2 w-4/5 pl-10 gap-5 overflow-clip">
          <div className="mb-5">
            <div className="flex flex-row items-center">
              <IconBook2 stroke={2} />
              <h1 className="py-4 font-black text-2xl">Descrição do Livro</h1>
            </div>
            <form className="flex flex-col gap-3 mb-4" onSubmit={saveBook}>
              <span className="font-semibold">Titulo</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="titulo"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
              />
              <span className="font-semibold">Subtitulo</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="subtitulo"
                value={inputSubtitle}
                onChange={(e) => setInputSubTitle(e.target.value)}
              />
              <span className="font-semibold">Autor</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="autor"
                value={inputAuthor}
                onChange={(e) => setInputAuthor(e.target.value)}
              />
              <span className="font-semibold">Editora</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="editora"
                value={inputPublisher}
                onChange={(e) => setInputPublisher(e.target.value)}
              />
              <span className="font-semibold">Ano de lançamento</span>
              <input
                className="px-4 py-2 rounded-md"
                type="number"
                placeholder="ano de publicação"
                value={inputYear}
                onChange={(e) => setInputYear(+e.target.value)}
              />
              <span className="font-semibold">Numero de edição</span>
              <input
                className="px-4 py-2 rounded-md"
                type="number"
                placeholder="numero de edição"
                value={inputEdition}
                onChange={(e) => setInputEdition(+e.target.value)}
              />
              <button
                className="bg-teal-600 px-4 py-2 rounded-md text-white font-bold text-lg"
                type="submit"
              >
                Salvar
              </button>
            </form>
            <span className="font-extrabold">{status}</span>
          </div>
          <div className="bg-zinc-700 flex-grow flex-1 flex">
            <Image
              className="object-fill"
              priority
              width={1024}
              height={600}
              src={"/book-background.webp"}
              alt="Background livros"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-200 grid grid-cols-2 w-4/5 pl-10 gap-5 overflow-clip">
          <div className="mb-5">
            <div className="flex flex-row items-center">
              <IconAddressBook stroke={2} />
              <h1 className="py-4 font-black text-2xl">Descrição do Leitor</h1>
            </div>
            <form className="flex flex-col gap-4 mb-4" onSubmit={saveReader}>
              <span className="font-semibold">Nome</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="nome"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
              <span className="font-semibold">Identificação</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="identificação"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
              />
              <span className="font-semibold">Contacto</span>
              <input
                className="px-4 py-2 rounded-md"
                type="text"
                placeholder="contacto"
                value={inputContact}
                onChange={(e) => setInputContact(e.target.value)}
              />
              <button
                className="bg-teal-600 px-4 py-2 rounded-md text-white font-bold text-lg"
                type="submit"
              >
                Salvar
              </button>
            </form>
            <span className="font-extrabold">{statusReader}</span>
          </div>
          <div className="bg-zinc-700 flex-grow flex-1 flex">
            <Image
              className="object-cover"
              priority
              width={1024}
              height={683}
              src={"/add-book.jpg"}
              alt="Background livros"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddBooks;