#!/bin/bash
# todo(paales): Move the generated packages a separate repository or commit them back to Magento.

# Clean up all .d.ts files
find packages -name '*.d.ts' -not -path "*/__*" -not -path "*node_modules*" -not -path "*/.*" | xargs rm

find packages/venia-ui/ -name '*.js' -not -path "*/__*" -not -path "*node_modules*" -not -path "*/.*" | xargs $(yarn bin)/tsc --declaration --allowJs --emitDeclarationOnly --esModuleInterop -module esnext --moduleResolution node --outDir packages/venia-ui/lib
echo "export * from './lib/index'" > packages/venia-ui/index.d.ts

find packages/peregrine/ -name '*.js' -not -path "*/__*" -not -path "*node_modules*" -not -path "*/.*" | xargs $(yarn bin)/tsc --declaration --allowJs --emitDeclarationOnly --esModuleInterop -module esnext --moduleResolution node --outDir packages/peregrine/lib
echo "export * from './lib/index'" > packages/peregrine/index.d.ts

# find packages/pagebuilder/ -name '*.js' -not -path "*/__*" -not -path "*node_modules*" -not -path "*/.*" | xargs $(yarn bin)/tsc --declaration --allowJs --emitDeclarationOnly --esModuleInterop -module esnext --moduleResolution node --outDir packages/pagebuilder/lib
# echo "export * from './lib/index'" > packages/pagebuilder/index.d.ts

yarn prettier --write --loglevel silent packages/**/*.d.ts
