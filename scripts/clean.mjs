import util from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';
import fse from 'fs-extra';
import zip from 'cross-zip';
import { requireJson } from '@sweet-milktea/utils';
import { __dirname, packageJson, build, unpacked } from './utils.mjs';

const globPromise = util.promisify(glob);
const zipPromise = util.promisify(zip.zip);

const lernaJson = await requireJson(path.join(__dirname, '../lerna.json'));
const { version } = lernaJson;
const renameDir = {
  mac: path.join(build, `mac/${ packageJson.name }-${ version }-mac`),
  macArm64: path.join(build, `mac-arm64/${ packageJson.name }-${ version }-mac-arm64`),
  win: path.join(build, `win/${ packageJson.name }-${ version }-win64`),
  win32: path.join(build, `win32/${ packageJson.name }-${ version }-win32`),
  linux: path.join(build, `linux/${ packageJson.name }-${ version }-linux64`)
};

/**
 * 删除mac的多语言文件并写入版本号
 * @param { string } unpackedDir: 目录
 */
async function lprojDeleteFilesAndWriteVersion(unpackedDir) {
  // 删除多语言文件
  const files = await globPromise(path.join(unpackedDir, `${ packageJson.name }.app/Contents/Resources/*.lproj`));
  const deleteTasks = [];

  files.forEach((o) => !/zh_CN/i.test(o) && deleteTasks.push(fse.remove(o)));
  await Promise.all(deleteTasks);

  // 写入版本号
  await fs.writeFile(path.join(unpackedDir, 'version'), `v${ version }`);
}

/**
 * 删除多语言文件并写入版本号
 * @param { string } unpackedDir: 目录
 */
async function pakDeleteFilesAndWriteVersion(unpackedDir) {
  // 删除多语言文件
  const files = await globPromise(path.join(unpackedDir, 'locales/*.pak'));
  const deleteTasks = [];

  files.forEach((o) => !/zh-CN/i.test(o) && deleteTasks.push(fse.remove(o)));
  await Promise.all(deleteTasks);

  // 写入版本号
  await fs.writeFile(path.join(unpackedDir, 'version'), `v${ version }`);
}

async function clean() {
  // 删除多语言文件并写入版本号
  await Promise.all([
    lprojDeleteFilesAndWriteVersion(unpacked.mac),
    lprojDeleteFilesAndWriteVersion(unpacked.macArm64),
    pakDeleteFilesAndWriteVersion(unpacked.win),
    pakDeleteFilesAndWriteVersion(unpacked.win32),
    pakDeleteFilesAndWriteVersion(unpacked.linux)
  ]);

  // 重命名
  await Promise.all([
    fs.rename(unpacked.mac, renameDir.mac),
    fs.rename(unpacked.macArm64, renameDir.macArm64),
    fs.rename(unpacked.win, renameDir.win),
    fs.rename(unpacked.win32, renameDir.win32),
    fs.rename(unpacked.linux, renameDir.linux)
  ]);

  // 压缩
  await Promise.all([
    zipPromise(renameDir.mac, `${ renameDir.mac }.zip`),
    zipPromise(renameDir.macArm64, `${ renameDir.macArm64 }.zip`),
    zipPromise(renameDir.win, `${ renameDir.win }.zip`),
    zipPromise(renameDir.win32, `${ renameDir.win32 }.zip`),
    zipPromise(renameDir.linux, `${ renameDir.linux }.zip`)
  ]);
}

clean();