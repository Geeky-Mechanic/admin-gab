<script>
    import { afterUpdate } from 'svelte';
    import { goto } from '$app/navigation';
    export let pageUrl;
    export let items;
    
    let activePage;
    
    let activeItem;
    
    afterUpdate(() => {
        activePage = pageUrl.split("/");
        if(activePage[1] === "bookings"){
            activeItem = items[0].name;
        }
        else if(activePage[1] === "contact"){
            activeItem = items[1].name;
        }
        else if(activePage[1] === "pastbookings"){
            activeItem = items[2].name;
        }
    });
    
    </script>
    
    <div class="navbar">
        <div class="nav-left">
            <span class="nav-logo">Logo</span>
        </div>
        <div class="nav-wrapper">
            {#each items as item}
            <div class="nav-item" on:click={() => goto(`/${item.ref}`)}>
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