const { spawn } = require('child_process')

const BackupDir = (process.env.BACKUPDIR) ? `${process.env.BACKUPDIR}/` : ''

function createBackup () {
  const [dt, tm] = new Date().toJSON().split('T')
  const [hh, mm] = tm.split(':')
  const fileName = `${BackupDir}ates-backup_${dt}_${hh}:${mm}.gz`

  console.error('Backup Started')
  const bkpProc = spawn('mongodump', [
    '--db=niv',
    `--archive=${fileName}`,
    '--gzip'
  ])

  bkpProc.on('error', (e) => {
    console.error(e)
  })
  bkpProc.on('close', (code, signal) => {
    if (code) {
      console.error(`Backup process exited with code ${code}`)
    } else if (signal) {
      console.error(`Backup process was killed with signal ${signal}`)
    } else {
      console.error('Backup Completed')
    }
  })
}

module.exports = {
  createBackup
}
