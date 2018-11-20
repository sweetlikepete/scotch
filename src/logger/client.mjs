

const noop = () => {};


export default {
    debug: console && console.debug || noop,
    error: console && console.error || noop,
    info: console && console.info || noop,
    log: console && console.log || noop,
    silly: console && console.log || noop,
    verbose: console && console.log || noop,
    warn: console && console.warn || noop
};
