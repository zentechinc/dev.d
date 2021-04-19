import config from '../config/config.js';
import devdFiles from './utils/files.js';

import generators from './generators/index.js';

// This file is the main controller of the initialization process
async function buildBashReceivers() {
    devdFiles.copyFile('/src/templates/.vimrc', '/build/.vimrc');
    devdFiles.copyFile('/src/templates/devd_controller.sh', '/build/devd_controller.sh');

    generators.bash_aliases.generate();
    generators.bash_login.generate();
    generators.bash_profile.generate();
    generators.bashrc.generate();
    generators.profile.generate();

    devdFiles.makeLineDelimitedFile(config.identity_keys.encrypted,'/build/crypto_keys.ldf');
    devdFiles.makeLineDelimitedFile(config.paths_to_add.prefix,'/build/path_prefixes.ldf');
    devdFiles.makeLineDelimitedFile(config.paths_to_add.suffix,'/build/path_suffixes.ldf');

    await devdFiles.ensureStatements.ensureHooks();
    await devdFiles.ensureStatements.ensureSourceDevd();
}

buildBashReceivers();
