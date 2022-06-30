<script>
    import { goto, prefetch } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    export let items;
    let activeItem;

    onMount(()=> {
        if($page.url.pathname === "/dashboard"){
            activeItem = "Dashboard";
        } else if ($page.url.pathname === "/dashboard/bookings") {
            activeItem = "Bookings";
        } else if ($page.url.pathname === "/dashboard/contact"){
            activeItem = "Complaints";
        } else if ($page.url.pathname === "/dashboard/pastbookings"){
            activeItem = "PastBookings";
        };
    });

</script>

<div class="navbar">
    <div class="nav-left">
        <span class="nav-logo">Logo</span>
    </div>
    <div class="nav-wrapper">
        {#each items as item}
            <div
                class="nav-item"
                on:click={() => {activeItem = item.name; goto(`/${item.ref}`)}}
                on:mouseenter={() => prefetch(`/${item.ref}`)}
            >
                <p class:active={item.name === activeItem}>{item.name}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .navbar {
        flex: 1;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: crimson;
        margin: 0 0 0 0;
        /* --->  choose right color and style better  <--- */
    }

    .nav-logo {
        font-weight: 800;
        font-size: 3rem;
    }

    .nav-left {
        padding: 10px;
    }

    .active {
        border-bottom: 2px solid crimson;
    }
    .nav-wrapper {
        background-color: lightskyblue;
    }

    .nav-item {
        cursor: pointer;
        text-align: center;
        margin: 5px 0px;
        padding: 25px 10px;
    }
</style>
