import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaComments, 
  FaBook, 
  FaCalendarAlt, 
  FaTasks, 
  FaChartLine,
  FaUsers,
  FaQuestionCircle,
  FaEnvelope
} from 'react-icons/fa';
import './Sidebar.css';
import lightLogo from '../../assets/images/learnlink-logo.png';
import darkLogo from '../../assets/images/learnlink-logo-dark.png';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const logo = isDarkMode ? darkLogo : lightLogo;

  const sections = [
    {
      title: 'Main',
      items: [
        { path: '/home', icon: <FaHome />, label: 'Home' },
        { path: '/chatrooms', icon: <FaComments />, label: 'Chatrooms' },
        { path: '/direct-messages', icon: <FaEnvelope />, label: 'Direct Messages' },
        { path: '/connections', icon: <FaUsers />, label: 'Connections' }
      ]
    },
    {
      title: 'Academic',
      items: [
        { path: '/courses', icon: <FaBook />, label: 'Courses' },
        { path: '/assignments', icon: <FaTasks />, label: 'Assignments' }
      ]
    },
    {
      title: 'Activities',
      items: [
        { path: '/events', icon: <FaCalendarAlt />, label: 'Events' },
        { path: '/progress', icon: <FaChartLine />, label: 'Progress' }
      ]
    },
    {
      title: 'Support',
      items: [
        { path: '/support', icon: <FaQuestionCircle />, label: 'Support Center' }
      ]
    }
  ];
  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/home">
          <img src={logo} alt="LearnLink" className="logo" />
          <span className="logo-text">LearnLink</span>
        </Link>
      </div>

      <nav className="nav-links">
        {sections.map((section, index) => (
          <div key={index} className="nav-section">
            <h3 className="section-title">{section.title}</h3>
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
