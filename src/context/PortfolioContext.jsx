import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../api';
import * as staticData from '../data/portfolio';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    experience: [],
    education: [],
    personalInfo: staticData.personalInfo, // Fallback to static for info not in DB yet
    skills: staticData.skills
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: backendData } = await portfolioAPI.getAll();
        setData(prev => ({
          ...prev,
          projects: backendData.projects.length > 0 ? backendData.projects : staticData.projects,
          experience: backendData.experience.length > 0 ? backendData.experience : staticData.experience,
          education: backendData.education.length > 0 ? backendData.education : staticData.education,
        }));
      } catch (err) {
        console.error("Failed to fetch from backend, using static data", err);
        setData(prev => ({
          ...prev,
          projects: staticData.projects,
          experience: staticData.experience,
          education: staticData.education,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
