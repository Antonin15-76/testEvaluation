const fsExtra = require('fs-extra')

export const STATIC_FILES = process.env.STATIC_FILES

try {
  if (!fsExtra.accessSync(STATIC_FILES)) {
    fsExtra.mkdirsSync(STATIC_FILES)
  }
} catch (err) {
  fsExtra.mkdirsSync(STATIC_FILES)
}
