const fg = require('fast-glob');

const entries = fg.sync(['src/**'], {dot: true});

entries.forEach((entry) => {
    console.log(entry);
});