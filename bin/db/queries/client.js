// var Client = function (DB) {
//   var self = this
//   self.DB = DB
// }

var Client = module.exports = function (database) {
  this.DB = database.DB
  this.log = database.log
}

Client.prototype.get = function (data, callback) {
  var self = this

  // console.log('TheWatcher >> Server >> DB::Client(lookup:%s)'.yellow, data.name)

  self.DB('clients')
    .select('*')
    .where({
      'name': data.name,
      'sha_id': data.sha_id
    })
    .then(function (ret) {
      if (ret) {
        self.log.info(`Client lookup success for name:${data.name}, id:${data.sha_id}`)
      } else {
        self.log.error(`Client get failed for name:${data.name}, id:${data.sha_id}`)
      }

      // Return on successful
      if (typeof callback === 'function') return callback(null, ret)
    })
    .catch(function (err) {
      self.log.error(`Client get failed (${err.code}) for name:${data.name}, id:${data.sha_id}`)

      // Return error
      if (typeof callback === 'function') return callback(err, null)
    })
}

Client.prototype.update = function (data, callback) {
  var self = this

  // console.log('TheWatcher >> Server >> DB::Client(update:%s)'.yellow, data.name)

  self.DB('clients')
    .where({
      'name': data.name,
      'sha_id': data.sha_id
    })
    .update({
      socket_id: data.socket_id,
      updated_at: self.DB.fn.now()
    })
    .then(function (ret) {
      if (ret) {
        self.log.info(`Client updated name:${data.name}, id:${data.sha_id}`)
      } else {
        self.log.error(`Failed to update client name:${data.name}, id:${data.sha_id}`)
      }

      // Return on successful
      if (typeof callback === 'function') return callback(null, ret)
    })
    .catch(function (err) {
      self.log.error(`Failed to update client (${err.code}) name:${data.name}, id:${data.sha_id}`)

      // Return error
      if (typeof callback === 'function') return callback(err, null)
    })
}

Client.prototype.add = function (data, callback) {
  var self = this

  // console.log('TheWatcher >> Server >> DB::Client(add:%s)'.yellow, data.name)

  self.DB('clients')
    .insert({
      name: data.name,
      sha_id: data.id,
      type: data.mode,
      latitude: data.lat,
      longitude: data.lon,
      created_at: new Date(data.created_at),
      pubkey: data.key.public
    })
    .then(function (ret) {
      if (ret) {
        self.log.info(`New client saved to db name:${data.name}, id:${data.id}`)
      } else {
        self.log.error(`Failed to add new client to db name:${data.name}, id:${data.id}`)
      }

      // Return insert pkey value on successful
      if (typeof callback === 'function') return callback(null, ret)
    })
    .catch(function (err) {
      self.log.error(`Failed to add new client (${err.code}) to db name:${data.name}, id:${data.id}`)

      // Return error
      if (typeof callback === 'function') return callback(err, null)
    })
}
