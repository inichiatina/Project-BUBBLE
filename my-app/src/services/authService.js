import { auth, db } from "../firebase/config.js";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

//login com google
export const loginGoogle = async () => {

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            nome: user.displayName || "",
            email: user.email,
            filmesVistos: [],
            favoritos: [],
            popTheBubble: []
        });
    }

    return result;
};


//login com email
export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};


//registo com email e password
export const registerUser = async (email, password, nome = "") => {

    const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = result.user;

    //cria documento
    await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        email: user.email,
        filmesVistos: [],
        favoritos: [],
        popTheBubble: []
    });

    return result;
};


//logout
export const logoutUser = async () => {
    return await signOut(auth);
};

