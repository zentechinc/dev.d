import aliases from './aliases.js';
import environmentals from './environmentals.js';
import runtimeOptions from '../src/utils/runtimeOptions.js';

const config_body = {
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
            'C:\\zen_cloud\\cert\\bitbucket\\id_rsa',
            'C:\\zen_cloud\\cert\\github\\id_rsa',
            '/c/zen_cloud/cert/gitlab/id_rsa',
        ]
    }
};

export default {...config_body, aliases, environmentals, runtimeOptions};
