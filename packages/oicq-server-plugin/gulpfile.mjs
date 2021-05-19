import util from 'util';
import process from 'process';
import path from 'path';
import gulp from 'gulp';
import typescript from 'gulp-typescript';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import zip from 'cross-zip';
import fse from 'fs-extra';
import { requireJson, metaHelper } from '@sweet-milktea/utils';

const zipPromise = util.promisify(zip.zip);

const { __dirname } = metaHelper(import.meta.url);
const baseTypescriptConfig = await requireJson(path.join(__dirname, '../../tsconfig.json'));
const tsConfig = await requireJson(path.join(__dirname, './tsconfig.json'));
const packageJson = await requireJson(path.join(__dirname, './package.json'));

const isDevelopment = process.env.NODE_ENV === 'development';
const isWatch = process.env.WATCH;
const isCompress = process.env.COMPRESS;

function devTsProject() {
  const result = gulp.src('src/**/*.{ts,tsx}')
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(typescript({
      ...baseTypescriptConfig.compilerOptions,
      ...tsConfig.compilerOptions
    }));

  return result.js.pipe(gulp.dest('dist'));
}

function watch() {
  gulp.watch('src/**/*.{ts,tsx}', devTsProject);
}

function tsProject() {
  const result = gulp.src('src/**/*.{ts,tsx}')
    .pipe(typescript({
      ...baseTypescriptConfig.compilerOptions,
      ...tsConfig.compilerOptions
    }));

  return result.js.pipe(gulp.dest('dist'));
}

async function compressedFile() {
  await Promise.all([
    fse.copy('dist', 'build/oicq-server-plugin/dist'),
    fse.copy('package.json', 'build/oicq-server-plugin/package.json'),
    fse.copy(path.join(__dirname, '../../LICENSE'), 'build/oicq-server-plugin/LICENSE'),
    fse.copy('server-plugin.config-example.js', 'build/oicq-server-plugin/server-plugin.config.js')
  ]);
  await zipPromise(
    path.join(__dirname, 'build/oicq-server-plugin'),
    path.join(__dirname, `build/oicq-server-plugin-${ packageJson.version }.zip`)
  );
  await fse.remove(path.join(__dirname, 'build/oicq-server-plugin'));
}

export default isDevelopment
  ? (isWatch ? gulp.series(devTsProject, watch) : devTsProject)
  : (isCompress ? gulp.series(tsProject, compressedFile) : tsProject);