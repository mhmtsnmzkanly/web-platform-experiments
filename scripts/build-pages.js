'use strict';
// Stage tracked files only: never publish local dependencies or Git metadata.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const output = process.argv[2] || '_site';
if (fs.existsSync(output)) throw new Error('Output directory must not already exist');
fs.mkdirSync(output, {recursive:true});
const files = execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean);
for (const file of files.filter(f=>f==='README.md' || /^v\d+\//.test(f))) {
  const target=path.join(output,file); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.copyFileSync(file,target);
}
const escape = s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const inline = s=>escape(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img alt="$1" src="$2" loading="lazy">').replace(/\[([^\]]*)\]\(([^)]+)\)/g,(_,text,url)=>`<a href="${url.replace(/README\.md$/, 'index.html')}">${text}</a>`).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
for (const file of files.filter(f=>/(^|\/)README\.md$/.test(f) && (f==='README.md'||/^v\d+\//.test(f)))) {
  let code=false;
  const body=fs.readFileSync(file,'utf8').split('\n').map(line=>{
    if(/^```/.test(line)){code=!code;return code?'<pre><code>':'</code></pre>';}
    if(code)return escape(line)+'\n';
    const heading=line.match(/^(#{1,6})\s+(.*)/);if(heading)return `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;
    if(/^[-*] /.test(line))return `<ul><li>${inline(line.slice(2))}</li></ul>`;
    return line.trim()?`<p>${inline(line)}</p>`:'';
  }).join('\n');
  fs.writeFileSync(path.join(output,path.dirname(file),'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(path.dirname(file)==='.'?'Web Platform Experiments':path.dirname(file))}</title><style>body{max-width:1000px;margin:40px auto;padding:0 24px;font:17px/1.6 system-ui}img{max-width:100%;height:auto}pre{overflow:auto}a{color:#165bb6}</style><main>${body}</main></html>\n`);
}
// Directory links (revisions and showcase source/build folders) need indexes.
const directories = new Set();
for (const file of files.filter(f=>/^v\d+\//.test(f))) {
  for (let dir=path.dirname(file); dir!=='.'; dir=path.dirname(dir)) directories.add(dir);
}
for (const dir of [...directories].sort()) {
  const target=path.join(output,dir,'index.html');
  if (fs.existsSync(target)) continue;
  const entries=fs.readdirSync(path.join(output,dir),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'));
  fs.writeFileSync(target,`<!doctype html><meta charset="utf-8"><title>${escape(dir)}</title><h1>${escape(dir)}</h1><ul>${entries.map(e=>`<li><a href="${escape(e.name)}${e.isDirectory()?'/':''}">${escape(e.name)}</a></li>`).join('')}</ul>`);
}
// Correct the prebuilt showcase's root-relative Vite assets in the staged copy.
const showcase=path.join(output,'v2/aistudio-gemini-3.8/dist/index.html');
if(fs.existsSync(showcase))fs.writeFileSync(showcase,fs.readFileSync(showcase,'utf8').replace(/(["'])\/assets\//g,'$1./assets/'));
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Staged ${files.length} tracked archive entries and README navigation`);
