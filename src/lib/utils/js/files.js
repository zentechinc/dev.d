import fs from 'fs';
import readline from 'readline';
import path from 'path';
import config from '../../../../config/config.js';
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

export async function streamInsert(destinationPath, newLines, interruptLine = false, resumeLine = false) {
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

        console.log('<------- marker 999999999 ------->');
        console.log(`-------> output: ${output}`);

        function writeLine(lineIn = '') {
            console.log('<------- marker 4444 ------->');
            console.log(`-------> lineIn: ${lineIn}`);

            output.write(`${lineIn}\n`);
        }

        input.on('line', (line) => {
            if (line === interruptLine && interruptFound !== true) {
                splicing = true;
                interruptFound = true;

                // if the previous line isn't blank, insert a blank line
                if (!['\n', '\r\n', ''].includes(previousLine)) {
                    writeLine();
                }

                for (const newLine of newLines) {
                    writeLine(newLine);
                }
            }

            if (line === resumeLine || (splicing === true && resumeLine === true)) {
                splicing = false;
            }

            if (splicing === false) {
                previousLine = line;
                writeLine(line);
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
