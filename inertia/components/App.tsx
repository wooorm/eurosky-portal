import { Data } from '@generated/data'
import { Avatar } from '~/lib/avatar'
import { ClickableCard } from '~/lib/card'
import { Heading } from '~/lib/heading'
import { Text } from '~/lib/text'

export function App({ app }: { app: Data.App }) {
  return (
    <li className="col-span-1 flex rounded-md shadow-xs dark:shadow-none">
      <ClickableCard
        href={app.url}
        target="_blank"
        className="w-full focus:outline-hidden p-4 flex md:flex-col flex-row gap-4"
      >
        <Avatar
          square
          src={app.icon.path}
          className={`size-12 mb-2 bg-${app.icon.fallback.color}-400 text-white outline-none!`}
          initials={app.icon.fallback.initials}
        />
        <div>
          <Heading level={4} className="text-base!">
            {app.name}
          </Heading>
          <Text>{app.summary}</Text>
        </div>
      </ClickableCard>
    </li>
  )
}
