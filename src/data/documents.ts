import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
// Build-time detection: upload the exact reviewed filenames under public/documents/.
// Do not embed a live private Drive document or modify its permissions.
function availablePdf(name: string): string | null {
  return existsSync(resolve(process.cwd(), 'public/documents', name)) ? '/documents/' + name : null;
}
export const steeringFdrPdf = availablePdf('wufr-27-steering-fdr.pdf');
export const steering26FdrPdf = availablePdf('wufr-26-steering-fdr.pdf');
export const resumePdf = availablePdf('jesse-koeppel-resume.pdf');
