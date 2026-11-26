import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const dir='/figures/fsae/';
function asset(path:string){return existsSync(resolve(process.cwd(),'public'+path))?path:null;}
const photos=[
 {file:'car-on-track.jpg',label:'COMPETITION / CAR 125',alt:'WashU Racing car on a paved course with a helmeted driver',position:'50% 52%'},
 {file:'team-and-car.jpg',label:'WASHU RACING / TEAM',alt:'Team members with the Formula SAE car',position:'50% 59%'},
 {file:'campus-outreach.jpg',label:'CAMPUS / OUTREACH',alt:'Team members talking with visitors beside the race car',position:'50% 52%'},
 {file:'competition-setup.jpg',label:'COMPETITION / SETUP',alt:'Team preparing the car and setup equipment at night',position:'50% 50%'},
 {file:'steering-build.jpg',label:'STEERING / ASSEMBLY',alt:'Installed steering column, bevel box and rack during assembly',position:'50% 50%'},
 {file:'suspension-failure.jpg',label:'SUSPENSION / FAILURE EVIDENCE',alt:'Close-up of visibly damaged suspension member',position:'50% 48%'},
].map(p=>({...p,src:asset(dir+'photos/'+p.file)??asset(dir+'photos/portfolio-photos/'+p.file)}));
export const fsaePhotos=photos.filter(p=>p.src!==null);
export const fsaeSlides=fsaePhotos.filter(p=>['team-and-car.jpg','campus-outreach.jpg','competition-setup.jpg'].includes(p.file)).sort((a,b)=>['team-and-car.jpg','campus-outreach.jpg','competition-setup.jpg'].indexOf(a.file)-['team-and-car.jpg','campus-outreach.jpg','competition-setup.jpg'].indexOf(b.file)).map(p=>({src:p.src!,alt:p.alt,position:p.position}));
export const dynamicsSlides=[
 {src:'/figures/vehicle-dynamics/rack-demand-delta.svg',alt:'Signed rack demand sensitivity relative to reference',position:'center'},
 {src:'/figures/vehicle-dynamics/heading-split-delta.svg',alt:'Signed front heading split sensitivity relative to reference',position:'center'},
 {src:'/figures/vehicle-dynamics/quarter-car-bump.svg',alt:'Manufactured quarter-car bump response',position:'center'},
];
export const wydownSlides=[
 {src:'/figures/wydown/recorder-burnin.svg',alt:'Historical market data recorder burn-in',position:'center'},
 {src:'/figures/wydown/collection-latency.svg',alt:'Historical EC2 market data collection benchmark',position:'center'},
];