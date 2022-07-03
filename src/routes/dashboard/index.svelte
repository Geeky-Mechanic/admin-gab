<script context="module">
  export async function load({ fetch }) {
    const numRes = await fetch(`/api/stats/number`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const numData = await numRes.json();
    
    const limit = numData.completedBookings >= numData.missed ? numData.completedBookings : numData.missed;
    
    const chartRes = await fetch(`/api/stats/past`, {
      headers: {
        "Content-Type": "application/json",
        projection : JSON.stringify({ begHour : 1 }),
        limit: limit,
      },
    });
    
    const chartData = await chartRes.json();
    

    if (numRes.ok && chartRes.ok) {
      return {
        props: {
          numData,
          chartData,
        },
      };
    }
  }
</script>

<script>
  import Chart from "svelte-frappe-charts";
  import InfoCard from "$lib/InfoCard.svelte";
  export let numData;
  export let chartData;

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

  const monthNumbers = chartData.completedBookings?.map((b, i) => {
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
  const missedNumPerMonth = [];
  let completedChartData = {
    labels: months,
    datasets: [
      {
        values: numPerMonth,
      },
    ],
  };

  const missedMonthNumbers = chartData.missed?.map((b, i) => {
    const date = new Date(b.begHour);
    return date.getMonth();
  });

  missedMonthNumbers.sort((a, b) => a - b);
  

  for (let i = 0; i < 12; i++) {
    const firstIndex = missedMonthNumbers.indexOf(i);
    const lastIndex = missedMonthNumbers.lastIndexOf(i);
    if (firstIndex === -1) {
      missedNumPerMonth.push(0);
    } else {
      missedNumPerMonth.push(lastIndex - firstIndex + 1);
    }
  };

  let missedChartData = {
    labels: months,
    datasets: [
      {
        values: missedNumPerMonth,
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
  <Chart data={completedChartData} type="line" /> 
  <h3 class="chart-title">{`Missed bookings of ${new Date().getFullYear()}`}</h3>
  <Chart data={missedChartData} type="line" />
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
