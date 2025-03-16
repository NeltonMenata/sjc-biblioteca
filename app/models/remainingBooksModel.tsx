import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

// Função para adicionar um livro restante
export const addRemainingBook = async (remainingBookData) => {
  try {
    const docRef = await addDoc(collection(db, "remainingBooks"), remainingBookData);
    console.log("Livro restante adicionado com ID: ", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar livro restante:", error);
  }
};

// Função para pegar todos os livros restantes
export const getRemainingBooks = async () => {
  const querySnapshot = await getDocs(collection(db, "remainingBooks"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// (Modelo de Livros Restantes)