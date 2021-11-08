import path from 'path'

const runtimeOptions = {
    // for devdDir
    // this works when called by the main.sh in dev.d, but does not work when the build.js is called directly
    // harden this so it works either way
    devdDir: process.argv[2],
    userHome: process.env.HOME
}

export default runtimeOptions
