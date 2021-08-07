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

async function streamInsert(destinationPath, newLines, interruptLine, resumeLine = true) {
    return new Promise(async function (resolve, reject) {
        let splicing = false;
        let interruptFound = false;
        let previousLine;

        const input = readline.createInterface({
            input: fs.createReadStream(destinationPath),
            output: process.stdout,
            terminal: false
        });

        const output = fs.createWriteStream(`${destinationPath}_tmp`, {
            flags: 'w'
        });

        function writeLine(lineIn = '') {
            output.write(`${lineIn}\n`);
        }

        input.on('line', (line) => {
            let lineOut = line;
            if (lineOut === interruptLine && interruptFound !== true) {
                splicing = true;
                interruptFound = true;

                if (!['\n', '\r\n', ''].includes(previousLine)) {
                    writeLine();
                }

                for (const newLine of newLines) {
                    writeLine(newLine);
                }
            }

            if (lineOut === resumeLine || (splicing === true && resumeLine === true)) {
                splicing = false;
            }

            if (splicing === false) {
                previousLine = lineOut;
                writeLine(lineOut);
            }
        });

        input.on('close', async () => {
            if (interruptFound === false) {
                for (const newLine of newLines) {
                    writeLine(newLine);
                }
            }

            input.close();
            input.removeAllListeners();
            output.close();
            output.removeAllListeners();

            // await new Promise(resolve => setTimeout(resolve, 50));

            fs.renameSync(`${destinationPath}_tmp`, `${destinationPath}`);
            resolve();
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

    for (const sublistName in environmentalLists) {
        const sublist = environmentalLists[sublistName];
        if (Object.keys(sublist).length >= 1) {
            fileBody = fileBody + `# ${sublistName}\n`;
            for (const environmentalName in sublist) {
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
    scanFileForLine,
    streamInsert
};
