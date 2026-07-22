import { defineConfig, drivers } from '@adonisjs/queue'

export default defineConfig({
  adapters: { database: drivers.database({ connectionName: 'sqlite' }) },
  default: 'database',
  locations: ['./app/jobs/**/*.{js,ts}'],
  worker: {
    /**
     * Max backfills allowed at once; prevents problems on bursts at launch /
     * wild pathological cases.
     *
     * The current choice `200` is a plausible value to start with.
     * Should be revisited later.
     */
    concurrency: 200,
  },
})
