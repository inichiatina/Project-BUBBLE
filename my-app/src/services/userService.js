import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";

//vai buscar o perfil do utilizador
export const getUserProfile = async (uid) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return snapshot.data();
};

//dá update no perfil do utilizador
export const updateUserProfile = async (uid, data) => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, data, { merge: true });
};

//adiciona filmes a uma lista
export const addMovieToList = async (uid, lista, filme) => {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
        [lista]: arrayUnion(filme),
    });
};

//remover filme de uma lista
export const removeMovieFromList = async (uid, lista, filmeId) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    const listaAtual = data[lista] || [];
    const novaLista = listaAtual.filter((f) => f.id !== filmeId);

    await updateDoc(docRef, { [lista]: novaLista });
};

//verifica em que listas um filme já está
export const getFilmeListas = async (uid, filmeId) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return {};

    const data = snapshot.data();
    return {
        filmesVistos: (data.filmesVistos || []).some((f) => f.id === filmeId),
        favoritos: (data.favoritos || []).some((f) => f.id === filmeId),
        popTheBubble: (data.popTheBubble || []).some((f) => f.id === filmeId),
    };
};