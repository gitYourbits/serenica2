import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../assets/styles/chatbotNav.module.css';
import { FaBrain, FaHeart, FaBriefcase } from 'react-icons/fa';

function ChatbotNav() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <div className={styles.chatbotNav}>
      <h2 className={styles.title}>Our AI Therapists</h2>
      <div className={styles.navLinks}>
        <Link to="/cbtchat" className={`${styles.navLink} ${isActive('/cbtchat')}`}>
          <FaBrain className={styles.icon} />
          <span>Cognitive Therapy</span>
        </Link>
        <Link to="/mindchat" className={`${styles.navLink} ${isActive('/mindchat')}`}>
          <FaHeart className={styles.icon} />
          <span>Mindfulness</span>
        </Link>
        <Link to="/careerchat" className={`${styles.navLink} ${isActive('/careerchat')}`}>
          <FaBriefcase className={styles.icon} />
          <span>Career Coach</span>
        </Link>
      </div>
    </div>
  );
}

export default ChatbotNav; 