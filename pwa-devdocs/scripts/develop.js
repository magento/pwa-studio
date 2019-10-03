const { exec } = require('child_process');

const workspace = require('browser-sync').create('workspace');
const site = require('browser-sync').create('site');

function fileChangeHandler(_filesChanged) {
    console.log('\nFile(s) change. Rebuilding...');
    exec('npm run build', buildCallback);
}

function buildCallback(_error, stdout, _stderr) {
    console.log(stdout);
    site.reload();
}

workspace
    .watch('./src/**/*.md', { ignored: /.*\/auto-generated\/.*/})
    .on('change', fileChangeHandler);
workspace.watch('./src/**/*.html').on('change', fileChangeHandler);
workspace.watch('./src/_scss/**/*.scss').on('change', fileChangeHandler);
workspace.watch('./src/_js/**/*.js').on('change', fileChangeHandler);

site.init({
    server: './_site'
});
