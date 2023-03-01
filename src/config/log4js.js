const log4js =  require ('log4js');

log4js.configure({
    appenders: {
        // Definición de soporte de salida de datos
        console: {type: 'console'},
        warning: {type: 'file', filename: 'warn.log'},
        error: {type: 'file', filename: 'error.log'},

        // Definición de niveles de logueo
        loggerConsole: {type: 'logLevelFilter', appender: 'console', level: 'info', maxLevel: 'error'},
        loggerWarning: {type: 'logLevelFilter', appender: 'warning', level: 'warn', maxLevel: 'warn'},
        loggerError: {type: 'logLevelFilter', appender: 'error', level: 'error', maxLevel: 'error'},
    },
    categories: {
        default: {
            appenders: ['loggerConsole', 'loggerWarning', 'loggerError'],
            level: 'all',
        },
    },
});

const logger = log4js.getLogger();

module.exports = logger;