'use strict';
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const zlib=require('node:zlib');
const root=path.join(__dirname,'.runtime');
try{
  fs.rmSync(root,{recursive:true,force:true});
  fs.mkdirSync(root,{recursive:true});
  const b64=Array.from({length:4},(_,j)=>fs.readFileSync(path.join(__dirname,`payload.part${String(j+1).padStart(2,'0')}`),'utf8')).join('');
  const br=Buffer.from(b64,'base64');
  const tar=zlib.brotliDecompressSync(br);
  const tarPath='/tmp/nextmove.tar';
  fs.writeFileSync(tarPath,tar);
  cp.execFileSync('tar',['-xf',tarPath,'-C',root],{stdio:'inherit'});
}catch(e){console.error('Bootstrap extraction failed',e);process.exit(1)}
const child=cp.spawn(process.execPath,['server.js'],{cwd:root,env:process.env,stdio:'inherit'});
child.on('exit',c=>process.exit(c??1));
process.on('SIGTERM',()=>child.kill('SIGTERM'));
process.on('SIGINT',()=>child.kill('SIGINT'));
