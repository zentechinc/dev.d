import fs from 'fs';
import readline from 'readline';
import path from 'path';
import config from '../../config/config.js';
import ensureStatements from './ensureStatements.js';
import _ from 'lodash';

function joinPaths(prefix, suffix) {
    path.join;
}

function copyFile(originPath, destinationPath, options = {inDevd: true}) {
    let prefix = '';
    if (_.get(options, 'inDevd') === true) {
        prefix = config.runtimeOptions.devdDir;
    }

    fs.copyFileSync(path.join(prefix, originPath), path.join(prefix, destinationPath));
}

function scanFileForLine(filePath, lineToScanFor) {
    return new Promise(function (resolve, reject) {
        let lineIsPresent = false;
        const file = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false
        });

        file.on('line', (line) => {
            if (line === lineToScanFor) {
                lineIsPresent = true;
            }
        });

        file.on('close', (line) => {
            resolve(lineIsPresent);
        });
    });
}

function buildLineDelimited(arrayOfLines) {
    let lines = ''
    for (const lineToAdd of arrayOfLines) {
        lines = lines + lineToAdd + '\n'
    }

    return lines
}

function makeLineDelimitedFile(linesToRender, destinationPath , allowEmptyFiles = false){
    let lineBody;
    if (linesToRender.length > 0 || allowEmptyFiles) {
        lineBody = buildLineDelimited(linesToRender);
        makeFile(destinationPath, lineBody);
    }
}

function makeFile(destinationPath, body, options = {inDevd: true}) {
    let prefix = '';
    if (_.get(options, 'inDevd') === true) {
        prefix = config.runtimeOptions.devdDir;
    }

    fs.writeFileSync(path.join(prefix, destinationPath), body);
}

export default {
    buildLineDelimited,
    makeFile,
    makeLineDelimitedFile,
    copyFile,
    ensureStatements,
    joinPaths,
    scanFileForLine
};
