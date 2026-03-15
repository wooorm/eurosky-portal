import { AtprotoUser } from '@thisismissem/adonisjs-atproto-oauth'
import type { AtIdentifierString } from '@atproto/lex'
import * as lexicon from '#lexicons'
import logger from '@adonisjs/core/services/logger'

export type Profile = lexicon.app.bsky.actor.defs.ProfileViewDetailed

AtprotoUser.macro(
  'fetchProfile',
  async function fetchProfile(this: AtprotoUser, actor: AtIdentifierString) {
    const profile = await this.client
      .xrpc(lexicon.app.bsky.actor.getProfile, {
        params: { actor: actor },
      })
      .catch((err) => {
        logger.error(err, 'Error fetching AtprotoUser profile')
        return undefined
      })

    if (profile?.success) {
      return profile.body
    }

    return undefined
  }
)

declare module '@thisismissem/adonisjs-atproto-oauth' {
  interface AtprotoUser {
    fetchProfile(
      actor: AtIdentifierString
    ): Promise<undefined | lexicon.app.bsky.actor.defs.ProfileViewDetailed>
  }
}
