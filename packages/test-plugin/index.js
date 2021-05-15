const md5 = require('md5');
const name = require('./name.js');

const title = `${ name }：`;

exports.activate = function activate(bot) {
  console.info(title, '插件加载。');
  console.warn(title, `模块加载 - ${ md5('message') }`);
};

exports.deactivate = function deactivate(bot) {
  console.info(title, '插件卸载。');
};

exports.destructor = function destructor() {
  console.info(title, '其他操作。');
};