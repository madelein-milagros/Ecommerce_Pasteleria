import { useState } from "react";
import { loginRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [cred, setCred] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setCred({ ...cred, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginRequest(cred.username, cred.password);
      localStorage.setItem("token", data.access);
      toast.success("Bienvenida 🎀");
      navigate("/");
    } catch (error) {
      toast.error("Credenciales incorrectas 😢");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* Imagen izquierda */}
        <div className="auth-left">
          <img 
            src="https://tartverket.se/cdn/shop/files/Pink_Minimalist_Wedding_Cake_Ideas_Your_Story_300x.png?v=1715801905"
            alt="Login"
            className="auth-illustration"
          />
        </div>

        {/* Formulario */}
        <div className="auth-right">
          <h2 className="auth-title">Iniciar Sesión</h2>
          <p className="auth-sub">Bienvenida de nuevo 💕</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={cred.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={cred.password}
              onChange={handleChange}
              required
            />

            <button className="btn-auth">Ingresar</button>
          </form>

          <div className="auth-links">
            <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
          </div>
        </div>

      </div>
    </div>
  );
}
