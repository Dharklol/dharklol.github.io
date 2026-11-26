import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const dir='/figures/fsae/binder/';
function asset(name: string) { return existsSync(resolve(process.cwd(),'public'+dir+name)) ? dir+name : null; }
export const suspensionRender=asset('suspension-render.jpg');
export const binderFigures=[
 {name:'ackermann-optimization.jpg',title:'Steering optimization',caption:'WUFR-26 design binder, p. 42. Steering-output preservation and modeled steering-effort trade study.'},
 {name:'arb-instron.jpg',title:'Anti-roll bar bench testing',caption:'Binder, p. 47. Section-property calculation and recorded load-deflection curves for five settings.'},
 {name:'understeer-curves.jpg',title:'Directional steering response',caption:'Binder, p. 48. Original CW and CCW response plots; directional signs are retained.'},
 {name:'load-transfer-sensitivity.jpg',title:'Load transfer sensitivity',caption:'Binder, p. 50. Calculated sensitivity contours, not measured on-car load transfer.'},
 {name:'endurance-gg.jpg',title:'Endurance telemetry',caption:'Binder, p. 8. Vehicle acceleration scatter, speed distribution and track map; team test evidence.'},
].map(item=>({...item,src:asset(item.name)})).filter(item=>item.src!==null);
