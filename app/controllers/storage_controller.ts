import type { HttpContext } from '@adonisjs/core/http'
import * as lexicon from '#lexicons'

/**
 * Total blobs to get; mostly to prevent DDoSing the server.
 * Better APIs and actual pagination needed in the future.
 */
const MAX = 5000

/**
 * Blobs per page; the requests only get a list of IDs so the number can be big.
 * Needs to be between `1` and `1000`.
 */
const PAGE_SIZE = 1000

/**
 * Get needed data and show the storage page.
 */
export default class StorageController {
  /**
   * Gets a list of all blobs (capped) and renders the storage page.
   */
  async show(context: HttpContext) {
    const { auth, inertia, logger } = context
    const { client, did } = auth.getUserOrFail()
    const blobs: Array<string> = []
    let cursor: string | undefined

    try {
      do {
        const response = await client.xrpc(lexicon.com.atproto.sync.listBlobs.main, {
          params: { cursor, did, limit: PAGE_SIZE },
        })

        const nextCursor = response.body.cursor
        const cids = response.body.cids
        const remaining = MAX - blobs.length

        if (remaining > 0) {
          blobs.push(...cids.slice(0, remaining))
        }

        if (blobs.length >= MAX) {
          logger.info({ did }, 'Cannot get more blobs than hard limit')
          break
        }

        cursor = nextCursor
      } while (cursor)
    } catch (error) {
      logger.warn({ did, error }, 'Cannot get blobs')
    }

    return inertia.render('storage/show', { blobs, did })
  }
}
