const {
  createDatabase,
  dropDatabase,
  fresh,
  migrate,
  rollback,
  status,
} = require("./migrator")
const { runSeed } = require("./seeder")

module.exports = {
  createDatabase,
  dropDatabase,
  fresh,
  migrate,
  rollback,
  status,
  runSeed,
}
