const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=__dirname, DB=path.join(ROOT,'inventory-data.json');
const initial={tags:[],staff:['担当者A','担当者B','担当者C','管理者']};
function read(){try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return initial}}
function write(v){const tmp=DB+'.tmp';fs.writeFileSync(tmp,JSON.stringify(v,null,2));fs.renameSync(tmp,DB)}
function body(req){return new Promise((ok,bad)=>{let s='';req.on('data',c=>{s+=c;if(s.length>2e6)req.destroy()});req.on('end',()=>{try{ok(JSON.parse(s||'{}'))}catch(e){bad(e)}})})}
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{try{
 if(req.url==='/api/state'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify(read()))}
 if(req.url==='/api/state'&&req.method==='PUT'){const v=await body(req);if(!Array.isArray(v.tags)||!Array.isArray(v.staff))throw Error('invalid state');write(v);res.writeHead(204);return res.end()}
 if(req.url==='/api/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true}))}
 let u=req.url.split('?')[0];if(u==='/'||u.startsWith('/tag/'))u='/index.html';const f=path.normalize(path.join(ROOT,u));if(!f.startsWith(ROOT)||!fs.existsSync(f)){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(f).pipe(res)
 }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message}))}});
const port=process.env.PORT||8080;server.listen(port,()=>console.log(`Inventory server: http://localhost:${port}`));
