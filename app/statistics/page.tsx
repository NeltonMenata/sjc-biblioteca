"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function Statistics() {
  const [isLoading, setIsLoading] = useState(true);
  const [countReader, setCountReader] = useState(0);
  const [countBook, setCountBook] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [countPending, setCountPending] = useState(0);

  useEffect(() => {
    getCountReader();
    getCountBook();
    getCountOrder();
    getCountPending();
  }, []);

  function initLoading() {
    setIsLoading(true);
  }

  function closeLoading() {
    setIsLoading(false);
  }

  async function getCountBook() {
    try {
      initLoading();
      const books = collection(db, "/books");
      const getCount = await getCountFromServer(books);
      const count = getCount.data().count;
      setCountBook(count);
    } finally {
      closeLoading();
    }
  }

  const getCountReader = useCallback(async function () {
    try {
      initLoading();
      const readers = collection(db, "/readers");
      const getCount = await getCountFromServer(readers);
      const count = getCount.data().count;
      setCountReader(count);
    } finally {
      closeLoading();
    }
  }, []);

  async function getCountOrder() {
    try {
      initLoading();
      const orders = collection(db, "/orders");
      const getCount = await getCountFromServer(orders);
      const count = getCount.data().count;
      setCountOrder(count);
    } finally {
      closeLoading();
    }
  }

  async function getCountPending() {
    try {
      initLoading();
      const ordersPending = collection(db, "/orders");
      const queryPending = query(ordersPending, where("return", "==", false));
      const getCount = await getCountFromServer(queryPending);
      const count = getCount.data().count;
      setCountPending(count);
    } finally {
      closeLoading();
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div> {/* Seu Spinner de Carregamento */}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
        Estatísticas da Biblioteca
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Livros Salvos
          </h2>
          <span className="font-black text-5xl text-teal-600">
            {countBook}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Todos Pedidos
          </h2>
          <span className="font-black text-5xl text-teal-600">
            {countOrder}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Livros Pendentes
          </h2>
          <span className="font-black text-5xl text-teal-600">
            {countPending}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Leitores
          </h2>
          <span className="font-black text-5xl text-teal-600">
            {countReader}
          </span>
        </div>
      </div>
    </div>
  );
}