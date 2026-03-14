import { Link } from '~/lib/link'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '~/lib/navbar'
import { Logo } from './Logo'
import { usePage } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import * as ThemeUtils from '~/utils/darkmode'
import { type Theme } from '~/utils/darkmode'

export default function PublicNavbar() {
  const { props } = usePage()
  const [theme, setTheme] = useState<Theme>(ThemeUtils.getTheme())
  let themeIndex = ThemeUtils.themes.indexOf(theme)

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if ((theme === 'system' && ThemeUtils.prefersDark()) || theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    themeIndex = (themeIndex + 1) % ThemeUtils.themes.length
    const newTheme = ThemeUtils.themes[themeIndex]

    ThemeUtils.setTheme(theme)
    setTheme(newTheme)
  }, [theme])

  return (
    <Navbar className="px-4">
      <Link route="home" aria-label="Home">
        <Logo className="size-10 sm:size-8" />
      </Link>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="#" current>
          About
        </NavbarItem>
        <NavbarItem href="#apps">Apps</NavbarItem>
        <NavbarItem href="#">Privacy</NavbarItem>
        <NavbarItem onClick={toggleTheme}>
          {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'} theme
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  )
}
