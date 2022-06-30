<script context="module">
    export async function load({fetch}){
        const res = await fetch(`/api/contact`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return {
            props: {
                data,
            }
        }
    }
</script>
<script>
    import { goto } from "$app/navigation";
    import PageNbr from "$lib/PageNbr.svelte";

    export let data;
    let currPage;

    const handleClick = (e) => {
        goto(`/dashboard/contact/${e.target.value}`);
    };

    const handlePageNavigate = async (e) => {
        const skipNum = (parseInt(e.target.value) - 1) * 10;

        const res = await fetch(
            `/api/contact`,
            {
                headers: {
                    "Content-Type": "application/json",
                    skip: skipNum,
                },
            }
        );
        data = await res.json();
        currPage = parseInt(e.target.value);
    };
</script>

<main>
    <h1>List of pending customer questions/complaints</h1>
        <div class="container">
            <div class="row">
                <div class="cell title">Name</div>
                <div class="cell title">Last Name</div>
                <div class="cell title">Date</div>
                <div class="cell title">Subject</div>
                <div class="cell title">Link</div>
            </div>
            {#each data as msg}
                <div class="row">
                    <div class="cell">
                        {msg.name}
                    </div>
                    <div class="cell">
                        {msg.lName}
                    </div>
                    <div class="cell">
                        {new Date(msg.date)}
                    </div>
                    <div class="cell">
                        {msg.subj}
                    </div>
                    <div class="cell">
                        <button on:click={handleClick} value={msg._id}
                            >View Message</button
                        >
                    </div>
                </div>
            {/each}
        </div>

        <PageNbr
            on:click={handlePageNavigate}
            number={data.length}
            id={"contact"}
            {currPage}
        />
</main>

<style>
    main {
        flex: 5;
    }

    h1 {
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

    .container {
        width: 90%;
        margin: 20px auto;
    }

    .row {
        display: flex;
        border: 1px solid lightgray;
        border-bottom: none;
        align-items: center;
        justify-content: center;
    }

    .container > .row:last-child{
        border-bottom: 1px solid lightgray;
    }

    .cell {
        padding: 10px;
        width: 100%;
        flex: 1;
        border-right: 1px solid lightgray;
        align-self: stretch;
        text-align: center;
    }

    .cell:last-child {
        border-right: none;
    }

    .title {
        font-weight: 600;
        font-size: 1.2rem;
    }
</style>
