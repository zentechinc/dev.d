import _ from 'lodash';
import fileGenUtils from '../../utils/fileGen.js';
import config from '../../../config/config.js';
import devdFiles from '../../utils/files.js';
import string from '../../utils/string.js';

function generateSimpleHook(fileNameNoExtension) {
    let fileBody = fileGenUtils.buildSourcingHeader(fileNameNoExtension);

    fileBody = fileBody + 'test -r ${DEVD}/receivers/devd.sh && source ${DEVD}/receivers/devd.sh';

    devdFiles.makeFile(`/receivers/${fileNameNoExtension}`, fileBody);
}

function buildAliasFromString(aliasKeyword, stringToAlias, options = {addNewline: true}) {
    const newline = _.get(options, 'addNewline') === true ? '\n' : '';
    return `alias "${string.sanitizeForBash(aliasKeyword)}"="${string.sanitizeForBash(stringToAlias)}"${newline}`;
}

export default {
    generate: generateSimpleHook
};
