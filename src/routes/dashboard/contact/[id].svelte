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
    import { goto } from "$app/navigation";
    export let id;

    let _id;
    let name;
    let lName;
    let date;
    let subj;
    let desc;
    let email;

    let text;
    let html;
    let sent;
    let error;

    onMount(async () => {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}contact/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    token: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );
        if (res.status === 403 || res.status === 401) {
            goto("/login");
        };
        const data = await res.json();
        _id = data._id;
        name = data.name;
        lName = data.lName;
        date = data.date;
        subj = data.subj;
        desc = data.desc;
        email = data.email;
    });

    const handleSend = async (e)=> {
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
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}contact/send`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(info)
            }
        );
        if (res.status === 403 || res.status === 401) {
            goto("/login");
        };
        if(res.status === 200){
            sent = true;
        };
        if(res.status === 400){
            error = true;
        }
    };
    $: console.log(html);
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
        <textarea name="response" id="response" cols="30" rows="10" bind:value={text}></textarea>

        <label for="response-html">Enter your response with some HTML for styling</label>
        <textarea name="response-html" id="response-html" cols="30" rows="10" bind:value={html}></textarea>
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

    label{
        margin:10px 0;
    }

    h2{
        margin:10px 0;
    }

    .line {
        margin: 20px 30px;
    }

    .form{
        display: flex;
        flex-direction: column;
        width: 50%;
    }

    .positive{
        color: green;
    }

    .error{
        color: red;
    }

</style>
