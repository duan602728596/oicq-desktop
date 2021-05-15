import name from './name.js';

const title = `${ name }：`;

export function activate(bot) {
  console.log(title, '插件加载。');
}

export function deactivate(bot) {
  console.log(title, '插件卸载。');
}

export function destructor() {
  console.log(title, '其他操作。');
}