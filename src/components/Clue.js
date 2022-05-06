function Clue(props) {
  return (
    <div className={props.className}>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
        <div className="text-center">
          <dt className="text-xl font-extrabold tracking-tight text-white">
            {props.clue.name}
          </dt>
          <dd className="mt-1 mx-auto max-w-2xl text-lg text-indigo-200 text-center">
            {props.clue.value}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default Clue;
