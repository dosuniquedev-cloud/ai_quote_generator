import React, { useState } from 'react';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase';
import html2canvas from 'html2canvas'; // 1. Import this

function History() {
    // --- AUTH STATE ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    // --- DATA STATE ---
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- VIEW STATE ---
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const SECRET_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "admin123";

    // --- ACTIONS ---
    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            setAuthError('');
            fetchHistory();
        } else {
            setAuthError('❌ Incorrect Password');
            setPasswordInput('');
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "generation_history"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(data);
        } catch (error) { console.error("Error:", error); }
        finally { setLoading(false); }
    };

    // --- NEW: Handle Download for a SPECIFIC card ---
    const downloadCard = (elementId, topic) => {
        const element = document.getElementById(elementId); // Find the specific card
        if (!element) return;

        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = `${topic}-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    // --- NEW: Handle Copy ---
    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        alert("Text Copied!"); // Simple alert feedback
    };

    // --- RENDER: LOGIN ---
    if (!isAuthenticated) {
        return (
            <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="card bg-dark border-secondary text-white p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                    <h3 className="text-center mb-3">🔒 Admin Access</h3>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="form-control text-center mb-3"
                            placeholder="Enter Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-warning w-100 fw-bold">Unlock History</button>
                    </form>
                    {authError && <div className="text-danger text-center mt-3">{authError}</div>}
                </div>
            </div>
        );
    }

    // --- RENDER: MAIN ---
    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white">📜 Generation History</h2>
                <button className="btn btn-outline-light btn-sm" onClick={() => setIsAuthenticated(false)}>🔒 Logout</button>
            </div>

            {/* VIEW SELECTOR */}
            <div className="d-flex justify-content-center mb-4">
                <div className="btn-group shadow" role="group">
                    <button
                        type="button"
                        className={`btn ${viewMode === 'table' ? 'btn-warning fw-bold' : 'btn-dark text-white border-secondary'}`}
                        onClick={() => setViewMode('table')}
                    >
                        📋 Table List
                    </button>
                    <button
                        type="button"
                        className={`btn ${viewMode === 'grid' ? 'btn-warning fw-bold' : 'btn-dark text-white border-secondary'}`}
                        onClick={() => setViewMode('grid')}
                    >
                        🖼️ Gallery View
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-white"><div className="spinner-border text-warning"></div><p>Loading...</p></div>
            ) : (
                <>
                    {/* --- VIEW 1: TABLE --- */}
                    {viewMode === 'table' && (
                        <div className="table-responsive">
                            <table className="table table-dark table-striped table-hover rounded overflow-hidden shadow">
                                <thead className="table-warning text-dark">
                                    <tr>
                                        <th>Date</th>
                                        <th>Topic</th>
                                        <th>Lang</th>
                                        <th>Quote</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-nowrap text-secondary small">
                                                {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td>{item.topic}</td>
                                            <td>{item.language}</td>
                                            <td style={{ whiteSpace: 'pre-wrap', minWidth: '300px' }}><small>{item.quote.substring(0, 100)}...</small></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-light me-1" onClick={() => copyText(item.quote)}>Copy</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && <tr><td colSpan="5" className="text-center py-4">No history yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- VIEW 2: GRID (HOME STYLE) --- */}
                    {viewMode === 'grid' && (
                        <div className="row g-4">
                            {history.map((item) => (
                                <div className="col-md-6 col-lg-4" key={item.id}>

                                    {/* WRAPPER: Used to group Card + Buttons */}
                                    <div className="d-flex flex-column h-100">

                                        {/* 
                       THE CARD: This matches Home.js exactly.
                       We give it a UNIQUE ID based on item.id so we can screenshot it.
                    */}
                                        <div
                                            id={`card-${item.id}`}
                                            className="card bg-light border-start border-5 border-warning p-4 shadow-sm h-100"
                                        >
                                            <figure className="text-center mb-0 d-flex flex-column justify-content-center h-100">
                                                <blockquote className="blockquote">
                                                    <p className="fs-5 fw-medium text-dark" style={{ whiteSpace: 'pre-line' }}>
                                                        {item.quote}
                                                    </p>
                                                </blockquote>
                                                <figcaption className="blockquote-footer mt-auto mb-0 pt-3">
                                                    {item.topic} • {item.language} <br />
                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : ''}
                                                    </small>
                                                </figcaption>
                                            </figure>
                                        </div>

                                        {/* BUTTONS: Outside the card so they don't appear in the screenshot */}
                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                className="btn btn-success btn-sm flex-fill fw-bold"
                                                onClick={() => downloadCard(`card-${item.id}`, item.topic)}
                                            >
                                                📸 Save
                                            </button>
                                            <button
                                                className="btn btn-outline-light btn-sm flex-fill"
                                                onClick={() => copyText(item.quote)}
                                            >
                                                📋 Copy
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            {history.length === 0 && (
                                <div className="text-center text-white py-5">No quotes generated yet.</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default History;