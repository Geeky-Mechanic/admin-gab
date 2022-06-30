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
  import TableColumn from "$lib/TableColumn.svelte";
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
