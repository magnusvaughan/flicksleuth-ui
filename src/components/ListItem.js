export default function ListItem({ actor }) {
    return (
      <article className="flex items-start space-x-6 mt-5">
        <div className="min-w-0 relative flex-auto">
          <h2 className="font-semibold text-slate-900 truncate pr-20">{actor}</h2>
        </div>
      </article>
    )
  }
