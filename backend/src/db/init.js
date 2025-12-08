import db from './index.js'

async function init() {
  await db.read()
  db.data = db.data || { users: [], otps: [] }
  await db.write()
  console.log('DB initialized at', new Date().toISOString())
}

init().catch(err => {
  console.error('DB init failed', err)
  process.exit(1)
})
