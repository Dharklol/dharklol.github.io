import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
// Resolve the owner's actual upload, without changing its appearance.
const root=resolve(process.cwd(),'public');
const supported=/^meincar\.(jpe?g|png|webp|avif)$/i;
function find(dir:string):string|null {
  for(const e of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    if(e.isFile()&&supported.test(e.name))return dir+'/'+e.name;
    if(e.isDirectory()){const result=find(dir+'/'+e.name);if(result)return result;}
  }
  return null;
}
const actual=find(root);
export const portrait=actual?{src:actual.slice(root.length).split('/').map(encodeURIComponent).join('/'),alt:'Jesse Koeppel in the Formula SAE car',personal:true}:{src:'/figures/fsae/photos/car-on-track.jpg',alt:'WashU Racing Formula SAE car on course',personal:false};
