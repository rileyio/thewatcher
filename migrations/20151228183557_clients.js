exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('clients', function (table) {
      table.increments('id').unique()
      table.string('name', 64).notNullable()
      table.string('sha_id', 128).notNullable().unique()
      table.string('type', 16).notNullable()
      table.float('latitude').nullable
      table.float('longitude').nullable()
      table.string('session', 64).nullable()
      table.timestamp('added_at').defaultTo(knex.fn.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.string('pubkey', 2048).nullable()
    })
  ])
}

exports.down = function (knex, Promise) {
  knex.schema.dropTable('clients')
}
