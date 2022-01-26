const { execFile } = require('child_process')

async function checkForUpdates () {
  try {
    await runCmd('/home/kaustubh/Documents/JS/ates/niv/get-update.sh', ['latest', '/home/kaustubh/Desktop/lol'])
    let exePath = await runCmd('pwd')
    exePath = exePath.split('\n')[0]

    runCmd('file', [`${exePath}/niv`]).then(so => console.log(so))

    // await runCmd('git', ['fetch']).then(so => console.log('f', so))
    // let so = await runCmd('git', ['status', '-sb'])
    // so = so
    //   .trim()
    //   .split('\n')[0]
    //   .search(/behind/)
    // console.log(so)
    // if (so === -1) {
    //   console.log('no updates found')
    //   return
    // }
    // await runCmd('git', ['pull'])
    // await runCmd('rm', ['/app/logs/*', '-f'])
    // await runCmd('pm2', ['restart', 'index'])
  } catch (er) {
    console.log(er)
  }
}

async function runCmd (cmd, args) {
  return new Promise((s, j) => {
    execFile(cmd, args, {}, (err, so) => {
      if (err) j(err)
      s(so)
    })
  })
}

module.exports = {
  checkForUpdates
}
