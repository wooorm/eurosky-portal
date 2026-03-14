import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { ReactElement, useEffect } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/lib/button'
import PublicNavbar from '~/components/PublicNavbar'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  useEffect(() => {
    toast.dismiss()
  }, [usePage().url])

  if (children.props.flash.error) {
    toast.error(children.props.flash.error)
  }

  return (
    <div>
      {children.props.isAuthenticated ? (
        <>
          {/* <span>{children.props.user.initials}</span> */}
          <Form route="oauth.logout">
            <Button type="submit">Logout</Button>
          </Form>
        </>
      ) : (
        <PublicNavbar />
      )}
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
