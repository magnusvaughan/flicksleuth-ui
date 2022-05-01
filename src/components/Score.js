import { react, useEffect, useState } from "react";

function Score(props) {
  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-8">
      <div className="pt-6 text-center">
        <dt className="text-base font-medium text-gray-500">Score</dt>
        <dd className="text-3xl font-extrabold tracking-tight text-gray-900">
          {props.score}
        </dd>
      </div>
    </dl>
  );
}

export default Score;
