const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'components', 'admin'),
  path.join(__dirname, 'src', 'pages')
];

// Classes to replace
const replacements = [
  { regex: /sky-500/g, replacement: 'rose-500' },
  { regex: /sky-600/g, replacement: 'rose-600' },
  { regex: /sky-700/g, replacement: 'rose-700' },
  { regex: /sky-50/g, replacement: 'rose-50' },
  { regex: /sky-100/g, replacement: 'rose-100' },
  { regex: /sky-200/g, replacement: 'rose-200' },
  { regex: /emerald-500/g, replacement: 'rose-500' },
  { regex: /emerald-600/g, replacement: 'rose-600' },
  { regex: /emerald-50/g, replacement: 'rose-50' },
  { regex: /shadow-(sm|md|lg|xl|2xl|inner|none|slate-\d+|rose-\d+)/g, replacement: '' },
  { regex: /text-slate-400/g, replacement: 'text-slate-800' },
  { regex: /text-slate-500/g, replacement: 'text-slate-800' },
  { regex: /text-slate-300/g, replacement: 'text-slate-800' },
  { regex: /bg-\[#f8fafc\]/g, replacement: 'bg-white' },
  { regex: /bg-slate-50\/50/g, replacement: 'bg-white' },
  // we want to keep some bg-slate-50 if it's for borders/inputs, but let's change pure backgrounds
];

function processFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      // Don't modify the public pages like ProjectsPage or BlogView or Home or Blogs unless needed
      if (dir.includes('pages') && !['Dashboard.jsx', 'AdminLogin.jsx'].includes(file)) {
        continue;
      }
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      // Clean up multiple spaces created by removing shadow classes
      content = content.replace(/\s{2,}/g, ' ');
      // Fix potential issues like className=" "
      content = content.replace(/className="\s+/g, 'className="');
      content = content.replace(/\s+"/g, '"');
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Processed: ${fullPath}`);
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processFiles(dir);
  }
}
console.log('Class replacement complete.');
