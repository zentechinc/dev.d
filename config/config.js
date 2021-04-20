import aliases from './aliases.js';
import env_vars from './envTemplates/primary.js';
import runtimeOptions from '../src/utils/runtimeOptions.js';

const config_body = {
    environmentals: {
        common: {}
    },
    paths_to_add: {
        prefix: [
            '$~~/os/win',
            '$~~/os/win/bin'
        ],
        suffix: []
    },
    identity_keys: {
        clear: [],
        encrypted: [
            '${DEVD}/creds/github/id_rsa',
            '${DEVD}/creds/gitlab/id_rsa',
            '${DEVD}/creds/bitbucket/id_rsa'
        ]
    }
};

export default {...config_body, aliases, env_vars, runtimeOptions};
