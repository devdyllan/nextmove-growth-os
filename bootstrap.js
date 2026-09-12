'use strict';
const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
const root=path.join(__dirname,'.runtime');
try{fs.rmSync(root,{recursive:true,force:true});fs.mkdirSync(root,{recursive:true});cp.execFileSync('sh',['-lc',`base64 -d payload.b64 > /tmp/nextmove.tar.gz && tar -xzf /tmp/nextmove.tar.gz -C ${JSON.stringify(root)}`],{cwd:__dirname,stdio:'inherit'});}catch(e){console.error('Bootstrap extraction failed',e);process.exit(1)}
const child=cp.spawn(process.execPath,['server.js'],{cwd:root,env:process.env,stdio:'inherit'});child.on('exit',c=>process.exit(c??1));process.on('SIGTERM',()=>child.kill('SIGTERM'));process.on('SIGINT',()=>child.kill('SIGINT'));
