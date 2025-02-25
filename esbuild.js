import * as esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['index.js'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm', // Output format: ESM
    platform: 'node', // Target platform: Node.js
    minify: true,
    minifyWhitespace: true,
    minifySyntax: true,
    external: ['node:fs', 'node:path'] // Exclude Node.js built-ins from bundling
  })
  .catch(() => process.exit(1));
