<script context="module">
  export async function load({ fetch }) {
    const res = await fetch(`/api/stats/future`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    
    const calendarRes = await fetch(
      `/api/stats/future`,
      {
        headers: {
          "Content-Type": "application/json",
          projection: JSON.stringify({ begHour: 1, endHour: 1, name: 1 }),
        },
      }
    );

    const calendarData = await calendarRes.json();

      /* ---->  Request Numbers  <---------------------------------- */
  const numRes = await fetch(
        `/api/stats/number`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const numData = await numRes.json();

      if(res.ok && calendarRes.ok && numRes.ok){
        return {
          props: {
            data,
            calendarData,
            numData,
          },
        };
      };

  };
</script>
<script>
  import FullCalendar from "svelte-fullcalendar";
  import daygridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import timegridPlugin from "@fullcalendar/timegrid";
  import PageNbr from "$lib/PageNbr.svelte";

  export let data;
  export let calendarData;
  export let numData;

  let upcomingBookings = data.upcomingBookings;
  let nbrOfUpcoming = numData.upcomingBookings;
  let currPage = 1;

  const calendarEvents = calendarData.upcomingBookings.map((b) => {
    return {
      id: b._id,
      title: b.name,
      start: new Date(b.begHour),
      end: new Date(b.endHour),
      url: `/dashboard/bookings/${b._id}`
    }
  });

    const options = {
    dateClick: (event) => alert("date click! " + event.dateStr),
    initialView: "dayGridMonth",
    plugins: [timegridPlugin, daygridPlugin, interactionPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
      height: "70%",
    },
    events: calendarEvents || [],
  };

  /* ---->  Confirm the booking  <---------------------------------- */
  //do something with res
  const handleConfirm = async (e) => {
    const id = e.target.id;
    const current = upcomingBookings.find((b) => {
      return b._id === id;
    });
    const res = await fetch(`/api/bookings/confirm`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id, email: current.email }),
    });
    if (res.ok) {
      const data = await res.json();
      const index = upcomingBookings.findIndex((b) => b._id === id );
      upcomingBookings[index].confirmed = true;
    } else {
      console.log(res);
    }
  };

  const handlePageNavigate = async (e) => {
    const skipNum = (parseInt(e.target.value) - 1) * 10;
    const btnId = e.target.name;
    console.log(skipNum, btnId);
    if(btnId === "UpcomingId"){
     const res = await fetch(`/api/stats/future`, {
      headers: {
        "Content-Type": "application/json",
        projection: JSON.stringify({}),
        skip: skipNum,
      },
    });
    const data = await res.json();
    upcomingBookings = data.upcomingBookings;
    currPage = parseInt(e.target.value);
  };
  };
</script>

<main>
  <div class="container">
    <div class="row">
      <div class="cell title">Name</div>
      <div class="cell title">Last Name</div>
      <div class="cell title">Email</div>
      <div class="cell title">Phone Number</div>
      <div class="cell title">Hour</div>
      <div class="cell title">Confirm</div>
    </div>
    {#each upcomingBookings as info}
    <div class="row">
      <div class="cell">{info.name}</div>
      <div class="cell">{info.lastName}</div>
      <div class="cell">{info.email}</div>
      <div class="cell">{info.phoneNumber}</div>
      <div class="cell">{new Date(info.begHour)}</div>
      <div class="cell">
        {#if info.confirmed}
          Yes
        {:else}
          <button id={info._id} on:click={handleConfirm}>Click to confirm</button>
        {/if}
      </div>
    </div>
    {/each}
  </div>
  <PageNbr id="UpcomingId" {currPage} number={nbrOfUpcoming} on:click={handlePageNavigate} />
  <div class="calendar">
    <FullCalendar {options} />
  </div>
</main>

<style>
  main {
    flex: 5;
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
    box-sizing: border-box;
  }

  .cell:last-child {
    border-right: none;
  }

  .title {
    font-weight: 600;
    font-size: 1.2rem;
  }

  button{
        padding: 5px;
        border: none;
        background-color: lightgreen;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }
</style>
