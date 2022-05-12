import { writable } from 'svelte/store';

const status = writable(
    {
        posting : false,
        posted : false,
        failed : false,
    }
);

const credentials = writable(
    {
        accessToken : null,
    }
);

export { status, credentials };