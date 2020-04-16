const ghpages = require('gh-pages');
const { execSync } = require('child_process');
const { rename } = require('fs');
const { join } = require('path');

const build_out = 'dist';

(new Promise((resolve, reject) => {
    try {
        execSync('npm run build', { stdio: 'inherit' });
        execSync('git checkout origin/gh-pages -- CNAME', { stdio: 'inherit' });
        execSync('git reset', { stdio: 'inherit' });
    } catch (e) {
        return reject(e);
    }

    resolve();
})).then(() => new Promise((resolve, reject) => rename('CNAME', join(build_out, 'CNAME'), (e) => {
    if (e != null) {
        reject(e);
    } else {
        resolve();
    }
}))).then(() => new Promise((resolve, reject) => ghpages.publish(build_out, (e) => {
    if (e != null) {
        reject(e);
    } else {
        resolve();
    }
}))).then(() => console.log('deployed'), (e) => console.error('Error:', e));