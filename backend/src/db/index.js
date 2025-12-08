import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import fsSync from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', '..', 'data')
if (!fsSync.existsSync(dataDir)) fsSync.mkdirSync(dataDir, { recursive: true })

const file = join(dataDir, 'db.json')

const db = {
	data: { users: [], otps: [] },
	async read() {
		try {
			const raw = await fs.readFile(file, 'utf8')
			this.data = JSON.parse(raw)
		} catch (e) {
			// create default
			this.data = this.data || { users: [], otps: [] }
			await this.write()
		}
	},
	async write() {
		await fs.writeFile(file, JSON.stringify(this.data, null, 2), 'utf8')
	}
}

// Initialize immediately
await db.read()

export default db
