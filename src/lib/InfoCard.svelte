<script>
    export let title;
    export let content;
    export let num;
    export let positive;
</script>

<main>
    <h1 class="title">{title}</h1>
    <div class="wrapper">
        {#if positive}
            <img
                src="https://firebasestorage.googleapis.com/v0/b/charger-project.appspot.com/o/arrow_upward_FILL0_wght400_GRAD0_opsz48.svg?alt=media&token=212ad2ea-c761-4b58-b4e1-be370b1718bf"
                alt="arrow up"
            />
        {:else}
            <img
                alt="arrow down"
                src="https://firebasestorage.googleapis.com/v0/b/charger-project.appspot.com/o/arrow_downward_FILL0_wght400_GRAD0_opsz48.svg?alt=media&token=43fa1208-3a7f-4255-81d4-bae04c5ccb52"
            />
        {/if}
        <span>
            <p class="num {positive && 'positive'}">{num}</p>
        </span>
    </div>
    <p class="content">{content}</p>
</main>

<style>
    main {
        flex: 1;
        margin: 30px 20px;
        padding: 10px;
        border-radius: 5px;
        -webkit-box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    span {
        display: flex;
        justify-content: center;
        text-align: center;
        font-weight: 900;
    }

    div {
        display: flex;
        justify-content: center;
        text-align: center;
    }

    p {
        margin: 0;
        font-size: 1.5rem;
    }

    .wrapper {
        display: flex;
        justify-content: center;
        text-align: center;
    }

    .num {
        position: relative;
        top: 25%;
        color: red;
    }

    .positive {
        color: green;
    }
</style>
