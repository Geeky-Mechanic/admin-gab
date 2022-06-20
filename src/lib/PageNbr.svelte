<script>
    import { onMount } from "svelte";
    export let number;
    export let id;
    export let currPage;
    let maxNums = 10;
    let numbers = [];

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
    $: numbers.forEach((n)=> {console.log((n >= currPage + maxNums) || (n <= currPage - maxNums));})
</script>

<main>
    {#if number >= 10 && numbers !== []}
    {#if currPage - maxNums >= numbers[0]}
            <span>...</span>
        {/if}
        {#each numbers as number}
            {#if number >= 10}
                <button
                    name={id}
                    on:click
                    class:active={number === currPage}
                    value={number}
                    hidden={(number >= currPage + maxNums) || (number <= currPage - maxNums)}>{number}</button
                >
            {:else}
                <button
                    name={id}
                    on:click
                    class={number === currPage && "active"}
                    value={number}>{number}</button
                >
            {/if}
        {/each}
        {#if currPage + maxNums <= numbers[numbers.length - 1]}
            <span>...</span>
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
    .invisible{
        display: none;
    }
</style>
