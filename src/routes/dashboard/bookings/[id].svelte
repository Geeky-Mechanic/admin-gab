<script context="module">
    export async function load({ fetch, params }) {
        const res = await fetch(`/api/bookings/${params.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const resData = await res.json();

        return {
            props: {
                data: resData,
            },
        };
    }
</script>

<script>
    export let data;
    let error;
    let _id = data._id;
    let begHour = data.begHour;
    let completed = data.completed;
    let confirmed = data.confirmed;
    let email = data.email;
    let endHour = data.endHour;
    let lastName = data.lastName;
    let name = data.name;
    let phoneNumber = data.phoneNumber;

    const handleConfirm = async () => {
        const res = await fetch(`/api/bookings/confirm`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ id: _id, email }),
        });
        if (res.ok) {
            const resdata = await res.json();
            confirmed = true;
        } else {
            error = await res.json();
            console.log(res);
        }
    };

    const handleCompleted = async () => {
        const res = await fetch(
            `/api/bookings/completed`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ id: _id, email }),
            }
        );
        if (res.ok) {
            completed = true;
        } else {
            console.log(res);
        }
    };
</script>

<main>
    {#if error}
    {error}
    {/if}
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
