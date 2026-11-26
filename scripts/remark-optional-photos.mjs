import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const photos={
 'car-on-track':['WashU Racing car on course','Competition vehicle on course.'],
 'steering-build':['Steering column, bevel box and rack during assembly','Installed steering hardware during assembly and fitment.'],
 'suspension-failure':['Visible damage to a suspension member','Observed suspension damage. The photograph alone does not establish the root cause.'],
 'competition-setup':['Team preparing vehicle setup equipment at night','Team vehicle preparation during competition.'],
 'campus-outreach':['Team members talking with visitors beside the race car','Campus outreach and discussion of the team vehicle.']
};
export default function optionalPhotos(){
 return tree=>{
  tree.children=tree.children.flatMap(node=>{
   if(node.type!=='html')return [node];
   const match=node.value.trim().match(/^<!-- portfolio-photo:([a-z-]+) -->$/);
   if(!match)return [node];
   const key=match[1],meta=photos[key];if(!meta)return [];
   const dir='/figures/fsae/photos/';
   const src=[dir+key+'.jpg',dir+'portfolio-photos/'+key+'.jpg'].find(p=>existsSync(resolve(process.cwd(),'public'+p)));
   if(!src)return [];
   return [{type:'html',value:'<figure class="inline-photo"><a href="'+src+'"><img src="'+src+'" alt="'+meta[0]+'" loading="lazy"></a><figcaption>'+meta[1]+'</figcaption></figure>'}];
  });
 };
}
