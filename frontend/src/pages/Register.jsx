import { useState } from "react";
import { registerRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerRequest(form.username, form.email, form.password);
      toast.success("Cuenta creada correctamente 🎉");
      navigate("/login");
    } catch (error) {
      toast.error("Error al registrarse 😢");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        {/* Imagen izquierda */}
        <div className="auth-left">
          <img 
            src="https://media.istockphoto.com/id/518468635/es/foto/pasteler%C3%ADa-francesa-en-mostrar-una-tienda-de-productos-de-confiter%C3%ADa.jpg?s=612x612&w=0&k=20&c=1FWNKtCVnnHcjdgG4_Bj0MvmUxOlFmcCEww_Uv-zpbw="
            alt="Register"
            className="auth-illustration"
          />
        </div>

        {/* Formulario */}
        <div className="auth-right">
          <h2 className="auth-title">Crear Cuenta</h2>
          <p className="auth-sub">Únete a nuestra pastelería 🎂✨</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="btn-auth">Registrarse</button>
          </form>

          <div className="auth-links">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
          </div>

        </div>

      </div>
    </div>
  );
}
