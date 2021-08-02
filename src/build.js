import config from '../config/config.js';
import devdFiles from './utils/files.js';
import generators from './generators/index.js';

// This file is the main controller of the initialization process
async function buildBashReceivers() {
    devdFiles.copyFile('/src/templates/.vimrc', '/build/.vimrc');
    devdFiles.copyFile('/src/templates/devd_controller.sh', '/build/devd.sh');

    generators.bash_aliases.generate();
    generators.bash_login.generate();
    generators.bash_profile.generate();
    generators.bashrc.generate();
    generators.profile.generate();
    generators.environmentals.generate(config.environmentals);

    devdFiles.makeLineDelimitedFile('/build/crypto_keys.ldf', config.identity_keys.encrypted);
    devdFiles.makeLineDelimitedFile('/build/path_prefixes.ldf', config.paths_to_add.prefix);
    devdFiles.makeLineDelimitedFile('/build/path_suffixes.ldf', config.paths_to_add.suffix);

    await devdFiles.ensureStatements.ensureHooks();
    await devdFiles.ensureStatements.ensureSourceDevd();
}

buildBashReceivers();
