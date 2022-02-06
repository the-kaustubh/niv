function compareReading (reading, range) {
  return reading > range.min && reading < range.max
}

function checkHealth (reading, node) {
  let condition = true

  if (node.isTemperature) {
    const tempOK = compareReading(reading.temperature, node.temperatureRange)
    condition &&= tempOK
  }

  if (node.isHumidity) {
    const humOK = compareReading(reading.humidity, node.humidityRange)
    condition &&= humOK
  }

  if (node.isCO2) {
    const co2OK = compareReading(reading.co2, node.co2Range)
    condition &&= co2OK
  }

  return !condition
}

module.exports = checkHealth
