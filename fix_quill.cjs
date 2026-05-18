const fs = require('fs');

// Fix BlogManager
const bm = 'e:/xampp/htdocs/My-Portfolio/src/components/admin/BlogManager.jsx';
let c = fs.readFileSync(bm, 'utf8');
c = c.replace(/react-quill\/dist\/quill\.snow\.css/g, 'react-quill-new/dist/quill.snow.css');
c = c.replace(/from 'react-quill'/g, "from 'react-quill-new'");
c = c.replace(/require\('react-quill'\)/g, "require('react-quill-new')");
fs.writeFileSync(bm, c, 'utf8');
console.log('BlogManager updated');

// Fix BlogView
const bv = 'e:/xampp/htdocs/My-Portfolio/src/pages/BlogView.jsx';
let c2 = fs.readFileSync(bv, 'utf8');
c2 = c2.replace(/react-quill\/dist\/quill\.snow\.css/g, 'react-quill-new/dist/quill.snow.css');
c2 = c2.replace(/from 'react-quill'/g, "from 'react-quill-new'");
fs.writeFileSync(bv, c2, 'utf8');
console.log('BlogView updated');
