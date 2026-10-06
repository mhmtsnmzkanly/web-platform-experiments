#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
# Node built-ins only; PAGES_BASE optionally makes demo links absolute.
node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const dirs = p => fs.readdirSync(p, {withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort((a,b)=>a.localeCompare(b,'en',{numeric:true}));
const exists = p => fs.existsSync(p);
const link = (label,p) => `[${label}](${p})`;
const demo = (model,p) => process.env.PAGES_BASE ? `${process.env.PAGES_BASE.replace(/\/$/,'')}/${model}/${p}` : p;
const title = (p,id) => {
  const m = exists(p) && fs.readFileSync(p,'utf8').match(/^#{1,3}\s+(.+)$/m);
  return (m ? m[1].replace(/^(?:Hello World Lab|Technical Report|Experiment \d+(?: Technical Report)?|Teknik Rapor|Deney \d+(?: Teknik Raporu| Raporu)?)\s*[—–:\-]\s*/,'') : `Experiment ${id}`).replace(/[<>]/g,'').replace(/\|/g,'\\|');
};
let root = '# Web Platform Experiments\n\nStandalone experiments exploring native HTML, CSS, SVG, Canvas, graphics, animation, interaction, and browser APIs, grouped by version and model/run.\n\nEach run owns its experiment gallery and artifact links. Regenerate this index and the galleries with `./generate-readme.sh`.\n';
for (const version of dirs('.').filter(x=>/^v\d+$/.test(x))) {
  root += `\n## ${version}\n\n`;
  if (exists(`${version}/PROMPT.md`)) root += `Prompt: ${link('View prompt',`${version}/PROMPT.md`)}\n\n`;
  for (const model of dirs(version)) {
    const base = `${version}/${model}`;
    if (exists(`${base}/package.json`)) {
      // Preserve the authored showcase documentation and built demo.
      if (!exists(`${base}/README.md`)) fs.writeFileSync(`${base}/README.md`,`# ${model}\n\nPackage showcase.\n\n${exists(`${base}/dist/index.html`) ? link('Demo','dist/index.html') : ''}\n`);
      root += `- ${link(model,`${base}/README.md`)} — package showcase${exists(`${base}/dist/index.html`) ? ` · ${link('Demo',process.env.PAGES_BASE ? demo(base,'dist/index.html') : `${base}/dist/index.html`)}` : ''}\n`;
      continue;
    }
    const all = dirs(base), experiments = all.filter(x=>/^\d{3}$/.test(x));
    const revisions = all.filter(x=>/^\d{3}R(?:[2-9]|[1-9]\d+)?$/.test(x));
    const sealed = experiments.filter(id=>exists(`${base}/${id}/${id}.html`)).length;
    root += `- ${link(model,`${base}/README.md`)} — ${experiments.length} base experiments (${sealed} sealed, ${experiments.length-sealed} unfinished)\n`;
    let out = `# ${model} — ${version}\n\n${link('Repository index','../../README.md')}${exists(`${version}/PROMPT.md`) ? ` · ${link('Version prompt','../PROMPT.md')}` : ''}\n\n**${experiments.length} base experiments** · ${sealed} sealed · ${experiments.length-sealed} unfinished · ${revisions.length} historical revisions (excluded from experiment count).\n\nSealed means the matching \`NNN/NNN.html\` exists. Development demos are unfinished.\n\n`;
    for (const id of experiments) {
      const dir = `${base}/${id}`, complete = exists(`${dir}/${id}.html`);
      const html = complete ? `${id}.html` : exists(`${dir}/${id}.dev.html`) ? `${id}.dev.html` : null;
      const files = fs.readdirSync(dir).sort();
      const shot = files.includes('screenshot.png') ? 'screenshot.png' : files.find(x=>/^screenshot.*\.(png|jpe?g|webp)$/i.test(x));
      const links = [];
      if (html) links.push(link(complete?'Demo':'Development demo',demo(base,`${id}/${html}`)));
      for (const [label,file] of [['Report','report.md'],['Journal','journal.md'],['Screenshot',shot]]) if (file && exists(`${dir}/${file}`)) links.push(link(label,`${id}/${file}`));
      for (const rev of revisions.filter(x=>x.slice(0,3)===id)) links.push(link(`Revision ${rev}`,`${rev}/`));
      out += `## ${id} — ${title(`${dir}/report.md`,id)}${complete ? '' : ' (unfinished)'}\n\n${links.join(' · ')}\n\n`;
      if (shot) out += `![Experiment ${id}](${id}/${shot})\n\n`;
    }
    const orphans = revisions.filter(x=>!experiments.includes(x.slice(0,3)));
    if (orphans.length) out += `## Unassociated historical revisions\n\n${orphans.map(x=>`- ${link(x,`${x}/`)}`).join('\n')}\n`;
    fs.writeFileSync(`${base}/README.md`,out);
  }
}
fs.writeFileSync('README.md',root);
console.log('Generated repository index and model galleries (authored package READMEs preserved).');
NODE
