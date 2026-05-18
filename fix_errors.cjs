const fs = require('fs');
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace: const fetchSomething = async () => { ... }
  // With: async function fetchSomething() { ... }
  const funcRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*async\s*\((.*?)\)\s*=>\s*\{/g;
  if (funcRegex.test(content)) {
    // Reset lastIndex just in case
    funcRegex.lastIndex = 0;
    content = content.replace(funcRegex, 'async function $1($2) {');
    changed = true;
  }
  
  // Remove unused catch (err) -> catch
  const catchRegex = /catch\s*\(\s*err\s*\)\s*\{\s*console\.error\(\s*([^;]+)\s*\);/g;
  if (catchRegex.test(content)) {
    catchRegex.lastIndex = 0;
    content = content.replace(catchRegex, (match, p1) => {
      if (p1 === 'err' || p1.includes('err')) return match; 
      return 'catch (err) { console.error(err, ' + p1 + ');';
    });
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
