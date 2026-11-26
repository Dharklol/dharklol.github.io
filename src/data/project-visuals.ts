import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const dir='/figures/fsae/';
function asset(path:string){return existsSync(resolve(process.cwd(),'public'+path))?path:null;}
export const suspensionRender=asset(dir+'binder/suspension-render-transparent.webp');
const photos=[
 {file:'car-on-track.jpg',label:'COMPETITION / CAR 125',alt:'WashU Racing car on a paved course with a helmeted driver',position:'50% 52%'},
 {file:'team-and-car.jpg',label:'WASHU RACING / TEAM',alt:'Team members with the Formula SAE car',position:'50% 59%'},
 {file:'campus-outreach.jpg',label:'CAMPUS / OUTREACH',alt:'Team members talking with visitors beside the race car',position:'50% 52%'},
 {file:'competition-setup.jpg',label:'COMPETITION / SETUP',alt:'Team preparing the car and setup equipment at night',position:'50% 50%'},
 {file:'steering-build.jpg',label:'STEERING / ASSEMBLY',alt:'Installed steering column, bevel box and rack during assembly',position:'50% 50%'},
 {file:'suspension-failure.jpg',label:'SUSPENSION / FAILURE EVIDENCE',alt:'Close-up of visibly damaged suspension member',position:'50% 48%'},
].map(p=>({...p,src:asset(dir+'photos/'+p.file)??asset(dir+'photos/portfolio-photos/'+p.file)}));
export const fsaePhotos=photos.filter(p=>p.src!==null);
export const fsaeSlides=[
 ...fsaePhotos.filter(p=>['car-on-track.jpg','team-and-car.jpg','competition-setup.jpg','campus-outreach.jpg'].includes(p.file)).map(p=>({src:p.src!,label:p.label,alt:p.alt,position:p.position,cad:false})),
 ...(suspensionRender?[{src:suspensionRender,label:'SUSPENSION / CAD RENDER',alt:'CAD render of front and rear suspension assemblies',position:'center',cad:true}]:[]),
];
export const dynamicsSlides=[
 {src:'/figures/vehicle-dynamics/rack-demand-original.svg',label:'SOLVER / RACK DEMAND',alt:'Original software rack demand report',position:'center',cad:false,plot:true},
 {src:'/figures/vehicle-dynamics/heading-split-original.svg',label:'SOLVER / HEADING SPLIT',alt:'Original front heading split report',position:'center',cad:false,plot:true},
 {src:'/figures/vehicle-dynamics/quarter-car-bump.svg',label:'VERIFICATION / QUARTER CAR',alt:'Manufactured quarter-car response plot',position:'center',cad:false,plot:true},
];
