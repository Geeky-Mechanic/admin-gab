<script context="module">
    export async function load({ params }) {
        return {
            props: {
                id: params.id,
            },
        };
    }
</script>

<script>
    import { onMount } from "svelte";

    export let id;

    let _id;
    let begHour;
    let completed;
    let confirmed;
    let email;
    let endHour;
    let lastName;
    let name;
    let phoneNumber;



    onMount(async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}book/${id}`, {
            headers: {
                "Content-Type": "application/json",
                token: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        const resData = await res.json();
        const data = resData;

        _id = data._id;
        begHour = data.begHour;
        completed = data.completed;
        confirmed = data.confirmed;
        email = data.email;
        endHour = data.endHour;
        lastName = data.lastName;
        name = data.name;
        phoneNumber = data.phoneNumber;

        if (resData.status === 403 || resData.status === 401) {
            return new Response(null, {
                status: 302,
                headers: {
                    location: "/login",
                },
            });
        }
    });

    const handleConfirm = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}book/confirm`, {
            headers: {
                "Content-Type": "application/json",
                token: `Bearer ${sessionStorage.getItem("token")}`,
            },
            method: "POST",
            body: JSON.stringify({ id: _id }),
        });
        if (res.ok) {
            const data = await res.json();
            confirmed = data.confirmed;
        } else {
            console.log(res);
        }
    };

    const handleCompleted = async () => {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}book/completed`,
            {
                headers: {
                    "Content-Type": "application/json",
                    token: `Bearer ${sessionStorage.getItem("token")}`,
                },
                method: "POST",
                body: JSON.stringify({ id: _id }),
            }
        );
        if (res.ok) {
            const data = await res.json();
            completed = data.completed;
        } else {
            console.log(res);
        }
    };
</script>

<main>
    <div class="line">
        <p>ID :</p>
        {_id}
    </div>

    <div class="line">
        <p>Name :</p>
        {name}
    </div>

    <div class="line">
        <p>Last Name :</p>
        {lastName}
    </div>

    <div class="line">
        <p>Email :</p>
        {email}
    </div>

    <div class="line">
        <p>Phone Number :</p>
        {phoneNumber}
    </div>

    <div class="line">
        <p>Beginning Hour :</p>
        {new Date(begHour)}
    </div>

    <div class="line">
        <p>End Hour :</p>
        {new Date(endHour)}
    </div>

    <div class="line">
        <p>Completed :</p>
        {#if completed}
            Yes
        {:else}
            <button on:click={handleCompleted}>Completed</button>
        {/if}
    </div>

    <div class="line">
        <p>Confirmed :</p>
        {#if confirmed}
            Yes
        {:else}
            <button on:click={handleConfirm}>Confirm</button>
        {/if}
    </div>
</main>

<style>
    main {
        flex: 5;
    }

    p {
        font-weight: 800;
        display: inline;
    }

    button {
        padding: 5px;
        border: none;
        background-color: lightgreen;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }

    .line {
        margin: 20px 30px;
    }
</style>
