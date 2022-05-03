function Clue(props) {
  console.log(props);
  return (
    <div className={props.className}>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
        <div className="pt-6 text-center">
          <dt className="text-base font-medium text-gray-500">
            {props.clue.name}
          </dt>
          <dd className="text-3xl font-extrabold tracking-tight text-gray-900">
            {props.clue.value}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default Clue;
