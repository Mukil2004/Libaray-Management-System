import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [role, setRole] = useState(null);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]); // State to store user details
    const [notes] = useState([
        "Library closed on 15th Aug (Holiday)",
        "New arrivals coming next month",
        "Book fair scheduled for October",
    ]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [newBook, setNewBook] = useState({ name: "", author: "", location: "", available: true });
    const [editIndex, setEditIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (!storedRole) {
            navigate("/", { replace: true });
        } else {
            setRole(storedRole);
        }
    }, [navigate]);

    // Fetch books
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/books");
                if (!response.ok) throw new Error("Failed to fetch books");
                const data = await response.json();
                // FIX: books array is inside data.data from backend
                setBooks(data.data || []);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Fetch users (only for admin)
    useEffect(() => {
        if (role === "admin") {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const response = await fetch("http://localhost:5000/users");
                    if (!response.ok) throw new Error("Failed to fetch users");
                    const data = await response.json();
                    setUsers(data.data || []);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setUsers([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchUsers();
        }
    }, [role]);


    function viewProof(proofPath) {
        if (proofPath) {
            window.open(proofPath, '_blank');
        } else {
            alert('Proof file not available.');
        }
    }


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBook((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!newBook.name.trim() || !newBook.author.trim() || !newBook.location.trim()) {
            alert("Please fill all fields");
            return;
        }
        setFormLoading(true);

        try {
            const method = editIndex !== null ? "PUT" : "POST";
            const endpoint =
                editIndex !== null
                    ? `http://localhost:5000/books/${books[editIndex].id}`
                    : "http://localhost:5000/books";

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) throw new Error("Failed to save book");

            // Re-fetch updated books list
            const updatedBooksResponse = await fetch("http://localhost:5000/books");
            const updatedBooksData = await updatedBooksResponse.json();
            setBooks(updatedBooksData.data || []);

            setNewBook({ name: "", author: "", location: "", available: true });
            setEditIndex(null);
        } catch (error) {
            console.error("Error saving book:", error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditBook = (index) => {
        setNewBook(books[index]);
        setEditIndex(index);
    };

    const handleCancelEdit = () => {
        setNewBook({ name: "", author: "", location: "", available: true });
        setEditIndex(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/", { replace: true });
    };


    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", display: "flex", gap: "20px" }}>
            <div style={{ flex: 3 }}>
                <h1>Library Management System</h1>
                <h2>
                    Welcome, {role === "admin" ? "Admin" : "User"}!
                    <button onClick={handleLogout} style={{ marginLeft: "20px", padding: "5px 10px" }}>
                        Logout
                    </button>
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <h3>Books</h3>
                        <table border="1" cellPadding="8" cellSpacing="0" width="100%" style={{ marginTop: "20px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#eee" }}>
                                    <th>Book Name</th>
                                    <th>Author</th>
                                    <th>Location</th>
                                    <th>Availability</th>
                                    {role === "admin" && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {books.length === 0 ? (
                                    <tr>
                                        <td colSpan={role === "admin" ? 5 : 4} style={{ textAlign: "center" }}>
                                            No books found.
                                        </td>
                                    </tr>
                                ) : (
                                    books.map((book, idx) => (
                                        <tr key={book.id}>
                                            <td>{book.name}</td>
                                            <td>{book.author}</td>
                                            <td>{book.location}</td>
                                            <td>{book.available ? "Available" : "Borrowed"}</td>
                                            {role === "admin" && (
                                                <td>
                                                    <button onClick={() => handleEditBook(idx)}>Edit</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {role === "admin" && (
                            <>
                                <h3>{editIndex !== null ? "Edit Book" : "Add New Book"}</h3>
                                <form onSubmit={handleAddBook}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Book Name"
                                        value={newBook.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="author"
                                        placeholder="Author"
                                        value={newBook.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        value={newBook.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={newBook.available}
                                            onChange={handleInputChange}
                                        />
                                        Available
                                    </label>
                                    <br />
                                    <button type="submit" disabled={formLoading}>
                                        {editIndex !== null ? "Update Book" : "Add Book"}
                                    </button>
                                    {editIndex !== null && (
                                        <button type="button" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    )}
                                </form>
                            </>
                        )}

                        {role === "admin" && (
                            <>
                                <h3>User Details</h3>
                                <table border="1" cellPadding="8" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr style={{ backgroundColor: "#eee" }}>
                                            <th>User ID</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center" }}>
                                                    No users found.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.userId}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>
                                                        {user.proof_path ? (
                                                            user.proof_path.match(/\.(jpg|jpeg|png)$/i) ? (
                                                                <img
                                                                    src={`http://localhost:5000/${user.proof_path}`}
                                                                    alt="Proof"
                                                                    style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/default-proof.jpg';
                                                                    }}
                                                                    onClick={() => window.open(`http://localhost:5000/${user.proof_path}`, '_blank')}
                                                                />
                                                            ) : user.proof_path.match(/\.pdf$/i) ? (
                                                                <embed
                                                                    src={`http://localhost:5000/${user.proof_path}`}
                                                                    type="application/pdf"
                                                                    style={{ width: '100px', height: '150px', cursor: 'pointer' }}
                                                                    onClick={() => window.open(`http://localhost:5000/${user.proof_path}`, '_blank')}
                                                                    onError={() => alert('Proof file not available.')}
                                                                />
                                                            ) : (
                                                                <span>Unsupported file format</span>
                                                            )
                                                        ) : (
                                                            <span>No Proof Uploaded</span>
                                                        )}
                                                    </td>


                                                </tr>
                                            )))
                                        }
                                    </tbody>
                                </table>
                            </>
                        )}
                    </>
                )}
            </div>

            {role === "user" && (
                <div style={{ flex: 1, borderLeft: "2px solid #ddd", paddingLeft: "20px" }}>
                    <h3>Notes</h3>
                    <ul>
                        {notes.map((note, i) => (
                            <li key={i}>{note}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
