import config from '../config/config.js';
import devdFiles from './utils/files.js';
import generators from './generators/index.js';

// This file is the main controller of the initialization process
async function buildBashReceivers() {
    devdFiles.copyFile('/src/templates/.vimrc', '/receivers/.vimrc');
    devdFiles.copyFile('/src/templates/devd_controller.sh', '/receivers/devd_controller.sh');

    generators.bash_aliases.generate();
    generators.bash_login.generate();
    generators.bash_profile.generate();
    generators.bashrc.generate();
    generators.profile.generate();
    generators.environmentals.generate(config.environmentals);

    devdFiles.makeLineDelimitedFile('/receivers/crypto_keys.ldf', config.identity_keys.encrypted);
    devdFiles.makeLineDelimitedFile('/receivers/path_prefixes.ldf', config.paths_to_add.prefix);
    devdFiles.makeLineDelimitedFile('/receivers/path_suffixes.ldf', config.paths_to_add.suffix);

    await devdFiles.ensureStatements.ensureHooks();
}

buildBashReceivers();
