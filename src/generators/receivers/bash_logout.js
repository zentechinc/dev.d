import _ from 'lodash';
import fileGenUtils from '../../utils/fileGen.js'
import config from '../../../config/config.js'
import devdFiles from '../../utils/files.js';
import string from '../../utils/string.js';

function generateBashLogout(){
    let fileBody = fileGenUtils.buildSourcingHeader('.bash_logout')

    devdFiles.makeFile('/build/.bash_aliases', fileBody)
}

export default {
    generate: generateBashLogout
}
