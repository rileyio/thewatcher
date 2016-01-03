var Client = function (DB) {
  var self = this
  self.DB = DB
}

Client.prototype.get = function (data, callback) {
  var self = this

  console.log('TheWatcher >> Server >> DB::Client(lookup:%s)'.yellow, data.name)

  self.DB('clients')
    .select('*')
    .where({
      'name': data.name,
      'sha_id': data.sha_id
    })
    .then(function (ret) {
      if (ret.length > 0) {
        console.log('TheWatcher >> Server >> DB::Client(lookup:%s)->Success'.green, data.name)

        // Return lookup data
        return callback(ret[0])
      } else {
        console.log('TheWatcher >> Server >> DB::Client(lookup:%s)->Failed'.red, data.name)

        // Return lookup data
        return callback(null)
      }
    })
}

Client.prototype.update = function (data) {
  var self = this

  console.log('TheWatcher >> Server >> DB::Client(update:%s)'.yellow, data.name)

  self.DB('clients')
    .where({
      'name': data.name,
      'sha_id': data.sha_id
    })
    .update({
      session: data.session,
      updated_at: self.DB.fn.now()
    })
    .then(function (ret) {
      if (ret) {
        console.log('TheWatcher >> Server >> DB::Client(update:%s)->Success'.green, data.name)
      } else {
        console.log('TheWatcher >> Server >> DB::Client(update:%s)->Failed'.red, data.name)
      }

      // Return lookup data (No callback)
      return ret
    })
}

Client.prototype.add = function (data, callback) {
  var self = this

  console.log('TheWatcher >> Server >> DB::Client(add:%s)'.yellow, data.name)

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
        console.log('TheWatcher >> Server >> DB::Client(add:%s)->Success'.green, data.name)
      } else {
        console.log('TheWatcher >> Server >> DB::Client(add:%s)->Failed'.red, data.name)
      }

      // Return insert pkey value on successful
      return callback(ret)
    })
}

module.exports = Client
