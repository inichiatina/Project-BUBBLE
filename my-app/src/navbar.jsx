import './navbar.css';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbarmeio">

        <NavLink to="/">

          <img src="/imgs/logo principal.png" className="icon" />
        </NavLink>

        <div className='dropdown-menu'>

          <NavLink to="/noticias" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>NOTÍCIAS</NavLink>

          <NavLink to="/historia" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>HISTÓRIA DO CINEMA</NavLink>

          <NavLink to="/tecnicas" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>TÉCNICAS DE PROPAGANDA</NavLink>

          <NavLink to="/pop" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>POP THE BUBBLE</NavLink>

          <NavLink to="/prop" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>DESCOBRE MAIS</NavLink>

          <NavLink to="/login" className={({ isActive }) => {
            if (isActive) {
              return 'nav-link-ativo';
            } else {
              return 'nav-link';
            }
          }
          }>PERFIL</NavLink>

        </div>
      </div>
    </nav >
  );
}
