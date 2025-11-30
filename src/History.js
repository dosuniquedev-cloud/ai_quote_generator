import React, { useState } from 'react';
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from './firebase';

function History() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // password from env
    const SECRET_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

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

    // authentication check
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
                        <button type="submit" className="btn btn-warning w-100 fw-bold">Unlock</button>
                    </form>
                    {authError && <div className="text-danger text-center mt-3">{authError}</div>}
                </div>
            </div>
        );
    }

    // unlock
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white">📜 Generation History</h2>
                <button className="btn btn-outline-light btn-sm" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </div>

            {loading ? (
                <div className="text-center text-white"><div className="spinner-border text-warning"></div><p>Loading...</p></div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover rounded overflow-hidden shadow">
                        <thead className="table-warning text-dark">
                            <tr>
                                <th>Date</th>
                                <th>Topic</th>
                                <th>Lang</th>
                                <th>Quote</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-nowrap text-secondary small">
                                        {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
                                    </td>
                                    <td>{item.topic}</td>
                                    <td>{item.language}</td>
                                    <td style={{ whiteSpace: 'pre-wrap', minWidth: '300px' }}><small>{item.quote}</small></td>
                                </tr>
                            ))}
                            {history.length === 0 && <tr><td colSpan="4" className="text-center py-4">No history yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default History;