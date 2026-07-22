import logger from '@adonisjs/core/services/logger'
import { Job } from '@adonisjs/queue'
import type { DidString } from '@atproto/lex'
import activityService from '#services/activity_service'

interface Options {
  did: DidString
}

export default class BackfillJob extends Job<Options> {
  async execute(): Promise<undefined> {
    await activityService.backfill(this.payload.did)
  }

  async failed(err: Error): Promise<undefined> {
    logger.warn({ did: this.payload.did, err }, 'activity: cannot backfill user')
  }
}
