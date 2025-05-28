import { component$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const Navigator = component$((props) => {
  return (
    <Link
      href={props.url + "#content"}
    >
      <div>
        <span class="hover:text-gray-300 font-semibold transition-colors duration-500 cursor-pointer">
          {props.name.toUpperCase()}
        </span>
      </div>
    </Link>
  );
});