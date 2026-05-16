import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    experience: [],
    education: [],
    personalInfo: {},
    skills: {
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      raw: [] // Keep original objects for title/description
    }
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

        const formattedSkills = {
          frontend: [],
          backend: [],
          database: [],
          tools: [],
          raw: skillsRes.data || []
        };
        
        if (skillsRes.data && Array.isArray(skillsRes.data)) {
          skillsRes.data.forEach(curr => {
            if (curr.category) {
              formattedSkills[curr.category.toLowerCase()] = curr.items || [];
            }
          });
        }



        setData({
          projects: projectsRes.data || [],
          experience: expRes.data || [],
          education: eduRes.data || [],
          skills: formattedSkills,
          personalInfo: settingsRes.data || {}
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
