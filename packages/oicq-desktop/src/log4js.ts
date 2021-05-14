import 'log4js/lib/appenders/stdout';
import 'log4js/lib/appenders/console';
import * as log4js from 'log4js';

/* 将log4js的输出从node主线程调整到渲染线程 */
log4js.configure({
  appenders: {
    out: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'debug'
    }
  }
});