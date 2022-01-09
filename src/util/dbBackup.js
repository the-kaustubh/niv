const { spawn } = require('child_process')

const BackupDir = (process.env.BACKUPDIR) ? `${process.env.BACKUPDIR}/` : ''

function formatDate (date) {
  const [dt, tm] = date.split(' ')
  const [dd, MM] = dt.split('/')
  const [hh, mm] = tm.split(':')
  const z = (x) => (x > 10) ? `${x}` : `0${x}`
  return `${z(dd)}-${z(MM)}_${z(hh)}:${z(mm)}`
}

function createBackup () {
  const dt = formatDate(new Date().toLocaleString())
  const fileName = `${BackupDir}ates-backup_${dt}.gz`

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
