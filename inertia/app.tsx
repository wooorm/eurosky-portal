import './css/app.css'
import { ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import.meta.glob(['../data/icons/**'])

const appName = import.meta.env.VITE_APP_NAME || 'Eurosky'
createInertiaApp({
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => <Layout children={page} />
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  title: (title: string) => (title ? `${title} | ${appName}` : appName),
  progress: {
    color: '#9ac2ff',
  },
})
