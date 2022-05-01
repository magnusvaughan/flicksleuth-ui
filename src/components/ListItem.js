export default function ListItem({ actor }) {
  return (
    <li className="py-2">
      <div className="flex space-x-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center">
            <h3 className="text-md font-normal">{actor}</h3>
          </div>
        </div>
      </div>
    </li>
  );
}
