import archiver from 'archiver'
import { sassPlugin } from 'esbuild-sass-plugin'
import esbuild from 'esbuild'
import fs, { promises as fsPromises } from 'fs'

const outdir = 'build'

async function deleteOldDir() {
  await fsPromises.rm(outdir, { recursive: true, force: true })
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: [
      'src/content-script/index.jsx',
      'src/background/index.ts',
      'src/popup/index.tsx',
      'src/options/index.tsx'
    ],
    bundle: true,
    outdir: outdir,
    treeShaking: true,
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsx: 'automatic',
    plugins: [sassPlugin()],
  })
}

async function zipFolder(dir) {
  const output = fs.createWriteStream(`${dir}.zip`)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  archive.pipe(output)
  archive.directory(dir, false)
  await archive.finalize()
}

async function copyFiles(entryPoints, targetDir) {
  await fsPromises.mkdir(targetDir)
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fsPromises.copyFile(entryPoint.src, `${targetDir}/${entryPoint.dst}`)
    }),
  )
}

async function build() {

  console.log("Starting build")
  await deleteOldDir()
  await runEsbuild()

  const commonFiles = [
    { src: 'build/content-script/index.js', dst: 'content-script.js' },
    { src: 'build/content-script/index.css', dst: 'content-script.css' },
    { src: 'build/background/index.js', dst: 'background.js' },
    { src: 'build/popup/index.js', dst: 'popup.js' },
    { src: 'build/popup/index.css', dst: 'popup.css' },
    { src: 'src/popup/index.html', dst: 'popup.html' },
    { src: 'build/options/index.js', dst: 'options.js' },
    { src: 'build/options/index.css', dst: 'options.css' },
    { src: 'src/options/index.html', dst: 'options.html' },
    { src: 'src/logo.png', dst: 'logo.png' },
    { src: 'src/logo_128.png', dst: 'logo_128.png' },
  ]

  // chromium
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.json', dst: 'manifest.json' }],
    `./${outdir}/chromium`,
  )

  await zipFolder(`./${outdir}/chromium`)

  // firefox
  await copyFiles(
    [...commonFiles, { src: 'src/manifest.v2.json', dst: 'manifest.json' }],
    `./${outdir}/firefox`,
  )

  await zipFolder(`./${outdir}/firefox`)

  console.log("Success")
}

build()
