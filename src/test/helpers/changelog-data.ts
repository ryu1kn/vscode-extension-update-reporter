const multiline = require('multiline-string')();

export const VALID_1 = multiline(`
    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

    ## [1.0.0] - 2018-04-21
    ### Added
    - foo2
    - bar

    ## [0.9.0] - 2018-04-20
    ### Added
    - foo

    ## [0.8.0] - 2018-04-19
    ### Added
    - baz
    `);

export const VALID_2 = multiline(`
    The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

    ## [0.1.0] - 2018-04-22
    ### Removed
    - baz

    ## [0.0.9] - 2018-04-21
    ### Removed
    - foo
    `);

export const INVALID_VERSION_FORMAT = multiline(`
    ### 1-3-0
    * foo
    `);

export const INVALID_HEADING = multiline(`
    ### 1.3.0
    * foo
    
    ### Fixes:
    * bar
    `);
