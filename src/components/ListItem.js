export default function ListItem({ actor }) {
  return (
    <li className="py-1">
      <div className="flex space-x-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center">
            <p className="mt-1 mx-auto max-w-2xl text-lg text-indigo-200 text-center">
              {actor}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
