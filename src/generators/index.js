import bash_aliases from './receivers/bash_aliases.js';
import bash_logout from './receivers/bash_logout.js';
import simpleHook from './receivers/simpleHook.js';
import files from '../utils/files.js'

export default {
    bash_aliases,
    bash_login: {generate: (fileNameNoExtension = '.bash_login') => simpleHook.generate(fileNameNoExtension)},
    bash_logout,
    bash_profile: {generate: (fileNameNoExtension = '.bash_profile') => simpleHook.generate(fileNameNoExtension)},
    bashrc: {generate: (fileNameNoExtension = '.bashrc') => simpleHook.generate(fileNameNoExtension)},
    environmentals: {generate: (listOfLists) => files.makeEnvirontmentalsFile('/receivers/environmentals.sh', listOfLists)},
    profile: {generate: (fileNameNoExtension = '.profile') => simpleHook.generate(fileNameNoExtension)}
}
