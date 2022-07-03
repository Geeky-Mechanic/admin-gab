<script context="module">
  export async function load({ fetch }) {
    const res = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection: JSON.stringify({}),
      },
    });
    const bookData = await res.json();

    const res2 = await fetch(`/api/stats/number`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const numData = await res2.json();

    if (res.ok && res2.ok) {
      return {
        props: {
          bookData,
          numData,
        },
      };
    }
  }
</script>

<script>
  import PageNbr from "$lib/PageNbr.svelte";

  export let bookData;
  export let numData;

  let completedBookings = bookData.completedBookings;
  let missed = bookData.missed;
  let nbrMissed = numData.missed;
  let nbrOfCompleted = numData.completedBookings;
  let completedCurrPage = 1;
  let missedCurrPage = 1;

  const completedId = "CompletedPageNbr";
  const missedId = "MissedPageNbr";

  async function query(skipNum) {
    const res = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection: JSON.stringify({}),
        skip: skipNum,
      },
    });
    return res;
  }

  const handlePageNavigate = async (e) => {
    const skipNum = (parseInt(e.target.value) - 1) * 10;
    const btnId = e.target.name;
    const res = await query(skipNum);
    const data = await res.json();
    if (btnId === completedId) {
      completedBookings = data.completedBookings;
      completedCurrPage = parseInt(e.target.value);
    }
    if (btnId === missedId) {
      missed = data.missed;
      missedCurrPage = parseInt(e.target.value);
    }
  };
</script>

<main>
  <h2>Completed Bookings</h2>
  <div class="container">
    <div class="row">
      <div class="cell title">Name</div>
      <div class="cell title">Last Name</div>
      <div class="cell title">Email</div>
      <div class="cell title">Phone Number</div>
      <div class="cell title">Hour</div>
      <div class="cell title">Completed</div>
    </div>
    {#each completedBookings as info}
      <div class="row">
        <div class="cell">{info.name}</div>
        <div class="cell">{info.lastName}</div>
        <div class="cell">{info.email}</div>
        <div class="cell">{info.phoneNumber}</div>
        <div class="cell">{new Date(info.begHour)}</div>
        <div class="cell true">{info.completed}</div>
      </div>
    {/each}
  </div>
  <PageNbr
    on:click={handlePageNavigate}
    number={nbrOfCompleted}
    id={completedId}
    currPage={completedCurrPage}
  />
  <h2>Missed Bookings</h2>
  <div class="container">
    <div class="row">
      <div class="cell title">Name</div>
      <div class="cell title">Last Name</div>
      <div class="cell title">Email</div>
      <div class="cell title">Phone Number</div>
      <div class="cell title">Hour</div>
      <div class="cell title">Completed</div>
    </div>
    {#each missed as info}
      <div class="row">
        <div class="cell">{info.name}</div>
        <div class="cell">{info.lastName}</div>
        <div class="cell"><p>{info.email}</p></div>
        <div class="cell">{info.phoneNumber}</div>
        <div class="cell">{new Date(info.begHour)}</div>
        <div class="cell false">{info.completed}</div>
      </div>
    {/each}
  </div>
  <PageNbr
    on:click={handlePageNavigate}
    number={nbrMissed}
    id={missedId}
    currPage={missedCurrPage}
  />
</main>

<style>
  main {
    flex: 5;
  }
  h2 {
    margin: 30px 0 0 20px;
    text-align: center;
  }
  p{
    overflow-wrap: break-word;
    word-wrap: break-word;
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

  .container > .row:last-child {
    border-bottom: 1px solid lightgray;
  }

  .cell {
    padding: 10px;
    width: 100%;
    flex: 1;
    border-right: 1px solid lightgray;
    align-self: stretch;
    text-align: center;
    display: inline;
  }

  .cell:last-child {
    border-right: none;
  }

  .title {
    font-weight: 600;
    font-size: 1.2rem;
  }

  .true {
        color: green;
    }
    .false {
        color: red;
    }
</style>
