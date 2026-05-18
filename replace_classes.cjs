const fs = require('fs');
const files = [
  'src/components/admin/BlogManager.jsx',
  'src/components/admin/EducationManager.jsx',
  'src/components/admin/ExperienceManager.jsx',
  'src/components/admin/MessageManager.jsx',
  'src/components/admin/ProposalManager.jsx',
  'src/components/admin/ProjectManager.jsx',
  'src/components/admin/SkillManager.jsx'
];

files.forEach(f => {
  const p = 'e:/xampp/htdocs/My-Portfolio/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/opacity-0 group-hover:opacity-100 transition-opacity/g, 'opacity-100');
  fs.writeFileSync(p, c, 'utf8');
  console.log('Fixed opacity in:', f);
});
console.log('Done!');
