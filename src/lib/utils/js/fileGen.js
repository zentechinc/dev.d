import fs from 'fs';
import path from 'path';

function buildSourcingHeader(fileName) {
    return `#!/bin/bash\necho "sourcing ~~/${fileName}"\n\n`;
}

async function makeFile(filePath, fileContents) {
    await fs.writeFile(filePath, fileContents)
}

export default {
    buildSourcingHeader,
    makeFile
};
