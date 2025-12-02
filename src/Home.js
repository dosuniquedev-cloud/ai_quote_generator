import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    collection, addDoc, doc, updateDoc, increment,
    onSnapshot, query, orderBy, limit
} from "firebase/firestore";
import { db } from './firebase';
import html2canvas from 'html2canvas';

// regional languages
const indianLanguages = [
    "Bengali", "Hindi", "Tamil", "Telugu", "Marathi", "Gujarati",
    "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese",
    "Maithili", "Santali", "Nepali", "Sinhala", "English"
];

const randomTopics = [
    // Emotions & Life
    "Love", "Success", "Happiness", "Heartbreak", "Hope", "Failure",
    "Peace", "Anger", "Courage", "Fear", "Trust", "Betrayal", "Destiny",
    "Freedom", "Wisdom", "Loneliness", "Nostalgia", "Regret", "Gratitude",

    // Relationships
    "Mother", "Father", "Friendship", "Sister", "Brother", "Teacher",
    "Family", "Enemy", "Soulmate",

    // Nature & Universe
    "Rain", "Space", "Moon", "Sun", "Stars", "Ocean", "Mountains",
    "Flowers", "Winter", "Summer", "River", "Night", "Sunrise", "Sunset",

    // Daily Life & Objects
    "Coffee", "Chai", "Books", "Music", "Money", "Time", "Travel",
    "Work", "School", "Home", "Mirror", "Sleep", "Food",

    // Abstract & Fun
    "Dreams", "Magic", "Silence", "Chaos", "Adventure", "Memories",
    "Cricket", "Cinema", "Politics", "Technology", "Future", "Childhood"
];

function Home() {
    // Inputs
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('inspirational');
    const [language, setLanguage] = useState('Bengali');

    // UI States
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [quote, setQuote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Data States
    const [visitorCount, setVisitorCount] = useState(0);
    const [recentTopics, setRecentTopics] = useState([]);

    const API_KEY = process.env.REACT_APP_GEMINI_KEY;

    // --- 1. HANDLE VISITORS & TRENDING TOPICS ---
    useEffect(() => {
        // A. VISITOR COUNT --> Session Based
        const statsRef = doc(db, "site_stats", "general");
        const isNewSession = !sessionStorage.getItem("visit_recorded");

        if (isNewSession) {
            updateDoc(statsRef, { visitorCount: increment(1) })
                .then(() => sessionStorage.setItem("visit_recorded", "true"))
                .catch(err => console.error(err));
        }

        // Listener for Count
        const unsubStats = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) setVisitorCount(doc.data().visitorCount);
        });

        // B. RECENT TOPICS (Trending)
        const historyRef = collection(db, "generation_history");
        const q = query(historyRef, orderBy("timestamp", "desc"), limit(6));

        const unsubHistory = onSnapshot(q, (snapshot) => {
            const topics = snapshot.docs.map(doc => doc.data().topic);
            // Remove duplicates
            setRecentTopics([...new Set(topics)]);
        });

        return () => { unsubStats(); unsubHistory(); };
    }, []);

    // --- 2. HELPER FUNCTIONS ---
    const handleLanguageChange = (e) => {
        const userInput = e.target.value;
        setLanguage(userInput);
        if (userInput.length > 0) {
            setFilteredLanguages(indianLanguages.filter(l => l.toLowerCase().includes(userInput.toLowerCase())));
            setShowSuggestions(true);
        } else { setShowSuggestions(false); }
    };

    const selectLanguage = (l) => { setLanguage(l); setFilteredLanguages([]); setShowSuggestions(false); };

    const handleSurprise = () => {
        setTopic(randomTopics[Math.floor(Math.random() * randomTopics.length)]);
        setLanguage(indianLanguages[Math.floor(Math.random() * indianLanguages.length)]);
    };

    const downloadImage = () => {
        const element = document.getElementById('quote-card');
        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = `quote-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    // --- 3. MAIN GENERATION LOGIC ---
    const generateQuote = async () => {
        if (!topic) { setError('Please enter a topic first.'); return; }
        setLoading(true); setError(''); setQuote('');

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

            const prompt = `Generate a creative, short quote about "${topic}" in the "${language}" language. 
      Tone: "${tone}". 
      Rules:
      1. Quote in Original Script.
      2. English Translation below in parentheses.
      3. Format: "Quote" - Author`;

            const result = await model.generateContent(prompt);
            const text = await result.response.text();
            setQuote(text);

            // Save to Firebase
            await addDoc(collection(db, "generation_history"), {
                topic, language, tone, quote: text, timestamp: new Date()
            });

        } catch (err) { setError('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="container mt-4">

            {/* Visitor Badge */}
            <div className="d-flex justify-content-end mb-3">
                <span className="badge bg-warning text-dark fs-6 shadow-sm">
                    👀 Total Visitors: {visitorCount}
                </span>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-gradient bg-warning text-dark text-center p-3">
                            <h3 className="mb-0 fw-bold">🌏 AI Quote Generator [DOS]</h3>
                        </div>

                        <div className="card-body p-4 p-md-5">

                            {/* Surprise Me & Topic */}
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="fw-bold text-muted">Topic</label>
                                <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={handleSurprise}>🎲 Surprise Me</button>
                            </div>
                            <input type="text" className="form-control form-control-lg mb-3" placeholder="e.g. Rain, Love..." value={topic} onChange={(e) => setTopic(e.target.value)} />

                            {/* Language */}
                            <div className="mb-3 position-relative">
                                <label className="fw-bold text-muted">Language</label>
                                <input type="text" className="form-control form-control-lg" value={language} onChange={handleLanguageChange} autoComplete="off" />
                                {showSuggestions && filteredLanguages.length > 0 && (
                                    <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                        {filteredLanguages.map((l, i) => <li key={i} className="list-group-item list-group-item-action" onClick={() => selectLanguage(l)}>{l}</li>)}
                                    </ul>
                                )}
                            </div>

                            {/* Tone */}
                            <div className="mb-4">
                                <label className="fw-bold text-muted">Tone</label>
                                <select className="form-select form-select-lg" value={tone} onChange={e => setTone(e.target.value)}>
                                    <option value="inspirational">Inspirational</option>
                                    <option value="poetic">Poetic</option>
                                    <option value="funny">Funny</option>
                                    <option value="philosophical">Philosophical</option>
                                    <option value="romantic">Romantic</option>
                                    <option value="melancholic">Melancholic</option>
                                    <option value="nostalgic">Nostalgic</option>
                                    <option value="optimistic">Optimistic</option>
                                    <option value="heartbroken">Heartbroken</option>
                                    <option value="sarcastic">Sarcastic</option>
                                    <option value="witty">Witty</option>
                                    <option value="dark_humor">Dark Humor</option>
                                    <option value="dad_joke">Dad Joke Style</option>
                                    <option value="satirical">Satirical</option>
                                    <option value="motivational">Motivational</option>
                                    <option value="business">Business & Success</option>
                                    <option value="mindfulness">Mindfulness & Zen</option>
                                    <option value="stoic">Stoic</option>
                                    <option value="fitness">Fitness & Health</option>
                                    <option value="futuristic">Cyberpunk / Futuristic</option>
                                    <option value="shakespearean">Shakespearean</option>
                                    <option value="minimalist">Minimalist (Short)</option>
                                    <option value="mysterious">Mysterious</option>
                                    <option value="dramatic">Dramatic</option>
                                </select>
                            </div>

                            {/* Generate Button */}
                            <button className="btn btn-dark btn-lg w-100 shadow-sm" onClick={generateQuote} disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Generating...</> : '✨ Generate Quote'}
                            </button>

                            {/* Recent Topics */}
                            {recentTopics.length > 0 && (
                                <div className="mt-3 text-center">
                                    <small className="text-muted d-block mb-1">Trending Topics:</small>
                                    {recentTopics.map((t, i) => (
                                        <span key={i} className="badge bg-secondary me-1 mb-1" style={{ cursor: 'pointer' }} onClick={() => setTopic(t)}>{t}</span>
                                    ))}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && <div className="alert alert-danger mt-3">{error}</div>}

                            {/* Result Area */}
                            {quote && (
                                <div className="mt-4">
                                    <div id="quote-card" className="card bg-light border-start border-5 border-warning p-4 shadow-sm">
                                        <figure className="text-center mb-0">
                                            <blockquote className="blockquote">
                                                <p className="fs-5 fw-medium" style={{ whiteSpace: 'pre-line' }}>{quote}</p>
                                            </blockquote>
                                            <figcaption className="blockquote-footer mt-2 mb-0">
                                                AI Generated • {topic}
                                            </figcaption>
                                        </figure>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button className="btn btn-success flex-fill" onClick={downloadImage}>📸 Download Img</button>
                                        <button className="btn btn-outline-secondary flex-fill" onClick={() => navigator.clipboard.writeText(quote)}>📋 Copy</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;