import sharp from 'sharp';
const dir='public/figures/fsae/binder/';
const {data,info}=await sharp(dir+'suspension-render.jpg').removeAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h,channels:c}=info;
const n=w*h, seen=new Uint8Array(n), alpha=new Uint8Array(n).fill(255), queue=new Int32Array(n);
const dark=i=>Math.max(data[i*c],data[i*c+1],data[i*c+2])<=18;
// Remove large connected near-black regions only, including enclosed background gaps.
// Small dark mechanical details are retained. Original RGB pixels and JPEG are unchanged.
for(let i=0;i<n;i++){
 if(seen[i]||!dark(i))continue;
 let head=0,tail=1;queue[0]=i;seen[i]=1;
 while(head<tail){
  const k=queue[head++],x=k%w;
  for(const p of [x>0?k-1:-1,x<w-1?k+1:-1,k-w,k+w]){
   if(p>=0&&p<n&&!seen[p]&&dark(p)){seen[p]=1;queue[tail++]=p;}
  }
 }
 if(tail>=400)for(let j=0;j<tail;j++)alpha[queue[j]]=0;
}
const rgba=Buffer.alloc(n*4);
let removed=0;
for(let i=0;i<n;i++){rgba[i*4]=data[i*c];rgba[i*4+1]=data[i*c+1];rgba[i*4+2]=data[i*c+2];rgba[i*4+3]=alpha[i];if(!alpha[i])removed++;}
if(removed/n<0.5||removed/n>0.95)throw Error('Unexpected background mask coverage');
await sharp(rgba,{raw:{width:w,height:h,channels:4}}).webp({lossless:true}).toFile(dir+'suspension-render-transparent.webp');
console.log('CAD background masked:',(removed/n*100).toFixed(1)+'%');
