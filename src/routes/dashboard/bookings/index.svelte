<script>
  import FullCalendar from "svelte-fullcalendar";
  import daygridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import timegridPlugin from "@fullcalendar/timegrid";
  import TableColumn from "$lib/TableColumn.svelte";
  import PageNbr from "$lib/PageNbr.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let options;
  let upcomingBookings;
  let nbrOfUpcoming;
  let currPage = 1;
  
  onMount(async () => {

    const res = await fetch(`${import.meta.env.VITE_API_URL}book/stats/future`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    if (
      res.status === 403 ||
      res.status === 401
    ) {
      goto("/login");
    }

    upcomingBookings = data.upcomingBookings;

      /* ---->  Full calendar section  <---------------------------------- */

    const calendarRes = await fetch(
      `${import.meta.env.VITE_API_URL}book/stats/future`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${sessionStorage.getItem("token")}`,
          projection: JSON.stringify({ begHour: 1, endHour: 1, name: 1 }),
        },
      }
    );

    const calendarData = await calendarRes.json();

  const calendarEvents = calendarData.upcomingBookings.map((b) => {
    return {
      id: b._id,
      title: b.name,
      start: new Date(b.begHour),
      end: new Date(b.endHour),
      url: `/dashboard/bookings/${b._id}`
    }
  });

    options = {
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

  /* ---->  Request Numbers  <---------------------------------- */
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
      nbrOfUpcoming = data2.upcomingBookings;

  });

  /* ---->  Confirm the booking  <---------------------------------- */



  //do something with res

  const handleConfirm = async (e) => {
    const id = e.target.id;
    const res = await fetch(`${import.meta.env.VITE_API_URL}book/confirm`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
      },
      method: "POST",
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = res.json();
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
     const res = await fetch(`${import.meta.env.VITE_API_URL}book/stats/future`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
        projection: JSON.stringify({}),
        skip: skipNum,
      },
    });
    if(res.status === 403 || res.status === 401){
      goto("/login");
    };
    const data = await res.json();
    upcomingBookings = data.upcomingBookings;
    currPage = parseInt(e.target.value);
  }
  };
</script>

<main>
  {#if upcomingBookings && options && nbrOfUpcoming}
  <div class="table">
    <TableColumn title="Name" cells={upcomingBookings.map((b) => b.name)} />
    <TableColumn
      title="Last Name"
      cells={upcomingBookings.map((b) => b.lastName)}
    />
    <TableColumn title="Email" cells={upcomingBookings.map((b) => b.email)} />
    <TableColumn
      title="Phone Number"
      cells={upcomingBookings.map((b) => b.phoneNumber)}
    />
    <TableColumn title="Hour" cells={upcomingBookings.map((b) => b.begHour)} />
    <TableColumn
      id={upcomingBookings.map((b) => b._id)}
      on:click={handleConfirm}
      title="Confirm"
      cells={upcomingBookings.map((b) => b.confirmed)}
    />
  </div>
  <PageNbr id="UpcomingId" {currPage} number={nbrOfUpcoming} on:click={handlePageNavigate} />
  <div class="calendar">
    <FullCalendar {options} />
  </div>
  {:else}
  <h1>Fetching data, one moment please</h1>
  {/if}
</main>

<style>
  main {
    flex: 5;
  }
  .table {
    display: flex;
    margin: 10px 20px;
    border: 1px lightgray solid;
  }
</style>
