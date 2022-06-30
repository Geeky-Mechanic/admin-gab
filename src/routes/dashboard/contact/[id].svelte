<script context="module">
    export async function load({ params, fetch }) {
        const id = params.id;
        const res = await fetch(`/api/contact/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        return {
            props: {
                data,
            },
        };
    }
</script>

<script>
    export let data;

    let _id = data._id;
    let name = data.name;
    let lName = data.lName;
    let date = data.date;
    let subj = data.subj;
    let desc = data.desc;
    let email = data.email;

    let text;
    let html;
    let sent;
    let error;

    const handleSend = async (e) => {
        error = false;
        sent = false;
        const info = {
            email,
            subj,
            text,
            email,
            html,
            _id,
        };
        const res = await fetch(`/api/contact/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info),
        });

        if (res.status === 200) {
            sent = true;
        }
        if (res.status !== 200) {
            error = true;
        }
    };
</script>

<main>
    <div class="info">
        <h2>Client issue</h2>
        <div class="line">
            <p>ID :</p>
            {_id}
        </div>
        <div class="line">
            <p>Name :</p>
            {name}
        </div>
        <div class="line">
            <p>Last Name:</p>
            {lName}
        </div>
        <div class="line">
            <p>Date Submitted :</p>
            {new Date(date)}
        </div>
        <div class="line">
            <p>Subject :</p>
            {subj}
        </div>
        <div class="line">
            <p>Description :</p>
            {desc}
        </div>
        <div class="line">
            <p>Email :</p>
            {email}
        </div>
    </div>
    <div class="form">
        <h2>Your response</h2>
        <label for="response">Enter your textual response</label>
        <textarea
            name="response"
            id="response"
            cols="30"
            rows="10"
            bind:value={text}
        />

        <label for="response-html"
            >Enter your response with some HTML for styling</label
        >
        <textarea
            name="response-html"
            id="response-html"
            cols="30"
            rows="10"
            bind:value={html}
        />
        <button on:click={handleSend}>SEND</button>
    </div>
    {#if sent}
        <p class="positive">Response succesfully sent</p>
    {/if}
    {#if error}
        <p class="error">Something went wrong, please refresh and try again</p>
    {/if}
</main>

<style>
    main {
        flex: 5;
        padding-left: 20px;
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
        width: 80px;
        margin: 10px 0;
    }

    label {
        margin: 10px 0;
    }

    h2 {
        margin: 10px 0;
    }

    .line {
        margin: 20px 30px;
    }

    .form {
        display: flex;
        flex-direction: column;
        width: 50%;
    }

    .positive {
        color: green;
    }

    .error {
        color: red;
    }
</style>
