const fs = require('fs');
const files = [
  'src/components/admin/BlogManager.jsx',
  'src/components/admin/EducationManager.jsx',
  'src/components/admin/ExperienceManager.jsx',
  'src/components/admin/MessageManager.jsx',
  'src/components/admin/ProposalManager.jsx',
  'src/components/admin/ProjectManager.jsx',
  'src/components/admin/SkillManager.jsx',
  'src/components/admin/ActivityLog.jsx',
];

files.forEach(f => {
  const path = 'e:/xampp/htdocs/My-Portfolio/' + f;
  let c = fs.readFileSync(path, 'utf8');

  // Add AdminLoader import if not already present
  if (!c.includes('AdminLoader')) {
    c = c.replace(
      "import { useState, useEffect } from 'react';",
      "import { useState, useEffect } from 'react';\nimport AdminLoader from './AdminLoader';"
    );
    // Also handle single-line bundled imports
    if (!c.includes('AdminLoader')) {
      c = c.replace(
        /import \{ useState, useEffect \} from 'react'; /,
        "import { useState, useEffect } from 'react'; import AdminLoader from './AdminLoader'; "
      );
    }
  }

  // Replace the Loader2 spinner div with AdminLoader
  const loaderPattern = `<div className="flex justify-center p-20"><Loader2 className="animate-spin text-rose-600" size={40} /></div>`;
  c = c.split(loaderPattern).join('<AdminLoader />');

  fs.writeFileSync(path, c, 'utf8');
  console.log('Updated:', f);
});
console.log('All done!');
