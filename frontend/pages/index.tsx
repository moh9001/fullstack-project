import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// For Google SDK access
declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle regular login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/projects");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Google Sign-In init
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "524899509127-508cgdi98kf1naun40k8nbavjfa3qfau.apps.googleusercontent.com",
        callback: async (response: any) => {
          const { credential } = response;

          try {
            const res = await axios.post(
              "http://localhost:5000/api/auth/google",
              {
                token: credential,
              }
            );

            localStorage.setItem("token", res.data.token);
            router.push("/projects");
          } catch (err) {
            console.error(err);
            alert("Google login failed");
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin"),
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: "5rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Log In
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {/* Google Login */}
      <div id="google-signin" style={{ marginTop: "20px" }}></div>
    </div>
  );
}
