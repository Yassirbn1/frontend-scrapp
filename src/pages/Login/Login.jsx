import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios'; 
import swal from 'sweetalert';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Ajoutez useNavigate pour la redirection

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/login', { Code: parseInt(code), Password: password });
            console.log('Login successful', response.data);
    
            // Stocker les noms dans le localStorage
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('lastName', response.data.lastName);
    
            onLoginSuccess(response.data);
            swal({
                title: "Success!",
                text: "Login successful.",
                icon: "success",
                timer: 2500,
                button: false
            });
            navigate('/scrappdata');
        } catch (error) {
            console.error('Login error:', error);
            swal({
                title: "Error!",
                text: "Please provide a valid code and password.",
                icon: "error",
                timer: 2500,
                button: false
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <section className="login-container">
            <div className="login-card">
            <img className="mt-3" src="/elastomer.jpg" width={300} alt="Elastomer Solution Logo" />

                <h1 className="login-title">Sign in to your account</h1>
                <form className="space-y-4" onSubmit={handleSubmitEvent}>
                    <div className="input-group">
                        <label htmlFor="code" className="input-label">Your code</label>
                        <input
                            type="number"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="input-field" 
                            placeholder="0000" 
                            required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field" 
                            placeholder="Enter password"
                            required />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle">
                            {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
                        </button>
                    </div>
                    <div className="forgot-password">
                        <Link to={'/forgot-password'}>Forgot password?</Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? (
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
