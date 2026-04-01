interface Props {
  title: string
  headingLevel?: 1 | 2 | 3 | 4 | 5
  description?: string
}

export function Heading({ title, description, headingLevel = 2 }: Props) {
  const getHeading = () => {
    switch (headingLevel) {
      case 3:
        return (
          <h3 className="text-lg font-bold text-slate-900 md:text-xl">
            {title}
          </h3>
        )
      case 4:
        return (
          <h4 className="text-md font-bold text-slate-900 md:text-lg">
            {title}
          </h4>
        )
      case 5:
        return (
          <h5 className="text-base font-bold text-slate-900 md:text-md">
            {title}
          </h5>
        )

      default:
        return (
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {title}
          </h2>
        )
    }
  }
  return (
    <div>
      {getHeading()}
      <p className="text-slate-500">{description}</p>
    </div>
  )
}
