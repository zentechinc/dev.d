In order to avoid being committed and pushed,
it is probably best that credential files and such go into a separate folder outside this repo.
To load any arbitrary SSH key, just add an entry into config.js 

However, the settings in '.gitignore' should prevent any files here from being uploaded.

Add credential files and such here.

Otherwise, this directory will hold a simple file called 'ssh-init_fancy.env' which is used for controlling SSH agents.
