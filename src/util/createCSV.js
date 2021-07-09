const fastcsv = require('fast-csv')

const createCSV = async (data, res) => {
  fastcsv
    .write(data, { headers: true })
    .on('finish', function () {
      console.log('Write to CSV successfully!')
    })
    .pipe(res)
}

module.exports = createCSV
