import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: 'https://dharklol.github.io',
  output: 'static',
  trailingSlash: 'always',
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
});
