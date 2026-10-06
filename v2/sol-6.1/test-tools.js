#!/usr/bin/env node
'use strict';
// Reproducible fixture and archive regression checks; never write sealed artifacts.
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const ROOT = __dirname;
const results = [];
function run(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...(options.preload ? ['--require', options.preload] : []), path.join(ROOT,'tools.js'), ...args], {cwd:ROOT, env:{...process.env,...options.env}});
    let output=''; child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
    const timeout=setTimeout(()=>child.kill('SIGKILL'),45000);
    child.on('error',reject);child.on('exit',(code)=>{clearTimeout(timeout);resolve({code,output:output.trim()});});
  });
}
async function check(name, args, category, options) {
  const result=await run(args,options);
  if(category) { assert.notEqual(result.code,0,name);assert.ok(result.output.startsWith('ERRORS\n'),result.output);assert.ok(result.output.includes(`[${category}]`),result.output); }
  else { assert.equal(result.code,0,`${name}: ${result.output}`); assert.equal(result.output,'OK'); }
  results.push({name,passed:true});console.log(`PASS ${name}`);
}
const html = (body='<h1>Hello World</h1>',script='',style='')=>`<!doctype html><html lang="en"><meta charset="utf-8"><title>Fixture</title><style>${style}</style><body>${body}<script>${script}</script></body></html>`;
async function main() {
  const scratch=await fs.mkdtemp(path.join(ROOT,'.maintenance-fixtures-'));
  const rel=path.basename(scratch); let server;
  try {
    const file=async (name,source)=>{await fs.writeFile(path.join(scratch,name+'.html'),source);return `${rel}/${name}.html`;};
    const valid=await file('valid',html());
    await check('standalone dependency check',['dependency-check',valid]);
    await check('semantic DOM',['browser-test',valid]);
    for(const [name,source,category,command] of [
      ['external',html('<script src="https://example.com/x.js"></script>'),'DEPENDENCY','dependency-check'],
      ['runtime-network',html(undefined,"window['fet'+'ch']('/unexpected').catch(()=>{})"),'DEPENDENCY'],
      ['console-error',html(undefined,"console.error('fixture error')"),'CONSOLE_ERROR'],
      ['exception',html(undefined,"throw new Error('fixture exception')"),'RUNTIME_EXCEPTION'],
      ['syntax',html(undefined,'const = ;'),'STATIC_SYNTAX'],
      ['invalid-css',html(undefined,'','h1{color:not-a-color}'),'CSS'],
      ['malformed-css',html(undefined,'','h1{color:;}'),'CSS'],
      ['hidden',html('<h1 hidden>Hello World</h1>'),'DOM_VISIBILITY'],
      ['duplicate',html('<h1 id="x">Hello World</h1><p id="x">repeat</p>'),'STATIC_SYNTAX'],
      ['permission',html(undefined,'try{navigator.geolocation.getCurrentPosition(()=>{})}catch{}'),'PERMISSIONS'],
      ['stall',html(undefined,'requestAnimationFrame(()=>{})'),'ANIMATION_STALL'],
      ['invalid-evidence',html(undefined,"window.labEvidence=()=>({subject:'Hello World',passed:false})"),'GRAPHICS_RENDER'],
    ]) await check(name,[command||'browser-test',await file(name,source)],category);
    await check('valid evidence',['browser-test',await file('evidence',html(undefined,"window.labEvidence=()=>({subject:'Hello World',passed:true,mechanism:'semantic DOM',measurements:{count:1}})"))]);
    await check('trusted click',['browser-test',await file('click',html('<button id="click">Hello World</button>',`let trusted=false;document.querySelector('button').onclick=e=>trusted=e.isTrusted;window.labScenario={kind:'click',selector:'#click'};window.labInteractionEvidence=()=>({subject:'Hello World',passed:trusted,mechanism:'trusted click',measurements:{trusted}});`))]);
    const draw=`const c=document.querySelector('canvas'),ctx=c.getContext('2d');ctx.fillStyle='rgb(0,200,80)';ctx.fillRect(0,0,500,200);ctx.fillStyle='black';ctx.font='40px monospace';ctx.fillText('Hello World',20,80);`;
    const evidence=`window.labEvidence=()=>({subject:'Hello World',passed:true,mechanism:'Worker ready canvas',measurements:{ready:true}});`;
    const body='<canvas width="500" height="200">Hello World</canvas>';
    const delayed=await file('async',html(body,`window.labReady=new Promise(resolve=>{const worker=new Worker(URL.createObjectURL(new Blob(["setTimeout(()=>postMessage('ready'),900)"],{type:'text/javascript'})));worker.onmessage=async()=>{await document.fonts.ready;${draw}worker.terminate();resolve()}});${evidence}`));
    const baseline=await file('baseline',html(body,`window.labReady=document.fonts.ready.then(()=>{${draw}});${evidence}`));
    await check('async Worker labReady',['browser-test',delayed,'--wait-ms','0']);
    await check('verification JSON',['verify',delayed,rel,'--wait-ms','0']);
    const record=JSON.parse(await fs.readFile(path.join(scratch,'verification.json'),'utf8'));
    assert.deepEqual(Object.keys(record),['schemaVersion','viewport','first','second','technology','dynamic','interaction']);
    assert.equal(record.schemaVersion,1);assert.deepEqual(record.viewport,{width:1280,height:800});assert.equal(record.technology.passed,true);
    server=http.createServer(async(req,res)=>{try{res.setHeader('Content-Type','text/html');res.end(await fs.readFile(path.join(scratch,path.basename(req.url))));}catch{res.statusCode=404;res.end('missing')}});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    await check('screenshot awaits Worker readiness',['screenshot',`${base}/async.html`,`${rel}/async.png`,'--wait-ms','0']);
    await check('baseline screenshot',['screenshot',`${base}/baseline.html`,`${rel}/baseline.png`,'--wait-ms','0']);
    assert.deepEqual(await fs.readFile(path.join(scratch,'async.png')),await fs.readFile(path.join(scratch,'baseline.png')),'Screenshot must match completed canvas, not premature frame');
    await file('fonts',html(body,`Object.defineProperty(document.fonts,'ready',{value:new Promise(resolve=>setTimeout(()=>{${draw}resolve()},900))});${evidence}`));
    await check('screenshot awaits font readiness',['screenshot',`${base}/fonts.html`,`${rel}/fonts.png`,'--wait-ms','0']);
    assert.deepEqual(await fs.readFile(path.join(scratch,'fonts.png')),await fs.readFile(path.join(scratch,'baseline.png')),'Screenshot must await font readiness');
    for(const capability of ['fetch','WebSocket']) {
      const preload=path.join(scratch,`${capability}.cjs`);await fs.writeFile(preload,`globalThis.${capability}=undefined;`);
      for(const command of ['browser-test','screenshot','verify'])await check(`missing ${capability}: ${command}`,[command,valid,rel],'TEST_INFRASTRUCTURE',{preload});
    }
    await check('missing Chrome',['browser-test',valid],'TEST_INFRASTRUCTURE',{env:{LAB_CHROME:path.join(scratch,'missing')}});
    // Simulate a host with Chrome only on PATH; keep the actual browser unmodified.
    const browser=process.env.LAB_CHROME||'/usr/bin/chromium';
    await fs.symlink(browser,path.join(scratch,'chromium'));
    const preload=path.join(scratch,'path-only.cjs');
    await fs.writeFile(preload,`const fs=require('node:fs/promises');const stat=fs.stat;fs.stat=async function(p,...a){if(!String(p).startsWith(${JSON.stringify(scratch)}) && /(?:chromium|chrome)/i.test(String(p))){const e=new Error('simulated absent known path');e.code='ENOENT';throw e}return stat.call(this,p,...a)};`);
    await check('PATH Chrome fallback',['browser-test',valid],null,{preload,env:{LAB_CHROME:'',PATH:`${scratch}${path.delimiter}${process.env.PATH}`}});
    if(process.argv.includes('--archive')) {
      for(let n=1;n<=75;n++) {
        const id=String(n).padStart(3,'0');
        await check(`archive ${id}`,['browser-test',`${id}/${id}.html`]);
      }
      for(const id of ['001','019','022','024','025','038','045','048','067']) {
        const dir=path.join(scratch,id);await fs.mkdir(dir);
        await check(`archive evidence ${id}`,['verify',`${id}/${id}.html`,`${rel}/${id}`]);
      }
    }
    if(process.env.LAB_VALIDATION_OUTPUT) await fs.writeFile(process.env.LAB_VALIDATION_OUTPUT,JSON.stringify({node:process.version,results},null,2)+'\n');
    console.log(`OK (${results.length} checks)`);
  } finally {
    if(server) await new Promise(resolve=>server.close(resolve));
    await fs.rm(scratch,{recursive:true,force:true});
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
