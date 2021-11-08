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
        if (splitHook[0] === '${HOME}/.vimrc') {
            splitHook[1] = `so ${splitHook[1]}`;
        } else {
            splitHook[1] = `test -r ${splitHook[1]} && source ${splitHook[1]}`;
        }

        splitHook[0] = splitHook[0].replace('${HOME}', config.runtimeOptions.userHome);
        splitHook[1] = splitHook[1].replace(/\${DEVD}/g, config.runtimeOptions.devdDir);

        const devdBlock = [
            '## begin dev.d generated ######################################################',
            '## lines in this block can and will be erased and regenerated without notice',
            'source ~/dev.d/main.sh',
            splitHook[1],
            '## end dev.d generated ########################################################'
        ];

        // await files.streamInsert(splitHook[0], devdBlock.slice(0, devdBlock.length), devdBlock[0], false);
        await files.streamInsert(splitHook[0], devdBlock.slice(0, devdBlock.length - 1), devdBlock[0], devdBlock[4]);
    }
}

export default {
    ensureHooks,
    ensureSourceDevd
};
