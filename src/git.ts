import * as util from 'util';
const exec = util.promisify(require('child_process').exec);
import * as path from 'path';

export async function getRepoParts(folder: string) {
    let result = await exec(`cd ${folder} && git config --get remote.origin.url`);
    let regex = /ssh:\/\/git@([a-zA-Z.]+):\d+\/([a-zA-Z]+)\/([a-zA-Z-]+).git/;
    const [_, url, project, repo] = result.stdout.match(regex);
    return {
        url,
        project,
        repo
    }
}

/**
 * 
 * @param filename 
 * Return the filepath relative to the git root
 */
export async function getRootRelativeFilePath(filename: string) {
    let result = await exec(`cd ${path.dirname(filename)} && git ls-files --full-name ${filename}`);
    return result.stdout.replace('\n', '');
}

export async function getBranch(fsroot: string) {
    let result = await exec(`cd ${fsroot} && cat .git/HEAD`);
    return result.stdout.replace('\n', '').split("/").slice(-1)[0];
}
