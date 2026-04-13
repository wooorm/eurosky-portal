import { PolicyForm } from '~/components/PolicyForm'
import Card from '~/lib/card'
import { Text } from '~/lib/text'
import { Container } from '~/lib/container'
import { InertiaProps } from '~/types'
import { Data } from '@generated/data'
import { Head } from '@inertiajs/react'
import { Link } from '~/lib/link'

export default function CreateAccount(
  props: InertiaProps<{
    legalDocuments: Data.LegalDocuments
  }>
) {
  return (
    <div className="bg-neutral-50 dark:bg-slate-900 min-h-dvh-minus-35">
      <Head title="Create account" />
      <Container className="py-10 md:pt-24">
        <Card className="my-10 w-full md:w-3/4 lg:w-1/2 m-auto p-4">
          <h1 className="mx-auto max-w-4xl mb-2 text-center font-display text-3xl leading-[1.2] font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-5xl">
            Create Your <div className="text-brand">Eurosky Account.</div>
          </h1>
          <Text className="text-center text-slate-600">
            Before we get started, please review and accept our terms.
          </Text>
          <PolicyForm
            route="oauth.signup"
            terms={props.legalDocuments.terms}
            privacy={props.legalDocuments.privacy}
          />
          <Text className="text-center">
            Already have an account?{' '}
            <Link route="auth.login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </Text>
        </Card>
      </Container>
    </div>
  )
}
