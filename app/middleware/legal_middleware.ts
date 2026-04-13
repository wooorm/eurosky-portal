import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import LegalDocuments from '#collections/legal'
import { DateTime } from 'luxon'

export default class LegalMiddleware {
  async handle({ request, response, auth }: HttpContext, next: NextFn) {
    const account = await auth.getUserOrFail().getAccount()

    const query = await LegalDocuments.load()
    const documents = await query.all()

    if (!documents.terms || !documents.privacy) {
      return response.internalServerError('Missing terms of service or privacy policy document')
    }

    const now = DateTime.now()
    const acceptanceRequired =
      // if we haven't accepted legal documents yet:
      account.termsAcceptedAt === null ||
      // or the Terms have updated today or in the past
      (account.termsAcceptedAt < documents.terms.updatedAt && now >= documents.terms.updatedAt) ||
      // or the Privacy policy has updated today or in the past
      (account.termsAcceptedAt < documents.privacy.updatedAt && now >= documents.privacy.updatedAt)

    const isOnboarding = request.url().startsWith('/onboarding')
    if (!acceptanceRequired && isOnboarding) {
      return response.redirect().toRoute('dashboard.show')
    }

    if (acceptanceRequired && !isOnboarding) {
      return response.redirect().withIntendedUrl().toRoute('account.onboarding')
    }

    return await next()
  }
}
