import { db } from '../utils/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Função para adicionar um novo usuário
export const addUser = async (userData) => {
  try {
    const userRef = collection(db, 'users');
    await addDoc(userRef, userData); // Inclui o passNumber no userData
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw new Error('Erro ao adicionar usuário');
  }
};

// Função para obter todos os usuários
export const getUsers = async () => {
  try {
    const userRef = collection(db, 'users');
    const querySnapshot = await getDocs(userRef);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return users;
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    throw new Error('Erro ao obter usuários');
  }
};
