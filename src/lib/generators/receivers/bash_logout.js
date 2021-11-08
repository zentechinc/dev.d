import _ from 'lodash';
import fileGenUtils from '../../utils/js/fileGen.js'
import config from '../../../../config/config.js'
import devdFiles from '../../utils/js/files.js';
import string from '../../utils/js/string.js';

function generateBashLogout(){
    let fileBody = fileGenUtils.buildSourcingHeader('.bash_logout')

    devdFiles.makeFile('/receivers/.bash_aliases', fileBody)
}

export default {
    generate: generateBashLogout
}
