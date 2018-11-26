

const Brick = require("@newsteam/brick");
const gulp = require("gulp");


const automation = new Brick.default();


gulp.task("lint", gulp.series(
    automation.web.lint.run()
));