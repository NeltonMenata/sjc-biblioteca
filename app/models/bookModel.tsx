import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

// Função para adicionar um livro
export const addBook = async (bookData) => {
  try {
    const docRef = await addDoc(collection(db, "book"), bookData);
    console.log("Livro adicionado com ID: ", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar livro:", error);
  }
};

// Função para pegar todos os livros
export const getBooks = async () => {
  const querySnapshot = await getDocs(collection(db, "book"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para atualizar um livro (ex: após um pedido)
export const updateBook = async (bookId, updatedData) => {
  const bookRef = doc(db, "book", bookId);
  await updateDoc(bookRef, updatedData);
};


// (Modelo de Livros)