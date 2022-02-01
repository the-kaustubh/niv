const { execFile } = require('child_process')

async function checkForUpdatesServer (token) {
  try {
    await runCmd('rm', ['/app/niv', '-f'])
    await runDownloader(false, token)
    runCmd('rm', ['/app/logs', '-rf'])
    runCmd('rm', ['/app/backup', '-rf'])
    runCmd('chmod', ['a+x', '/app/niv'])
    runCmd('pm2', ['restart', 'niv']).then(() => console.log('Restarting App'))
  } catch (er) {
    console.log(er)
  }
}

async function checkForUpdatesClient (token) {
  try {
    await runCmd('rm', ['/var/www/wdl', '-rf'])
    await runCmd('rm', ['/app/niv-client.zip', '-f'])
    await runDownloader(true, token)

    await runCmd('unzip', ['/app/niv-client.zip', '-d', '/app/'])
    await runCmd('mv', ['/app/dist', '/var/www/wdl'])
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

async function runDownloader (client, token) {
  const repo = (client) ? 'niv-frontend' : 'niv'
  const output = (client) ? 'niv-client.zip' : 'niv'
  const resp = await runCmd('/usr/bin/asdl',
    [
      '-user', 'the-kaustubh',
      '-repo', repo,
      '-token', token,
      '-asset', '0.assets.0.id',
      '-o', '/app/' + output
    ]
  )
  return resp
}

module.exports = {
  checkForUpdatesServer,
  checkForUpdatesClient
}
