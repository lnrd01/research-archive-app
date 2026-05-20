import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import profileImg from '../assets/profile-acc.png';
import { closeProfile, openProfile } from '../store/uiSlice';

const Profile = ({ user, onLogin, onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(user ?? {
    username: 'Guest',
    email: '--',
  });
  
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    dispatch(openProfile());
    return () => {
      dispatch(closeProfile());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(closeProfile());
    setShowModal(false);
    navigate('/');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }
    
    if (users.find(u => u.username === formData.username)) {
      setError("Username already exists.");
      return;
    }

    const newUsersList = [...users, { ...formData }];
    setUsers(newUsersList);
    localStorage.setItem('app_users', JSON.stringify(newUsersList));
    
    setError("");
    setAuthView('login'); 
    alert("Account created! Please log in.");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (foundUser) {
      const loggedUser = { ...foundUser, image: profileImg };
      setCurrentUser(loggedUser);
      onLogin?.(loggedUser);
      setShowModal(false);       
      setError("");
      setFormData({ username: '', email: '', password: '' }); 
      navigate('/');
    } else {
      setError("Invalid credentials or account doesn't exist.");
    }
  };

  const handleSignOut = () => {
    setCurrentUser({ username: 'Guest', email: '--',});
    onLogout?.();
  };

  const openAddAccount = () => {
    setAuthView('login'); 
    setError("");
    setShowModal(true);
  };

  return (
    <div className="page-container" onClick={handleClose}>
      {/* PROFILE CARD */}
      <div className="card-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <img src={profileImg} alt="Profile" className="profile-image" />
          </div>
          <div className="profile-info">
            <div className="profile-name-row">
              <h2 className="user-name">{currentUser.username}</h2>
            </div>
            <p className="user-email">{currentUser.email}</p>
            <button className="btn primary-btn">My Account</button>
          </div>
        </div>

        <hr className="divider" />

        <div className="action-section">
          <button className="btn secondary-btn" onClick={openAddAccount}>
            Add Account
          </button>
          <button className="btn secondary-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>

      {/* --- Login and Sign Up Modals --- */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {authView === 'login' ? (
              <>
                <h3>Log In</h3>
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label>Username</label>
                    <input name="username" type="text" placeholder="Username" onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required />
                  </div>
                  {error && <p className="error-text">{error}</p>}
                  <div className="modal-actions">
                    <button type="submit" className="btn secondary-btn">Login</button>
                    <button type="button" className="btn cancel-btn" onClick={handleCloseModal}>Cancel</button>
                  </div>
                </form>
                <p className="toggle-text">
                  Don't have an account? <span onClick={() => setAuthView('signup')}>Sign Up</span>
                </p>
              </>
            ) : (
              <>
                <h3>Sign Up</h3>
                <form onSubmit={handleSignUp}>
                  <div className="input-group">
                    <label>Username</label>
                    <input name="username" type="text" placeholder="Username" onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label>Password</label>
                    <input name="password" type="password" placeholder="Password" onChange={handleInputChange} required />
                  </div>
                  {error && <p className="error-text">{error}</p>}
                  <div className="modal-actions">
                    <button type="submit" className="btn secondary-btn">Sign Up</button>
                    <button type="button" className="btn cancel-btn" onClick={handleCloseModal}>Cancel</button>
                  </div>
                </form>
                <p className="toggle-text">
                  Already have an account? <span onClick={() => setAuthView('login')}>Log In</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;