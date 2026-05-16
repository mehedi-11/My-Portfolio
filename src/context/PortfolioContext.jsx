import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    experience: [],
    education: [],
    personalInfo: {},
    skills: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, expRes, eduRes, skillsRes, settingsRes] = await Promise.all([
          portfolioAPI.getProjects(),
          portfolioAPI.getExperience(),
          portfolioAPI.getEducation(),
          portfolioAPI.getSkills(),
          portfolioAPI.getSettings()
        ]);

        // Format skills into categorized object like the original static data
        const formattedSkills = skillsRes.data.reduce((acc, curr) => {
          acc[curr.category.toLowerCase()] = curr.items;
          return acc;
        }, {});

        setData({
          projects: projectsRes.data,
          experience: expRes.data,
          education: eduRes.data,
          skills: formattedSkills,
          personalInfo: settingsRes.data
        });
      } catch (err) {
        console.error("Failed to fetch from backend", err);
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
