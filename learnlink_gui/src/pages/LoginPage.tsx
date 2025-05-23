import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import { authService } from "../services/authService";
import '../styles/pages/login.css';
import api from "../api/axiosConfig";
import axios from "axios";
import { API_URL } from '../config/config';
import { useToast } from '../components/ToastProvider';
import { useTheme } from '../context/ThemeContext';


const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Verify user object has required fields
        if (userData.id || userData.user_id) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  // Toggle between sign-in and sign-up views
  const toggleView = () => {
    setIsSignUp(!isSignUp);
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  // Toggle password visibility for both fields
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setConfirmPasswordVisible(!passwordVisible);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/api/auth/google', {
        credential: credentialResponse.credential
      });


      if (response.data?.token && response.data?.user) {
        // Clean and store token
        const cleanToken = response.data.token.replace(/['"]+/g, '');
        
        // Ensure user data has all required fields
        const userData = {
          id: response.data.user.user_id || response.data.user.id,
          user_id: response.data.user.user_id || response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role || 'student'
        };

        // Store the data
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('user', JSON.stringify(userData));
        

        // Verify data is stored correctly
        const storedToken = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (storedToken && storedUser.id && storedUser.email) {
          navigate('/home');
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      showToast('Failed to login with Google', 'error');
      
      // Clean up any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const handleGoogleError = () => {
    showToast('Google sign-in was unsuccessful. Please try again.', 'error');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      // The response directly contains token and user
      const { token, user } = response.data;
      
      // Store token without quotes
      localStorage.setItem('token', token.replace(/['"]+/g, ''));
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(user));
      
      showToast('Logged in successfully!', 'success');
      navigate('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      showToast(error.response?.data?.message || 'Failed to login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, and 1 number', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup({
        username,
        email,
        password
      });

      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        showToast('Account created successfully!', 'success');
        navigate('/home');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to sign up', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>

            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme={isDarkMode ? "filled_black" : "outline"}
                size="large"
                text="signup_with"
                shape="rectangular"
                useOneTap={false}
                ux_mode="popup"
                context="signup"
              />
            </div>

            <div className="divider">
              <span>or use your email for registration</span>
            </div>

            <div className="input-group">
              <PersonIcon className="input-icon" />
              <input
                type="text"
                placeholder="Name"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                required
                minLength={8}
                title="Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, and 1 number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}
                onClick={togglePasswordVisibility}
                id="togglePassword"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                required
                minLength={8}
                title="Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, and 1 number"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}
                onClick={togglePasswordVisibility}
                id="toggleConfirmPassword"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>

            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme={isDarkMode ? "filled_black" : "outline"}
                size="large"
                text="continue_with"
                shape="rectangular"
                useOneTap={false}
                ux_mode="popup"
                context="signin"
              />
            </div>

            <div className="divider">
              <span>or use your email and password</span>
            </div>

            <div className="input-group">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <PasswordIcon className="input-icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`fa-solid ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`}
                onClick={togglePasswordVisibility}
                id="togglePassword"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="forgot">
              <span onClick={handleForgotPasswordClick} className="forgot-link">
                Forget Your Password?
                <i className="fa-solid fa-fish"></i>
              </span>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back to LearnLink!</h1>
              <p>Enter your personal details to sign in.</p>
              <button className="hidden" onClick={toggleView}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Start Learning with LearnLink !</h1>
              <p>
                Register now and become part of our growing learning community.
              </p>
              <button className="hidden" onClick={toggleView}>
                Join LearnLink
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage; 