const createCSV = (readings) => {
  let csvData = 'Date,Time,Temperature,Humidity,CO2\n'
  for (let i = 0; i < readings.length; i++) {
    csvData += `${new Date(readings[i].datetime).toLocaleDateString()},`
    csvData += `${new Date(readings[i].datetime).toLocaleTimeString()},`
    csvData += `${readings[i].temperature || 0},`
    csvData += `${readings[i].humidity || 0},`
    csvData += `${readings[i].co2 || 0}\n`
  }
  return csvData
}

module.exports = createCSV
