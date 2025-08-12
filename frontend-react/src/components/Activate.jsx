import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

export default function Activate() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function activate() {
      try {
        const res = await axios.get(`${API_BASE}/api/v1/activate/${uid}/${token}/`);
        setMessage(res.data.detail || "Account activated successfully.");
        setTimeout(() => navigate("/"), 1200);
      } catch (err) {
        setError(err.response?.data?.detail || "Invalid or expired activation link.");
      }
    }
    activate();
  }, [uid, token, navigate]);

  return (
    <section className="h-[45rem] flex items-center justify-center bg-gradient-to-b from-black via-violet-950 to-gray-900 px-6 py-10">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {!error ? (
          <p className="text-green-200">{message}</p>
        ) : (
          <p className="text-red-300">{error}</p>
        )}
      </div>
    </section>
  );
}
