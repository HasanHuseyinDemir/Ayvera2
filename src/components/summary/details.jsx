import { component$, Slot } from "@builder.io/qwik";

export default component$(({title}) => {
    return(<details class="bg-white rounded shadow p-4">
            <summary class="font-semibold text-cyan-700 cursor-pointer">Alarm sistemlerinizin garantisi var mı?{title}</summary>
            <div class="mt-2 text-gray-700"><Slot/></div>
          </details>
    )
})