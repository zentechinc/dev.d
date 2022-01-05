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

/**
 * streamInsert
 *
 * for both interruptLine and resumeLine, the line value found will be discarded and replaced
 *
 * @param destinationPath - a string containing the path to file into which the lines should be inserted
 * @param newLines - an array of values representing the lines to be inserted into the file
 * @param interruptLine - a value representing the line at which point insertion should begin; if false or this line is not found then the lines are appended at the end
 * @param resumeLine - a value representing the line to end the insert block; if false, streamInsert will only insert lines into the file without truncating; if truthy, any data between the start of the insert and the detection of the resumeLine will be truncated
 * @returns {Promise<unknown>}
 */
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

        function writeLine(lineIn = '') {
            output.write(`${lineIn}\n`);
        }

        function insertLines(newLines) {
            for (const newLine of newLines) {
                writeLine(newLine);
            }
        }

        input.on('line', (line) => {
            // if we find the interrupt line, we want to begin inserting new lines...
            // but only want to do this once in a given file, hence the interruptFound check
            if (line === interruptLine && interruptFound !== true) {
                splicing = true;
                interruptFound = true;

                insertLines(newLines);
            }

            // if we find a resume line, we want to re-enable writing of original file content...
            // but if the resumeLine value is false, we want to re-enable original content insertion
            if (line === resumeLine || (splicing === true && resumeLine === false)) {
                splicing = false;
            }

            if (splicing === false) {

                previousLine = line;

                if (line !== resumeLine) {
                    writeLine(line);
                }
            }
        });

        input.on('close', async () => {
            // if the interrupt is never found, we want to at least get the lines in at the end
            if (interruptFound === false) {
                insertLines(newLines);
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
