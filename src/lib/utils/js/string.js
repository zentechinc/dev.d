import fs from 'fs';
import path from 'path';
import config from '../../../../config/aliases.js';
import _ from 'lodash';

function sanitizeForBash(stringIn, options = {errorOnUnclean: false}) {
    let stringOut = stringIn.replace(/"/g, '\\"');

    if (_.get(options, 'errorOnUnclean') === true) {
        if (stringOut !== stringIn) {
            throw new Error('string is unclean!');
        }
    }


    return stringOut;
}

/**
 * A utility to expand variables in strings
 */
function smartVariablePresub(stringIn) {
    let stringOut = stringIn.replace('$~~', process.env('DEVD'));
    return stringOut;
}


export default {
    sanitizeForBash
};
