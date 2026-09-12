'use strict';
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const zlib=require('node:zlib');
const crypto=require('node:crypto');
const root=path.join(__dirname,'.runtime');
try{
  fs.rmSync(root,{recursive:true,force:true});
  fs.mkdirSync(root,{recursive:true});
  const parts=Array.from({length:4},(_,j)=>fs.readFileSync(path.join(__dirname,`payload.part${String(j+1).padStart(2,'0')}`),'utf8'));
  console.log('PAYLOAD_DIAG',parts.map((p,i)=>({part:i+1,len:p.length,sha256:crypto.createHash('sha256').update(p).digest('hex'),head:p.slice(0,20),tail:p.slice(-20)})));
  const b64=parts.join('');
  console.log('PAYLOAD_TOTAL',b64.length,crypto.createHash('sha256').update(b64).digest('hex'));
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
