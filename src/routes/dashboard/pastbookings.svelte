<script context="module">
  export async function load({ fetch }) {
    const res = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection: JSON.stringify({}),
      },
    });
      const bookData = await res.json();

      const res2 = await fetch(
        `/api/stats/number`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
  import TableColumn from "$lib/TableColumn.svelte";
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

  async function query (skipNum) {
    console.log(skipNum);
    const res = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection: JSON.stringify({}),
        skip: skipNum,
      },
    });
    return res;
  };

  const handlePageNavigate = async (e) => {
    const skipNum = (parseInt(e.target.value) - 1) * 10;
    const btnId = e.target.name;
    const res = await query(skipNum);
    const data = await res.json();
    console.log(data);
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
      number={nbrOfCompleted}
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
