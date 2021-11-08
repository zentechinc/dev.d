import _ from 'lodash';
import fileGenUtils from '../../utils/js/fileGen.js'
import config from '../../../../config/config.js'
import devdFiles from '../../utils/js/files.js';
import string from '../../utils/js/string.js';

function generateBashAliases(){
    let fileBody = fileGenUtils.buildSourcingHeader('.bash_aliases')
    for (const [aliasWord, aliasString] of Object.entries(config.aliases)) {
        fileBody = fileBody + buildAliasFromString(aliasWord, aliasString)
    }

    devdFiles.makeFile('/receivers/.bash_aliases', fileBody)
}

function buildAliasFromString(aliasKeyword, stringToAlias, options = {addNewline: true}) {
    const newline = _.get(options, 'addNewline') === true ? '\n' : '';
    return `alias "${string.sanitizeForBash(aliasKeyword)}"="${string.sanitizeForBash(stringToAlias)}"${newline}`;
}

export default {
    generate: generateBashAliases
}
