export default function ListItem({ actor }) {
  return (
    <li className="py-1">
      <div className="flex space-x-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center">
            <p className="text-lg font-extrabold tracking-tight text-gray-600">
              {actor}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
