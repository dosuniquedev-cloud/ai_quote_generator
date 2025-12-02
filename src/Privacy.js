import React from 'react';

function Privacy() {
    return (

        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div
                        className="card shadow-lg border-secondary"
                        style={{ backgroundColor: '#18181b', color: '#e4e4e7' }}
                    >
                        <div className="card-body p-4 p-md-5">

                            <h1 className="fw-bold text-warning mb-4">Privacy Policy</h1>
                            <p className="text-white-50">Last updated: December 01, 2025</p>

                            <hr className="border-secondary my-4" />

                            <p>
                                <strong>DOS Unique Dev</strong> ("we," "our," or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how your information is collected, used, and disclosed by
                                the <strong>AI Quote Generator</strong> application.
                            </p>

                            <h4 className="mt-5 mb-3 text-warning">1. Information We Collect</h4>
                            <p>We collect minimal data to provide the best experience:</p>
                            <ul className="list-group list-group-flush rounded">
                                <li className="list-group-item bg-transparent text-light border-secondary">
                                    <strong>📊 Usage Data:</strong> We store anonymous visitor counts and generated quote history (topics, languages, and outputs) to improve our AI models and display trending topics.
                                </li>
                                <li className="list-group-item bg-transparent text-light border-secondary">
                                    <strong>💾 Cookies/Local Storage:</strong> We use local storage on your device to count unique sessions (visitor tracking).
                                </li>
                            </ul>

                            <h4 className="mt-5 mb-3 text-warning">3. Security</h4>
                            <p>
                                We value your trust in providing us your information, thus we are striving to use commercially acceptable means of protecting it.
                                However, remember that no method of transmission over the internet is 100% secure.
                            </p>

                            <h4 className="mt-5 mb-3 text-warning">4. Children’s Privacy</h4>
                            <p>
                                These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
                            </p>

                            <h4 className="mt-5 mb-3 text-warning">5. Contact Us</h4>
                            <p>
                                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                            </p>

                            <div className="d-grid gap-2 col-md-6 mt-3">
                                <a href="mailto:dos.unique.dev@gmail.com" className="btn btn-outline-warning">
                                    ✉️ Email Support
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Privacy;