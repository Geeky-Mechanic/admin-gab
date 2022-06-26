<script>
    import { onMount, createEventDispatcher } from "svelte";
    export let number;
    export let id;
    export let currPage;
    let maxNums = 5;
    let numbers = [];
    const dispatch = createEventDispatcher();

    onMount(() => {
        for (let i = 1; i <= number; i++) {
            if (i / 10 - Math.floor(i / 10) === 0) {
                numbers.push(i / 10);
                numbers = numbers;
            }
        }
        if (number % 10 !== 0) {
            numbers.push(numbers.length + 1);
            numbers = numbers;
        }
    });

</script>

<main>
    {#if number >= 10 && numbers !== []}
        {#if currPage - maxNums >= numbers[0]}
            <span>...</span>
        {/if}
        {#each numbers as number}
            <button
                name={id}
                on:click
                class:active={number === currPage}
                value={number}
                hidden={number >= currPage + maxNums ||
                    number <= currPage - maxNums}>{number}</button
            >
        {/each}
        {#if currPage + maxNums <= numbers[numbers.length - 1]}
            <button name={id} on:click value={currPage + maxNums}>...</button>
        {/if}
    {:else}
        <button on:click>1</button>
    {/if}
</main>

<style>
    main {
        width: 100%;
        text-align: center;
    }
    button {
        border: none;
        background-color: white;
        font-weight: 700;
        font-size: 1rem;
        margin: 0 10px;
        cursor: pointer;
    }
    .active {
        border-bottom: 2px solid black;
    }
</style>
