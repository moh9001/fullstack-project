import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface Project {
  id: number;
  title: string;
  description: string;
  owner: {
    id: number;
    name: string;
  };
}

interface DecodedToken {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(storedToken);
      setToken(storedToken);
      setUser(decoded);

      axios
        .get("http://localhost:5000/api/projects")
        .then((res) => setProjects(res.data))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      location.reload(); // Reload to show new project
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const deleteProject = async (id: number) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project deleted");
      location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const updateProject = async (id: number) => {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Project updated");
      location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", paddingTop: "2rem" }}>
      <h1>Projects</h1>
      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>

      {/* Create Form */}
      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <button type="submit">Create Project</button>
      </form>

      <hr />

      {/* List Projects */}
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {editingId === project.id ? (
            <div>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ display: "block", width: "100%", margin: "5px 0" }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{ display: "block", width: "100%", margin: "5px 0" }}
              />
              <button onClick={() => updateProject(project.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>By: {project.owner.name}</small>

              {user &&
                (user.userId === project.owner.id || user.role === "admin") && (
                  <div>
                    <button
                      onClick={() => deleteProject(project.id)}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(project.id);
                        setEditTitle(project.title);
                        setEditDescription(project.description);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
