<script>
  import TableColumn from "$lib/TableColumn.svelte";
  import PageNbr from "$lib/PageNbr.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let completedBookings;
  let missed;
  let nbrMissed;
  let nbrOfCompleted;
  let completedCurrPage = 1;
  let missedCurrPage = 1;

  const completedId = "CompletedPageNbr";
  const missedId = "MissedPageNbr";

  async function query (skipNum) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}book/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
        projection: JSON.stringify({}),
        skip: skipNum,
      },
    });
    return res;
  };

  onMount(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}book/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
        projection: JSON.stringify({}),
      },
    });
    if (res.status === 401 || res.status === 403) {
      goto("/login");
    }
      const data = await res.json();
      completedBookings = data.completedBookings;
      missed = data.missed;

      const res2 = await fetch(
        `${import.meta.env.VITE_API_URL}book/stats/number`,
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const data2 = await res2.json();
      nbrMissed = data2.missed;
      nbrOfCompleted = data2.completedBookings;
  });

  const handlePageNavigate = async (e) => {
    const skipNum = (parseInt(e.target.value) - 1) * 10;
    const btnId = e.target.name;
    console.log(skipNum);
    const res = await query(skipNum);

    if(res.status === 403 || res.status === 401){
      goto("/login");
    };
    const data = await res.json();
    if(btnId === completedId){
      completedBookings = data.completedBookings;
      completedCurrPage = parseInt(e.target.value);
    }
    if(btnId === missedId){
      missed = data.missed;
      missedCurrPage = parseInt(e.target.value);
    }
 
  };

</script>

<main>
  {#if completedBookings && missed && nbrMissed && nbrOfCompleted}
    <h2>Completed Bookings</h2>
    <div class="table">
      <TableColumn title="Name" cells={completedBookings.map((b) => b.name)} />
      <TableColumn
        title="Last Name"
        cells={completedBookings.map((b) => b.lastName)}
      />
      <TableColumn
        title="Email"
        cells={completedBookings.map((b) => b.email)}
      />
      <TableColumn
        title="Phone Number"
        cells={completedBookings.map((b) => b.phoneNumber)}
      />
      <TableColumn
        title="Hour"
        cells={completedBookings.map((b) => b.begHour)}
      />
      <TableColumn
        id={completedBookings.map((b) => b._id)}
        title="Completed"
        cells={completedBookings.map((b) => b.completed)}
      />
    </div>
    <PageNbr
      on:click={handlePageNavigate}
      number={200}
      id={completedId}
      currPage={completedCurrPage}
    />
    <h2>Missed Bookings</h2>
    <div class="table">
      <TableColumn title="Name" cells={missed.map((b) => b.name)} />
      <TableColumn title="Last Name" cells={missed.map((b) => b.lastName)} />
      <TableColumn title="Email" cells={missed.map((b) => b.email)} />
      <TableColumn
        title="Phone Number"
        cells={missed.map((b) => b.phoneNumber)}
      />
      <TableColumn title="Hour" cells={missed.map((b) => b.begHour)} />
      <TableColumn
        id={missed.map((b) => b._id)}
        title="Completed"
        cells={missed.map((b) => b.completed)}
      />
    </div>
    <PageNbr
    on:click={handlePageNavigate}
    number={nbrMissed}
    id={missedId}
    currPage={missedCurrPage}
  />
  {:else}
    <h1>Fetching Data please wait</h1>
  {/if}
</main>

<style>
  main {
    flex: 5;
  }
  h2 {
    margin: 30px 0 0 20px;
    text-align: center;
  }
  .table {
    display: flex;
    margin: 10px 20px;
    border: 1px lightgray solid;
  }
</style>
