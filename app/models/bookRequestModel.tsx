import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

// Função para adicionar um pedido de livro
export const addBookRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, "bookRequests"), requestData);
    console.log("Pedido de livro adicionado com ID: ", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar pedido de livro:", error);
  }
};

// Função para pegar todos os pedidos de livros
export const getBookRequests = async () => {
  const querySnapshot = await getDocs(collection(db, "bookRequests"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// (Modelo de Pedidos de Livros)
