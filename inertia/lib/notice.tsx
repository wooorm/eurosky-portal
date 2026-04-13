import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

type NoticeProps = {
  text: string
  title: string
}

export default function Notice({ text, title }: NoticeProps) {
  return (
    <div className="rounded-md bg-brand/30 p-4 my-6 outline outline-brand/80 dark:outline-brand/75">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon aria-hidden="true" className="size-8 text-brand" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-black dark:text-white">{title}</h3>
          <div className="mt-1 text-sm text-black/70 dark:text-white/80">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
