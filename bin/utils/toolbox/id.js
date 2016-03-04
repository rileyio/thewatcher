// ID tools
module.exports = function (id) {
  var results = {}

  // Shorten to 7 characters (example: 13caf0a)
  results.short = id.substring(0, 7)
  
  // Full id string, no limit
  results.full = id
  
  return results
}
