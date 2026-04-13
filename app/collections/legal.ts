import vine from '@vinejs/vine'
import app from '@adonisjs/core/services/app'
import { Collection } from '@adonisjs/content'
import { loaders } from '@adonisjs/content/loaders'
import type { Infer } from '@vinejs/vine/types'

const legalDocumentSchema = vine.object({
  title: vine.string(),
  filename: vine.string(),
  updatedAt: vine.date({ formats: ['YYYY-MM-DD'] }),
})

const legalDocumentsSchema = vine.object({
  terms: legalDocumentSchema,
  privacy: legalDocumentSchema,
})

const LegalDocumentsCollection = Collection.create({
  schema: legalDocumentsSchema,
  loader: loaders.jsonLoader(app.makePath('data', 'legal.json')),
  cache: app.inProduction,
  views: {
    findByName(data, name: keyof LegalDocuments): LegalDocument | undefined {
      if (name === 'privacy') {
        return data.privacy
      }
      if (name === 'terms') {
        return data.terms
      }
      // Not found:
      return undefined
    },
  },
})

export type LegalDocument = Infer<typeof legalDocumentSchema>
export type LegalDocuments = Infer<typeof legalDocumentsSchema>

export default LegalDocumentsCollection
