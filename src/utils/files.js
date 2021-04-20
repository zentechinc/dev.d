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
    let lines = '';
    for (const lineToAdd of arrayOfLines) {
        lines = lines + lineToAdd + '\n';
    }

    return lines;
}

function makeEnvirontmentalsFile(destinationPath, environmentalLists) {
    let fileBody = '';

    for (const sublistName in environmentalLists){
        const sublist = environmentalLists[sublistName]
        if (Object.keys(sublist).length >= 1){
            fileBody = fileBody + `# ${sublistName}\n`;
            for (const environmentalName in sublist){
                fileBody = fileBody + `export ${environmentalName}=${sublist[environmentalName]}` + '\n';
            }
            fileBody = fileBody + '\n';
        }
    }

    makeFile(destinationPath, fileBody);
}

function makeLineDelimitedFile(destinationPath, linesToRender, allowEmptyFiles = false) {
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
    makeEnvirontmentalsFile,
    makeFile,
    makeLineDelimitedFile,
    copyFile,
    ensureStatements,
    joinPaths,
    scanFileForLine
};
