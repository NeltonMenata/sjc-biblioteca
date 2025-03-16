import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

// Função para adicionar um livro pedido
export const addBookOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "bookOrders"), orderData);
    console.log("Livro pedido com ID: ", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar livro pedido:", error);
  }
};

// Função para pegar todos os livros pedidos
export const getBookOrders = async () => {
  const querySnapshot = await getDocs(collection(db, "bookOrders"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// (Modelo de Livros Pedidos)