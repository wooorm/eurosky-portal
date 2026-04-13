import type { RenderedDocuments } from '#controllers/account_controller'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class LegalDocumentsTransformer extends BaseTransformer<RenderedDocuments> {
  toObject() {
    return {
      terms: this.resource.terms.rendered,
      privacy: this.resource.privacy.rendered,
    }
  }
}
