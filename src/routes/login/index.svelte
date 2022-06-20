<script>
    import Button from "$lib/Button.svelte";
    import { status, credentials } from "../../stores/login";
    import { goto } from "$app/navigation";

    let username = "";
    let password = "";
    let error;
    const now = new Date();
    const later = new Date(now).setMinutes(now.getMinutes() + 30).toString();
    const handleClick = async () => {
        $status.pending = true;
        $status.posted = false;
        $status.failed = false;
        const res = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
        if (res.ok) {
            $status.pending = false;
            $status.posted = true;
            $status.failed = false;
            const jsonRes = await res.json();
            $credentials.accessToken = jsonRes;
            sessionStorage.setItem("token" ,jsonRes);
            goto("/dashboard");
        } else {
            $status.pending = false;
            $status.posted = false;
            $status.failed = true;
            const jsonRes = await res.json();
            error = jsonRes;
        }
    };
</script>

<main class="main-container">
    <label for="username">Username</label>
    <input
        placeholder="Username"
        type="text"
        id="username"
        bind:value={username}
    />
    <label for="password">Password</label>
    <input
        placeholder="Password"
        type="password"
        id="password"
        bind:value={password}
    />
    <Button
        on:click={handleClick}
        content="LOGIN"
        primary
        disabled={$status.pending || $status.posted || $status.failed}
    />
    {#if $status.failed}
        <p class="error">{error} refresh to try again</p>
    {/if}
</main>

<style>
    input {
        margin-bottom: 20px;
        padding: 5px;
        width: 300px;
    }

    label {
        margin-bottom: 10px;
    }

    .error {
        color: red;
    }

    .main-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transform: translate(-50%, -50%);
        position: fixed;
        top: 50%;
        left: 50%;
    }
</style>
