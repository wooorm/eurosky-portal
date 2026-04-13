import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import { termsRequestValidator } from '#validators/legal'
import LegalDocumentsCollection, {
  type LegalDocument,
  type LegalDocuments,
} from '#collections/legal'
import LegalDocumentsTransformer from '#transformers/legal_documents_transformer'

export type RenderedDocuments = {
  terms: LegalDocument & { rendered: string }
  privacy: LegalDocument & { rendered: string }
}

export default class RegistrationController {
  private async loadLegalDocuments(): Promise<LegalDocuments> {
    const query = await LegalDocumentsCollection.load()
    const documents = await query.all()
    return documents
  }

  private renderLegalDocument(document: LegalDocument, view: HttpContext['view']) {
    if (!document) return undefined

    return view.render('markdown', {
      document: app.makePath('data', document.filename),
    })
  }

  private async transformLegalDocuments(
    documents: LegalDocuments,
    view: HttpContext['view']
  ): Promise<RenderedDocuments> {
    const [renderedTerms, renderedPrivacy] = await Promise.all([
      this.renderLegalDocument(documents.terms, view),
      this.renderLegalDocument(documents.privacy, view),
    ])

    const renderedDocuments: RenderedDocuments = {
      terms: { ...documents.terms, rendered: renderedTerms ?? '' },
      privacy: { ...documents.privacy, rendered: renderedPrivacy ?? '' },
    }

    return renderedDocuments
  }

  async create({ inertia, view }: HttpContext) {
    const documents = await this.loadLegalDocuments()
    const renderedDocuments = await this.transformLegalDocuments(documents, view)

    return inertia.render('create-account', {
      legalDocuments: inertia.always(LegalDocumentsTransformer.transform(renderedDocuments)),
    })
  }

  async onboarding({ auth, inertia, view }: HttpContext) {
    const account = await auth.getUserOrFail().getAccount()
    const documents = await this.loadLegalDocuments()
    const renderedDocuments = await this.transformLegalDocuments(documents, view)

    return inertia.render('onboarding', {
      termsUpdated:
        !!account.termsAcceptedAt && account.termsAcceptedAt < documents.terms.updatedAt,
      privacyUpdated:
        !!account.termsAcceptedAt && account.termsAcceptedAt < documents.privacy.updatedAt,
      legalDocuments: inertia.always(LegalDocumentsTransformer.transform(renderedDocuments)),
    })
  }

  async storeAcceptance({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await request.validateUsing(termsRequestValidator, {
      messagesProvider: {
        getMessage(defaultMessage, rule, field) {
          if (rule === 'required' && field.name === 'terms') {
            return 'You must accept the terms of service & privacy policy to continue'
          }
          return defaultMessage
        },
      },
    })

    await Account.updateOrCreate({ did: user.did }, { termsAcceptedAt: DateTime.now() })

    return response.redirect().toIntendedRoute('dashboard.show')
  }

  async dismissWelcome({ auth, response }: HttpContext) {
    const account = await auth.getUserOrFail().getAccount()
    await account
      .merge({
        welcomeDismissed: true,
      })
      .save()

    return response.ok({ success: true })
  }
}
