import hooksToPlace from '../consts/hooksToPlace.js';
import files from '../utils/files.js';
import config from '../../config/config.js';
import fs from 'fs';

async function ensureSourceDevd() {
    for (const fileToScan of hooksToPlace) {
        const splitHook = fileToScan.split(':');

        // .vimrc has no need to source the general bash env
        if (!splitHook[0].includes('vimrc')) {
            splitHook[0] = splitHook[0].replace('${HOME}', config.runtimeOptions.userHome);

            const fileHasLine = await files.scanFileForLine(splitHook[0], 'source ~/dev.d/main.sh');

            if (!fileHasLine) {
                fs.appendFileSync(splitHook[0], '\n' + 'source ~/dev.d/main.sh' + '\n');
            }
        }
    }

    return true;
}

async function ensureHooks() {
    for (const fileToScan of hooksToPlace) {
        const splitHook = fileToScan.split(':');

        // .vimrc uses a different pattern for sourcing external files
        if( splitHook[0] === '${HOME}/.vimrc') {
            splitHook[1] = `so ${splitHook[1]}`;
        } else {
            splitHook[1] = `test -r ${splitHook[1]} && source ${splitHook[1]}`;
        }

        splitHook[0] = splitHook[0].replace('${HOME}', config.runtimeOptions.userHome);
        splitHook[1] = splitHook[1].replace(/\${DEVD}/g, config.runtimeOptions.devdDir);

        const fileHasLine = await files.scanFileForLine(splitHook[0], splitHook[1]);

        if (!fileHasLine) {
            fs.appendFileSync(splitHook[0], '\n' + splitHook[1] + '\n');
        }
    }

    return true;
}

export default {
    ensureHooks,
    ensureSourceDevd
};
