# dev.d

## Installation
Simply clone the dev.d project, then run ```main.sh``` in the project base directory to set up the hooks and receivers

User options are all managed inside a folder called 'config' which can also be found in the project base directory

## Approach
We will use Node.js to build *.sh (shaw) files that are readable by our bash environments

All logic and code will be kept in Node.js until ready to be read by bash

While bash scripting is powerful and robust, it can be a little arcane and tricky to maintain

By using Javascript & Node.js as the logic engine for the project, we gain many modern tools (rich types, JSON parsing for configs, etc.) and better IDE compatibility

However, the two prerequisites an end user will have to resolve are the installation of Node.js and Bash on their own system

Once Node.js and Bash are installed, we will then use the following pattern:
1. Insert a command to source dev.d's ```main.sh``` file into the following bash startup files:
    - .bash_login
    - .bash_profile
    - .bashrc
    - .profile
2. ```main.sh``` will do some minor environment checking then run ```build.js```
3. ```build.js``` will look at configuration options and generate several 'receiver' files that are equivalent to standard bash files:
    - .bash_aliases
    - .bash_login
    - .bash_logout
    - .bash_profile
    - .bashrc
    - .profile
    - .vimrc
4. ```build.js``` will then place 'source hooks' into the vanilla bash files that reach out and source the equivalent dev.d receiver file
5. Most of the dev.d receiver files will simply point to a generated file called ```devd_controller.sh```

This pattern allows for a consistent loading of configurations and tools regardless of how Bash is started (bash, bash -i, bash -l, bash -il, etc.) and the implementation of any arbitrary bash binary's starting process (it's inconsistent between spec and vendor implementation, more on this later).

## Files to be aware of
The [GNU manual for Bash](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html) says it will look for files in this order and source the first one found:
- /etc/profile
- ~/.bash_profile
- ~/etc/bashrc
    - missing from GNU manual doc, but it's there on some systems
- ~/.bash_login
    - inconsistent implementation
- ~/.bashrc
- ~/.profile
- ~/.bash_logout
    - inconsistent implementation

### The intent of the files are as follows
1. /etc/profile
    - 'system profile'
    - often used by any shell (zsh, fsh, etc)
2. ~/.bash_profile
    - 'user bash profile'
3. ~/.bash_login
    - 'bash login'
    - used to isolate commands from non-interactive and/or non-login shells
    
Now, will all these different files, each system will have different strictness and bugs with regards to implementing the correct startup ordering and such. This can be especially tricky with Windows shells given the many, MANY options there and their frequently poor implementation.

Further, the shells can be invoked with different options that affect the startup order and runtimeOptions:
- --interactive (-i)
- --login (-l)
- --noprofile
- --norc
- --rcfile

Ultimately, this can be very confusing and result in bad environments, which is why we are NOT going to rely on editing any of these files; instead, we are going to add all of our cool helpful stuff into our own, well controlled files and simply source those files reliably (redundantly) in the native bash files.

Our goal here is to have a repo that can be checked out from Git, have the init_dev.d.sh run once, and then not have to worry about anything else.

We will achieve this reliable and rich runtimeOptions by adding HOOKS into the standard system files that then reference our dev.d runtimeOptions. 

![Bash Init Path](src/lib/assets/init%20paths.png)

## Uniformity in experience
We want to create as uniform an experience as possible between the various applications we are going to interact with
In order to do this, we need to approach our movements, modes and modifiers (ctrl, super/host/meta, shift, alt, etc.) in a consistent and logical manner

### Keybindings & Keyboards
Unfortunately, not all programs provide robust keymapping abilities

However, with the idiom presented below, we will attempt to bring things into alignment to the extent of our abilities

- Keys and combinations are to be tersely expressed with brackets and '+' for simplicity and readability since typing
    - "the shift key, then the ctrl key, then the left key" is just too annoying to say to express 'select word left'
    - [a] - the 'a' key
    - [alt] - the alt key
    - [ctrl + shift + ←] - the shift key, the ctrl key, the left key
    - [ctrl + g] + [a] - the ctrl key + the g key, release, then the 'a' key

- Character literals are to be referred as stokes but with an escape/backslash
    - [\enter] - Linux/Mac '\n'; Windows '\r\n'
    - [\esc] - an escape character; usually '\'
    - [\space] - a space character; usually '\s'
    - [\tab] - a tab character; usually '\t'
    - this notation is easier to reference the concepts across OS hosts and programs and stands out for reading
    - this notation is nicer to read and write for pluralities and such; 
        - [\spaces] vs '\s's' or "\s's" or "\ss" or "\s"'s (you get our point)

- Modifiers are keys such as [alt], [ctrl], [shift], [super], [fn] (also called 'function')

- There should be no more than 1 key-binding to a particular effect, and effects similar between programs should be bound similarly
    - an excellent example of poorly executed coordination here can be found in most web browser's page reload command. eg. Chrome reload shortcuts
    - using multiple bindings to the same effect creates confusion as to whether the two commands are actually the same or slightly different, as illustrated in the Google Chrome example below
        - it obligates you to have similar elevations for related commands
        - the [ ctrl + shift + r ] here is crazy, and likely included simply to create a parallel with the [ shift + f5 ]
        ![Chrome Reloads](src/lib/assets/chrome%20refresh%20shortcuts.png) 

- Key classes are to be referred to with parenthesis
    - (move) - any movement key
    - (meta) - any meta key
    - (mod) - any modifier key
    - (base) - any base key
    - (char) - any non-meta base key (a-z0-9, etc.)
    - overlapping classes should take the most specific context

- A series stokes or characters are to be represented as [ Nx key ]
    - [4x tab] - four strikes of [tab] 
    - [3x esc] - three strikes of [esc]
    - [2x \space] - two literal '\s' characters

- Mac-like keyboards' [option] (⌥) is to be referred to as [alt]

- 'Base-keys' are the keys pressed upon which the modifier keys will augment/modify
    - [ctrl + a] - [a] is the base key
    - [ctrl + page-up] - [pg-up] is the base key

- 'Sub-key' commands are invoked as secondary functions on another key
    - Sub-key commands are usually indicated with alternate text or font coloring
        - [On this board, sub-keys are indicated in blue](src/lib/assets/sub-key in alternate colors.jpg)
            - Notice the typical 'shift-able' (commands invoked with [shift] + [a base key]) commands are still white and presented above their plain base-key    
    - Sometimes the sub-key command is NOT well illustrated or indicated (Mac-likes)
        - [Page-Up and Page-Down on Mac-like](src/lib/assets/sub-key page-up on mac.jpg)

- 'Meta-keys' are base keys with abstract commands
    - [page-up], [page-up], [home], [end]
    - Meta-keys are AWESOME and CRUCIAL to this paradigm
    - Unfortunately Meta-keys are less common on small notebooks or small keyboards
        - Meta-keys may sometimes be invoked as sub-key commands on smaller boards with an additional modifier stroke, usually [fn]
            - [Page-Up and Page-Down on Mac-like](src/lib/assets/sub-key page-up on mac.jpg)
        - [fn] support to invoke sub-key commands is inconsistent and imperfect in implementation, ESPECIALLY when used with other modifiers
            - We can't support such inconsistencies in this paradigm and so expect the user to get a big-boy keyboard accessory
                - There is a trend towards keyboards with about 87-keys (called 87key here-after) that strike a nice balance between minimalism and high-functionality
                - Cooler Master, Ducky, Das Keyboard, Keychron, WASD and many other manufacturers recognize this trend and provide excellent solutions

- Avoid
    - Modifier keys not common across host systems and keyboards 
        - the menu key
        - the Meta key
    - 'The Meta Key' is NOT the Super-key
        - some communities refer to it as the meta key
        - this is confusing since there was an actual 'Meta key' at one point, but it was NEVER very common
    - Verbose secondary keys strokes  

#### Modifier Paradigm
- [alt] - to interact with the application in a broad scope
    - [alt + w] = focus & open application's window menu

- [ctrl] - to interact with the application's current/narrow scope 
    - [ctrl + w] = close active tab/window
    - [ctrl + (move)]

- [shift] - selecting content and empower other commands executed in tandem with [shift]
    - [shift + a] = 'A'
    - [shift + ←] = selected text left
    - [shift + ctrl + ←] = selected word left
    - [ctrl + w] = close active tab/window
    - [shift + ctrl + w] = close all tabs/windows

- [super] - to interact with the host operating system
    - MacOS refers to this key as the command-key (⌘)
    - MacOS has a real problem here in that they have lots of crazy shortcuts that are command-key centric and NOT intuitive from a Linux or Windows perspective
    - We will not be doing much with [super], other than mapping commands away from it to meet the paradigm presented here
    
- Modifier Combinations should reflect the intent of the modifiers invoked within the context of the base key pressed
    - [ctrl + alt + w] = (should probably close an application window, but not quit the application; or something like that)
        - an example of this would be killing the open window but continuing to let the application run in the background/task-tray
    - [ctrl + alt + shift + w] = should probably close an application completely
    - [ctrl + alt + shift + super + w] = should probably KILL an application unresponsive application
        - we won't be making such low level changes as to enable such an action, this scenario is intended to illustrate our aesthetic

#### Keybinding Reference
We will include a separate file to set guides for which keys do what 

#### Movements
We will use WASD movements where possible, otherwise VIM controls will be used for movements

|Movement|WASD|VIM|
|:---:|:---:|:---:|
| ↑ | w | k |
| ← | a | h |
| ↓ | s | j |
| → | d | l |

Examples
- movements should also be used for directional indications
- Meta-Movements are a thing that should be respected
    - [home], [end], [page-down], [page-up] 
- movements follow a left-to-right, top-to-bottom paradigm
- open a new tab to the right should be indicated with [d], [l] or [page-down]
- move focus/cursor to left tab should be indicated with [a], [h] or [page-up]
- move focus to left tab should be indicated with [a], [h] or [page-up]

# What a bunch of characters
## Tab vs. Spaces
We hate to bring this up because it's been made into a sort of meme or trope, but we have to get this out of the way...

This argument is NOT about whether someone uses [tab] or [space], it's about whether you have the editor in question insert a group of space-characters (1 or more [\space]) or tab-characters (1 or more [\tab]) when you indent (VIM calls it 'shifting') a line

Only maniacs will hit [space] multiple times to get a comfortable indent. Please report anyone you see using this behavior to your local authorities

That being said, [\tabs] where reasonable (for all indents), [\spaces] otherwise, avoid mixing (looking at you, VIM)

The [\tab] character exists for a reason, lets use it

Some contexts are very white space sensitive and rely on accurate and consistent lead space (indentations/shifts) to provide code scoping (YAML & Python to name two very important examples)

In highly sensitive contexts, [\tabs] make it easier to work with indent shifting and help your editor/IDE work with and interpret your code

If, for some reason, our code gets mangled and transplanted, we and our IDE should be able to properly re-assemble and beautify it by looking at [\tabs], but will generally be much less successful if all it has are [\spaces] to work with
 
### [Tab] width
- the width of a give [\tab] is usually figured by mapping it relative to a preferred number of monospace-columns (think [ 1x \space ] characters)
- This mapping width can usually be adjusted quite freely inside a particular editor
- We feel [ 2x \space ] (as Google's JavaScript style) is too small for nice eye-feel & readability
    - also, the difference is so small, it looks like a mistake
- VIM's [ 8x \space ] is just a crazy amount of wasted space and actually creates more work for the eye to jumping around and navigate
- [Python PEP](https://www.python.org/dev/peps/pep-0008/#indentation), [ESLint](https://eslint.org/docs/rules/indent#rule-details-55), Notepad++, IntelliJ (conditionally) center or default around [ 4x \space ]
    - This is a nice compromise between 2x, Word's 7x, VIM's 8x
    - This is beautiful and easy on the eyes but dense enough not to waste space on monitors
- The arguments for 2x are inappropriate here on the following grounds:
    - [JavaScript's callback-hell](https://www.reddit.com/r/JavaScript/comments/5rjrcy/why_is_twospace_tab_indent_becoming_the_standard/dd7shi5/?context=1000) is an issue with JavaScript, and not found in all other langs
        - Also, modern JavaScript has excellent promise support that mitigates lots of callback-hell monitor-space burn issues
    - Arguments for individual cases of scarce/constrained/limited resources are folly since not everyone is constrained by that resource 
        - Not everyone uses [GitHub](https://www.reddit.com/r/JavaScript/comments/5rjrcy/why_is_twospace_tab_indent_becoming_the_standard/dd7wy87/?context=1000) reader
        - Not everyone is trapped in pre-promise [JavaScript](https://www.reddit.com/r/JavaScript/comments/5rjrcy/why_is_twospace_tab_indent_becoming_the_standard/dd7shi5/?context=1000)
        - [Even Torvalds agrees with this, to an extent](https://lkml.org/lkml/2020/5/29/1038)

### TL;DR
It makes no sense to argue for an inferior solution to resolve a limited fringe issue, especially when that solution imposes constraints on the broader series of cases; Thus:
1. Use [tab]
2. Use [\tab]
3. Set [\tab] to [ 4x \space ]
    -   If a particular case has a need to deviate from this, using [\tab] as point 2 directs is a god-send solid because [\tab] allows for easy case-by-case width adjusting
4. Use code quality tools (linters) to convert [\tab] to an appropriate number of [\spaces] at build time if your organization has less logical style guide-lines
