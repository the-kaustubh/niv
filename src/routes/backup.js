const express = require('express')
const router = express.Router()
const { createBackup } = require('../util/dbBackup')
const fs = require('fs')

const backupPath = (process.env.BACKUPDIR) ? `${process.env.BACKUPDIR}/` : ''

router.get('/create', (_req, res) => {
  try {
    createBackup()
    res.json({ msg: 'ok' })
  } catch (err) {
    console.log(err)
    res.json({ err: err.message })
  }
})

router.get('/delete/:backup', (req, res) => {
  const fileName = req.params.backup
  try {
    fs.rm(`${backupPath}${fileName}`, (err) => {
      if (err) throw new Error(err.message)

      res.json({ msg: 'deleted' })
    })
  } catch (err) {
    console.log(err)
    res.json({ err: err.message })
  }
})

router.get('/', async (_req, res) => {
  try {
    fs.readdir(backupPath, (err, files) => {
      if (err) {
        throw new Error(err.message)
      }
      const fAr = []
      files.forEach((f) => {
        console.log(`${backupPath}${f}`)
        fAr.push(f)
      })
      res.json({ files: fAr })
    })
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ msg: err.message })
  }
})

router.get('/:fname', async (req, res) => {
  res.download(`${backupPath}/${req.params.fname}`)
})

module.exports = router
