"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import Image from "next/image";
import React from "react";
import {
  IconArrowBack,
  IconBook,
  IconBookmarkMinus,
  IconCodeAsterisk,
  IconUserPlus,
} from "@tabler/icons-react";
import textToPascalCase from "../utils/text_to_pascal_case";

let idCurrentReader = "";

function Books() {
  const [books, setBooks] = useState([]);//Lista de livros adicionados recentemente
  const [loading, setLoading] = useState(true); // Estado para controle do carregamento

  const [index, setIndex] = useState(0);

  function changeIndex(n: number) {
    setIndex(n);
  }

  const [orders, setOrders] = useState([]);//Pedido de um livro
  const [ordersAll, setOrdersAll] = useState([]);//Todos os pedidos de livros

  const [finding, setFinding] = useState(false);
  const [findBooks, setFindBooks] = useState([]);

  const [isBookFind, setIsBookFind] = useState(false);

  function initIsBookFind() {
    setIsBookFind(true);
  }
  function closeIsBookFind() {
    setIsBookFind(false);
  }

  //Variaveis de Filtro de busca

  const [findReaderBook, setFindReaderBook] = useState("");
  const [findReader, setFindReader] = useState("");
  const [findTitle, setFindTitle] = useState("");

  function initFind() {
    setFinding(true);
  }
  function closeFind() {
    setFinding(false);
  }

  async function findingBooks() {
    initFind();

    const wheres: QueryConstraint[] = [];
    const refBooks = collection(db, "books");
    if (!findTitle) {
      closeFind();
      return;
    }
    wheres.push(where("title", ">=", findTitle.toLowerCase()));
    wheres.push(where("title", "<=", findTitle.toLowerCase() + "\uf8ff"));


    const queryBooks = query(
      refBooks,
      ...wheres,
    );

    const books = await getDocs(queryBooks);

    const getBooks = books.docs.map((data) => ({
      id: data.id,
      title: textToPascalCase(data.data().title).substring(0, 40),
      subtitle: textToPascalCase(data.data().subtitle).substring(0, 40),
      author: textToPascalCase(data.data().author).substring(0, 40),
      year: data.data().year,
      edition: data.data().edition,
      publisher: textToPascalCase(data.data().publisher).substring(0, 40),
    }));
    setFindBooks(getBooks);
    closeFind();
  }

  async function findingOrders() {
    initFind();

    const wheres: QueryConstraint[] = [];
    const refOrders = collection(db, "orders");
    if (!findReader) {
      closeFind();
      return;
    }

    wheres.push(where("id_reader", "==", findReader));
    wheres.push(where("return", "==", false));

    const queryOrders = query(refOrders, ...wheres);

    const orders = await getDocs(queryOrders);

    const getOrders = orders.docs.map((data) => ({
      id: data.id,
      book_title: textToPascalCase(data.data().book_title).substring(0, 40),
      reader_name: textToPascalCase(data.data().reader_name).substring(0, 40),
      reader_contact: textToPascalCase(data.data().reader_contact).substring(
        0,
        40
      ),
    }));
    setOrders(getOrders);
    closeFind();
  }

  async function findingOrdersAll() {
    initFind();

    const wheres: QueryConstraint[] = [];
    const refOrders = collection(db, "orders");

    wheres.push(where("return", "==", false));

    const queryOrders = query(refOrders, ...wheres);

    const orders = await getDocs(queryOrders);

    const getOrders = orders.docs.map((data) => ({
      id: data.id,
      book_title: textToPascalCase(data.data().book_title).substring(0, 40),
      reader_name: textToPascalCase(data.data().reader_name).substring(0, 40),
      reader_contact: textToPascalCase(data.data().reader_contact).substring(
        0,
        40
      ),
    }));
    setOrdersAll(getOrders);
    closeFind();
  }

  async function addBookReader(e: any, bookId, bookTitle) {
    e.preventDefault();

    if (!idCurrentReader.length) return;
    initFind();
    try {
      const reader = doc(db, "/readers", idCurrentReader);
      const getReader = await getDoc(reader);
      if (getReader.exists()) {
        const orders = collection(db, "orders");
        await addDoc(orders, {
          id_book: bookId,
          book_title: bookTitle,
          id_reader: idCurrentReader,
          reader_name: getReader.data().name,
          reader_contact: getReader.data().contact,
          return: false,
          createdAt: Timestamp.fromDate(new Date()),
        });
        //idCurrentReader = '';
        setFindReaderBook("");
        setFindTitle("");
        closeFind();
        setTimeout(
          () =>
            alert(
              `Pedido adicionado com sucesso: ${textToPascalCase(
                getReader.data().name
              )}`
            ),
          200
        );
      } else {
        closeFind();
        alert("Usuario nao encontrado!");
      }

      console.log(idCurrentReader);
    } finally {
      closeFind();
    }
  }

  async function returnOrderSingle(id_order: string) {
    try {
      initFind();

      const order = doc(db, "orders", id_order);
      await updateDoc(order, { return: true });
      
      const filters = orders.filter((value) => !(value.id === id_order));
      
      setOrders(filters);
      closeFind();
      setTimeout(()=>{
        alert("Devolução feita com sucesso");
      }, 200);
      
    } catch(e){
      alert(`Ocorreu um erro: ${e}`)
    }
    
    finally {
      closeFind();
    }
  }

  async function returnOrder(id_order: string) {
    try {
      initFind();

      const order = doc(db, "orders", id_order);
      await updateDoc(order, { return: true });
      //closeFind();
      console.log(ordersAll)
      const filters = ordersAll.filter((value) => !(value.id === id_order)
      );
      
      setOrdersAll(filters);
      closeFind();
      setTimeout(()=>{
        alert("Devolução feita com sucesso");
      }, 200);
      
    } catch(e){
      alert(`Ocorreu um erro: ${e}`)
    }
    
    finally {
      closeFind();
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(
          collection(db, "books"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);

        const getBooks = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            title: textToPascalCase(doc.data().title),
            subtitle: textToPascalCase(doc.data().subtitle),
            year: doc.data().year,
            edition: doc.data().edition,
            publisher: textToPascalCase(doc.data().publisher),
            author: textToPascalCase(doc.data().author),
            coverUrl: doc.data().coverUrl || "", // Se não houver imagem, retorna string vazia
          };
        });

        setBooks(getBooks);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setLoading(false); // Para de mostrar o loader após carregar os dados
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* {<h1 className="text-3xl font-bold text-gray-800">Lista de Livros</h1>} */}
      <div className="flex gap-4 border-2 p-2 rounded-md justify-center items-center text-xl font-bold">
        <h2
          onClick={() => changeIndex(0)}
          className={`cursor-pointer  ${
            index === 0 && "bg-teal-600 p-2 rounded-md text-white"
          }`}
        >
          Pedir livro
        </h2>
        |
        <h2
          className={`cursor-pointer  ${
            index === 1 && "bg-teal-600 p-2 rounded-md text-white"
          }`}
          onClick={() => {
            idCurrentReader = '';
            changeIndex(1)}}
        >
          Devolver livro
        </h2>
        |
        <h2
          className={`cursor-pointer  ${
            index === 2 && "bg-teal-600 p-2 rounded-md text-white"
          }`}
          onClick={() => {
            idCurrentReader = '';
            changeIndex(2);
            findingOrdersAll();
          }}
        >
          Ver todos pedidos
        </h2>
      </div>
      <br />
      <div className="grid grid-cols-[3fr_1fr] w-full gap-2.5">
        <div className="flex-grow ">
          {index === 0 ? (
            <div className="">
              <span className="text-xl font-extrabold text-gray-600">
                Buscar Livros
              </span>

              <div className="flex gap-2 items-center flex-wrap mt-4">
                <span className="font-semibold text-lg ">Titulo: </span>
                <input
                  onChange={(e) => setFindTitle(e.currentTarget.value)}
                  value={findTitle}
                  type="text"
                  className="p-2 rounded-md flex-grow"
                  placeholder="titulo"
                />

                <button
                  onClick={findingBooks}
                  className="rounded-md p-1.5 font-bold text-white hover:bg-teal-800 bg-teal-600"
                >
                  Buscar
                </button>
              </div>
              {finding && (
                <div className="place-self-center mt-10">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <ul className="mt-4 flex flex-wrap gap-3 overflow-y-scroll max-h-[700px] pb-32">
                {findBooks.map((data) => (
                  <li
                    className="rounded-md bg-white p-2 flex flex-col gap-2 max-w-72"
                    key={data.id}
                  >
                    <div className="flex flex-col p-1 rounded-md bg-zinc-100">
                      <div className="h-20 w-20">
                        <Image
                          priority
                          src={"/book.png"}
                          alt="Livro"
                          width={512}
                          height={512}
                        ></Image>
                      </div>

                      <span>
                        <strong>Titulo:</strong>
                        {` ${data.title ?? ""}`}
                      </span>
                      <span>
                        <strong>Autor:</strong>
                        {` ${data.author ?? ""}`}
                      </span>
                      <span>
                        <strong>Editora:</strong>
                        {` ${data.publisher ?? ""}`}
                      </span>
                      <span>
                        <strong>Ano de lançamento:</strong>
                        {` ${data.year ?? ""}`}
                      </span>
                    </div>
                    <hr />
                    <div className="bg-zinc-100 rounded-md p-1.5">
                      <span className="font-bold flex">
                        <IconCodeAsterisk></IconCodeAsterisk>
                        {` Identificação do Leitor`}
                      </span>

                      <div className="flex justify-stretch gap-1 items-center ">
                        <input
                          type="text"
                          //value={findReaderBook}
                          onChange={(e) => {
                            idCurrentReader = e.target.value;
                            setFindReaderBook(idCurrentReader);
                          }}
                          placeholder="id do Leitor"
                          className="bg-zinc-200 p-1 rounded-md flex-grow"
                        />
                        <div className="hover:bg-teal-600 hover:text-white  p-1 rounded-md">
                          <IconUserPlus
                            className=""
                            onClick={(e) => {
                              addBookReader(e, data.id, data.title);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {isBookFind && (
                <div className="place-self-center mt-10">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : index === 1 ? (
            <div className="flex flex-col gap-2">
              <span className="text-xl font-extrabold text-gray-600">
                Buscar Leitor
              </span>

              <div className="flex gap-2 items-center flex-wrap mt-4">
                <span className="font-semibold text-lg ">Identificação: </span>
                <input
                  onChange={(e) => setFindReader(e.currentTarget.value)}
                  value={findReader}
                  type="text"
                  className="p-2 rounded-md flex-grow"
                  placeholder="identificação do Leitor"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    findingOrders();
                  }}
                  className="rounded-md p-1.5 font-bold text-white hover:bg-teal-800 bg-teal-600"
                >
                  Buscar
                </button>
              </div>

              <span className="mt-4 font-bold text-xl">Pedidos</span>
              {finding && (
                <div className="place-self-center mt-10">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <ul className="mt-2 flex flex-col gap-3 overflow-y-scroll pb-32 max-h-[680px]">
                {orders.map((data) => (
                  <li
                    className="rounded-md bg-white p-2 flex flex-col gap-2 w-full"
                    key={data.id}
                  >
                    <div className="flex flex-col p-1 rounded-md bg-zinc-100">
                      <IconBookmarkMinus size={40} />
                      <span>
                        <strong>Leitor:</strong>
                        {` ${data.reader_name ?? ""}`}
                      </span>
                      <span>
                        <strong>Livro:</strong>
                        {` ${data.book_title ?? ""}`}
                      </span>
                      <span>
                        <strong>Contacto:</strong>
                        {` ${data.reader_contact ?? ""}`}
                      </span>
                    </div>
                    <hr />
                    <div className="bg-zinc-300 rounded-md p-0.5">
                      <div
                        className="flex justify-center gap-1 items-center hover:bg-teal-200 p-1 rounded-md font-bold cursor-pointer"
                        onClick={(e) => {
                          returnOrderSingle(data.id);
                        }}
                      >
                        <IconArrowBack />
                        Devolver
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
             
              {finding && (
                <div className="place-self-center mt-10">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
               <h1 className="mt-4 font-bold text-xl">Todos pedidos</h1>
              {
                !finding && ordersAll.length === 0 && ( <span className="font-semibold">Nenhum pedido encontrado...</span> )
              }
              <ul className="mt-2 flex flex-col gap-3 overflow-y-scroll pb-32 max-h-[700px]">
                {ordersAll.map((data) => (
                  <li
                    className="rounded-md bg-white p-2 flex flex-col gap-2 w-full"
                    key={data.id}
                  >
                    <div className="flex flex-col p-1 rounded-md bg-zinc-100">
                      <IconBookmarkMinus size={40} />
                      <span>
                        <strong>Leitor:</strong>
                        {` ${data.reader_name ?? ""}`}
                      </span>
                      <span>
                        <strong>Livro:</strong>
                        {` ${data.book_title ?? ""}`}
                      </span>
                      <span>
                        <strong>Contacto:</strong>
                        {` ${data.reader_contact ?? ""}`}
                      </span>
                    </div>
                    <hr />
                    <div className="bg-zinc-300 rounded-md p-0.5">
                      <div
                        className="flex justify-center gap-1 items-center hover:bg-teal-200 p-1 rounded-md font-bold cursor-pointer"
                        onClick={(e) => {
                          returnOrder(data.id);
                        }}
                      >
                        <IconArrowBack />
                        Devolver
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-bold">Livros adicionados recentemente</h1>
          {/* Loader enquanto os livros estão sendo carregados */}
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-h-[700px] pb-32 flex flex-col gap-4 mt-4 overflow-y-scroll">
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
                  >
                    {/* Exibe a capa do livro, se existir */}
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={`Capa do livro ${book.title}`}
                        className="w-40 h-60 object-cover rounded-md mb-4"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md mb-4">
                        <span className="text-gray-500 text-6xl font-black">
                          {book.title[0]?.toUpperCase() ?? "A"}
                        </span>
                      </div>
                    )}

                    <p className="text-lg font-semibold text-blue-600 text-center">
                      {book.title}
                    </p>
                    <p className="text-gray-600 text-center">
                      Autor: {book.author}
                    </p>

                    <span className="px-2 bg-blue-600 rounded-full font-bold text-white">
                      Lancamento: {book.year}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  Nenhum livro disponível
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Books;