import { Link } from '~/lib/link'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '~/lib/navbar'
import { Logo } from './Logo'
import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/lib/button'
import { Text } from '~/lib/text'
import { useAuth } from '~/utils/use_auth'
import { ThemeToggle } from './ThemeToggle'
import { UserAvatar } from './UserAvatar'

export default function DashboardNavbar({ className }: React.ComponentProps<'div'>) {
  const user = useAuth()

  return (
    <Navbar className={className}>
      <Link route="home" aria-label="Home" className="rounded-sm">
        <Logo />
      </Link>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem className="hidden md:flex pointer-events-none" as={'div'}>
          <UserAvatar user={user} />
          <Text>@{user.handle}</Text>
        </NavbarItem>

        <Form route="oauth.logout" className="justify-stretch hidden lg:flex">
          <Button type="submit" outline>
            Logout
          </Button>
        </Form>
        <ThemeToggle />
      </NavbarSection>
    </Navbar>
  )
}
