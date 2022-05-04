function Clue(props) {
  return (
    <div className={props.className}>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
        <div className="text-center">
          <dt className="text-xl font-extrabold tracking-tight text-gray-900">
            {props.clue.name}
          </dt>
          <dd className="text-xl font-extrabold tracking-tight text-gray-600">
            {props.clue.value}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default Clue;
