import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import './App.css';
import Navbar from './navbar';
import MenuG from './Homepage';
import Tecnicas from './Tecnicas.jsx';
import Historia from './Historia_cinema';
import Prop from './Prop';
import Pop from './Pop';
import Login from './Login.jsx';
import Noticias from './Noticias';
import Entrada from './Entrada';
import Perfil from './Perfil/Perfil.jsx'


import MoviesPage from "./Perfil/FilmesPag.jsx";
import ListaPage from "./Perfil/ListaPag.jsx";
import Register from "./Perfil/Registo.jsx";


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}


export default function App() {
  const location = useLocation();
  const introSeen = sessionStorage.getItem("introSeen");

  return (
    <>
      <AuthProvider>
        {location.pathname !== "/" && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              introSeen
                ? <Navigate to="/home" replace />
                : <Entrada />
            }
          />

          <Route path="/home" element={<MenuG />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/tecnicas" element={<Tecnicas />} />
          <Route path="/pop" element={<Pop />} />
          <Route path="/prop" element={<Prop />} />
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<PrivateRoute><MoviesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Perfil /></PrivateRoute>} />
          <Route path="/lista/:tipo" element={<PrivateRoute><ListaPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider >
    </>
  );
}


