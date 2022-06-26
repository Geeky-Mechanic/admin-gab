<script context="module">
  export async function load({ fetch }) {
    const numRes = await fetch(`/api/stats/number`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const calendarRes = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection : JSON.stringify({ begHour : 1, completed: 1 }),
      },
    });
    
    const calendarData = await calendarRes.json();
    const numData = await numRes.json();
    console.log(calendarData, numData);

    if (numRes.ok && calendarRes.ok) {
      return {
        props: {
          numData,
          calendarData,
        },
      };
    }
  }
</script>

<script>
  import Chart from "svelte-frappe-charts";
  import InfoCard from "$lib/InfoCard.svelte";
  export let numData;
  export let calendarData;
  
/*   onMount(async() => {
    const numRes = await fetch(`${import.meta.env.VITE_API_URL}book/stats/number`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    const calendarRes = await fetch(`${import.meta.env.VITE_API_URL}book/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("token")}`,
        projection : JSON.stringify({ begHour : 1, completed: 1 }),
      },
    });

    if (numRes.status === 403 || numRes.status === 401 || calendarRes.status === 403 || calendarRes.status === 401) {
      goto("/login");
    }

    else {
      calendarData = await calendarRes.json();
      numData = await numRes.json();
    }
  }); */

  const nbrOfCompleted = numData.completedBookings;
  const nbrUpcoming = numData.upcomingBookings;
  const nbrCompletedThisMonth = numData.completedThisMonth;
  const nbrCompletedLastMonth = numData.completedLastMonth;
  const nbrMissed = numData.missed;
  const nbrUnconfirmed = numData.unconfirmed;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

/*   const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();

  const ytdBookings = completedBookings.map((b) => {
    const bDate = new Date(
      b.begHour
    ); // beginning date of each completed booking
    const tDate = new Date(); // todays date 
    if (bDate.getFullYear() === tDate.getFullYear()) {
      // returns bookings between last year and this year 
      return b.begHour;
    }
  }); */

  const monthNumbers = calendarData.completedBookings.map((b, i) => {
    const date = new Date(b.begHour);
    return date.getMonth();
  });

  monthNumbers.sort((a, b) => a - b);
  const numPerMonth = [];

  for (let i = 0; i < 12; i++) {
    const firstIndex = monthNumbers.indexOf(i);
    const lastIndex = monthNumbers.lastIndexOf(i);
    if (firstIndex === -1) {
      numPerMonth.push(0);
    } else {
      numPerMonth.push(lastIndex - firstIndex + 1);
    }
  };

  let chartData = {
    labels: months,
    datasets: [
      {
        values: numPerMonth,
      },
    ],
  };
</script>

<main>
  <div class="card-container">
    <div class="card-separator">
      <InfoCard
        title="Completed bookings"
        positive
        num={nbrOfCompleted}
        content={" completed up to date"}
      />
      <InfoCard
        title="Upcoming bookings"
        num={nbrUpcoming}
        positive={nbrUpcoming > 0}
        content={nbrUpcoming > 0
          ? " bookings upcoming"
          : "You have no upcoming bookings"}
      />
    </div>
    <div class="card-separator">
      <InfoCard
        title="Bookings completed last month"
        num={nbrCompletedLastMonth}
        positive={nbrCompletedLastMonth > 0}
        content={nbrCompletedLastMonth > 0
          ? " completed"
          : "You have no completed bookings last month"}
      />
      <InfoCard
        title="Bookings completed this month"
        num={nbrCompletedThisMonth}
        positive={nbrCompletedThisMonth > nbrCompletedLastMonth}
        content={nbrCompletedThisMonth > 0
          ? " completed"
          : "You have no completed bookings this month"}
      />
    </div>
  </div>
  <div class="important-card">
    <InfoCard 
    title="Awaiting confirmation"
    num={nbrUnconfirmed}
    positive={nbrUnconfirmed === 0}
    content={nbrUnconfirmed === 0
    ? "No bookings to confirm"
    : "bookings to confirm"}
    />
  </div>
  <div class="important-card">
    <InfoCard 
    title="Missed bookings"
    num={nbrMissed}
    positive={nbrMissed === 0}
    content={nbrMissed === 0 
    ? "Yay you haven't missed any bookings" 
    : "Each missed booking is missed money!"}
    />
  </div>
  <h3 class="chart-title">{`Completed bookings of ${new Date().getFullYear()}`}</h3>
  <Chart data={chartData} type="line" /> 
</main>

<style>
  main {
    flex: 5;
  }

  .card-container {
    display: flex;
    text-align: center;
    justify-content: center;
  }

  .card-separator {
    display: block;
    width: 50%;
  }

  .important-card {
    display: block;
    width: 70%;
    margin: 0 auto;
  }

  .chart-title {
    text-align: center;
  }
</style>
