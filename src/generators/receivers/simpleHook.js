import _ from 'lodash';
import fileGenUtils from '../../utils/fileGen.js';
import config from '../../../config/config.js';
import devdFiles from '../../utils/files.js';
import string from '../../utils/string.js';

function generateSimpleHook(fileNameNoExtension) {
    let fileBody = fileGenUtils.buildSourcingHeader(fileNameNoExtension);

    fileBody = fileBody + 'test -r ${DEVD}/build/devd_controller.sh && source ${DEVD}/build/devd_controller.sh';

    devdFiles.makeFile(`/build/${fileNameNoExtension}`, fileBody);
}

function buildAliasFromString(aliasKeyword, stringToAlias, options = {addNewline: true}) {
    const newline = _.get(options, 'addNewline') === true ? '\n' : '';
    return `alias "${string.sanitizeForBash(aliasKeyword)}"="${string.sanitizeForBash(stringToAlias)}"${newline}`;
}

export default {
    generate: generateSimpleHook
};
