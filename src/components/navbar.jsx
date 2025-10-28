import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/appContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../assets/styles/navbar.module.css';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  }, [navigate]);

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Serenica
        </Link>

        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>

        <div className={`${styles.menu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link to="/" className={`${styles.menuItem} ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/about" className={`${styles.menuItem} ${isActive('/about')}`}>
            About
          </Link>
          
          {user ? (
            <>
              <Link to="/profile" className={`${styles.menuItem} ${isActive('/profile')}`}>
                <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
                {user.displayName || 'Profile'}
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.menuItem} ${isActive('/login')}`}>
                Login
              </Link>
              <Link to="/signup" className={`${styles.menuItem} ${isActive('/signup')}`}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 