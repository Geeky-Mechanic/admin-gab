<script>
export let title;
export let cells;
export let id;
</script>


<main>
    {#if title === "Confirm"}
        <h4>{title}</h4>
        {#each cells as cell, i}
            {#if cell === true}
                <p>Confirmed</p>
            {:else}
                <div class="btn-wrapper">
                    <button id={id[i]} on:click>Click to confirm</button>
                </div>
            {/if}
        {/each}
    {:else if title === "Hour"}
        <h4>{title}</h4>
    {#each cells as cell}
        <p>{new Date(JSON.parse(cell)).toLocaleString()}</p>
    {/each}
    {:else if title === "Completed"}
        <h4>{title}</h4>
        {#each cells as cell}
                <p class={cell && "true" || "false"}>{cell}</p>
        {/each}
    {:else}
    <h4>{title}</h4>
    {#each cells as cell}
        <p>{cell}</p>
    {/each}
    {/if}
</main>

<style>
    main{
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px lightgray solid;
    }

    h4{
        padding: 0 0 0 3px;
        text-align: center;
    }

    p{
        margin: 0;
        padding: 16px 0 16px 3px;
        border-top: 2px lightgray solid;
        text-align: center;
    }

    button{
        padding: 5px;
        border: none;
        background-color: lightgreen;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }

    .btn-wrapper{
        padding: 14.5px 0 10.5px 3px;
        border-top: 2px lightgray solid;
        text-align: center;
    }

    .true {
        color: green;
    }
    .false {
        color: red;
    }
    </style>