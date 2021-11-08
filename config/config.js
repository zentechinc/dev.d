import aliases from './aliases.js';
import environmentals from './environmentals.js';
import runtimeOptions from '../src/lib/utils/js/runtimeOptions.js';

const config_body = {
    paths_to_add: {
        prefix: [
            '$~~/os/win',
            '$~~/os/win/bin',
            '/c/zen_cloud/bin/planet',
            '/c/zen_local/repos/conlang_tools'
        ],
        suffix: []
    },
    identity_keys: {
        clear: [],
        encrypted: [ // we can render paths using 2 different patterns, as seen here
            'C:\\zen_cloud\\cert\\bitbucket\\id_rsa',
            'C:\\zen_cloud\\cert\\github\\id_rsa',
            '/c/zen_cloud/cert/gitlab/id_rsa',
        ]
    }
};

export default {...config_body, aliases, environmentals, runtimeOptions};
