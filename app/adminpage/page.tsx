
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth} from '../utils/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';
import React from 'react';
import { addBook } from "../models/bookModel";
import AddBooks from '../components/AddBooks/page';

const Admin = () => {
  
  const storage = getStorage();

  const [bookData, setBookData] = useState({
    name: '',
    author: '',
    releaseDate: '',
    publisher: '',
    coverUrl: ''
  });

  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para carregamento do livro
  const [uploadingImage, setUploadingImage] = useState(false); // Estado para carregamento da capa


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);

    // Gerar pré-visualização da imagem
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookData.name || !bookData.author || !bookData.releaseDate || !bookData.publisher) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Inicia o spinner do livro
    let coverUrl = '';

    if (coverFile) {
      try {
        setUploadingImage(true); // Inicia o spinner da capa
        const storageRef = ref(storage, `bookCovers/${coverFile.name}`);
        await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(storageRef);
        setUploadingImage(false); // Finaliza o spinner da capa
      } catch (error) {
        console.error('Erro ao fazer upload da capa:', error);
        alert('Erro ao enviar a capa do livro.');
        setUploadingImage(false);
        setLoading(false);
        return;
      }
    }

    try {
      await addBook(bookData);
      // await addDoc(collection(db, 'book'), { ...bookData, coverUrl });
      alert('Livro adicionado com sucesso!');
      setBookData({ name: '', author: '', releaseDate: '', publisher: '', coverUrl: '' });
      setCoverFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      alert('Erro ao adicionar livro.');
    } finally {
      setLoading(false); // Finaliza o spinner do livro
    }
  };

  return <AddBooks></AddBooks>
  

  
};

export default Admin;


