/* eslint-disable @typescript-eslint/no-require-imports -- This standalone CommonJS harness installs a synchronous require.extensions TypeScript transpilation hook before loading the tested modules; ESM imports bypass that hook. */
const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const art=require('../app/games/manna-trail/trail-art.ts');
const d=require('../app/games/escape-room-daniel/game.ts');
let checks=0; const check=f=>{f();checks++};
for(const dpr of [1,2])for(const size of [312,382,752])for(const cellPos of [[0,0],[20,0],[0,20],[20,20],[10,10]])check(()=>{
 const cell=size*dpr/21, ox=4*dpr,oy=4*dpr;
 const l=art.wordLabelLayout(cell,dpr,115*dpr,ox+cellPos[0]*cell,oy+cellPos[1]*cell,ox,oy,size*dpr);
 assert(l.height>=24*dpr);assert(l.x-l.width/2>=ox-1e-8);assert(l.x+l.width/2<=ox+size*dpr+1e-8);
 assert(l.y-l.height/2>=oy-1e-8);assert(l.y+l.height/2<=oy+size*dpr+1e-8);
});
for(const lang of ['en','ru'])check(()=>{
 let s=d.reducer(d.initialState(lang),{type:'start'});
 s=d.reducer(s,{type:'tile',index:0});s=d.reducer(s,{type:'tile',index:1});
 const before=[...s.tiles];s=d.reducer(s,{type:'inspect'});assert(s.inspected);
 s=d.reducer(s,{type:'inspect'});assert(!s.inspected);assert.deepEqual(s.tiles,before);
 s=d.reducer(s,{type:'undo',index:0});assert.deepEqual(s.tiles,[1]);
 s=d.reducer(s,{type:'check'});assert.equal(s.cleared.length,0);
});
check(()=>{
 const calls=[];const ctx=new Proxy({},{get:(_,k)=> (...args)=>{calls.push([k,...args]);},set:()=>true});
 art.drawTraveler(ctx,0,0,18,true,0);art.drawTraveler(ctx,0,0,18,false,1);art.drawSand(ctx,0,0,382);
 assert(calls.some(c=>c[0]==='clip'));assert.equal(calls.filter(c=>c[0]==='bezierCurveTo').length,6);
 assert(calls.filter(c=>c[0]==='stroke').length>=8);
 for(const call of calls)for(const arg of call.slice(1))if(typeof arg==='number')assert(Number.isFinite(arg));
});
check(()=>{
 const css=fs.readFileSync('app/games/escape-room-daniel/room.module.css','utf8');
 assert(css.includes('grid-template-columns:112px minmax(0,1fr)'));
 assert(css.includes('.active .relicViewport{height:104px}'));
 assert(css.includes('font-size:1rem;line-height:1.5'));
 assert(css.includes('overflow-y:auto'));assert(!css.includes('flex:0 0 30%'));
});
console.log(`PASS ${checks} refinement checks: label containment at portrait/landscape DPRs, reversible EN/RU inspection/undo, finite drawing commands, compact accessible CSS contracts. Not browser visual proof.`);
