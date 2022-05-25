<script context="module">
  import { credentials } from "../../stores/login";
  import { get } from "svelte/store";
  export async function load({ fetch }) {
    const date = new Date();
    const token = get(credentials);
    const res = await fetch(`${import.meta.env.VITE_API_URL}book/stats`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${token.accessToken}`,
        currDate: JSON.stringify(date),
      },
    });
    const data = await res.json();
    if (res.ok) {
      return {
        props: {
          data,
        },
      };
    }

    return {
      status: res.status,
      error: new Error("WTF"),
    };
  }
</script>

<script>
  import Chart from "svelte-frappe-charts";
  import InfoCard from "$lib/InfoCard.svelte";
  export let data;
  const { upcomingBookings, completedBookings, lastMonth, thisMonth } = data;
  const nbrOfCompleted = completedBookings.length;
  const nbrUpcoming = upcomingBookings.length;
  const nbrCompletedThisMonth = thisMonth.length;
  const nbrCompletedLastMonth = lastMonth.length;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Juin",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Juin",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();

  const chartMonths = months.filter((month, i)=> {
    return (i >= currMonth && i < currMonth + 12);
  });

  const ytdBookings = completedBookings.map((b)=> {
    const bDate = new Date(b.begHour);/* beginning date of each completed booking */
    const tDate = new Date();/* todays date */
    tDate.setFullYear(currDate.getFullYear() - 1);/* sets year to last year */
    if(bDate.getTime() >= tDate.getTime() && bDate.getTime() < currDate.getTime()){/* returns bookings between last year and this year */
      return b.begHour;
    };
  });

  const monthNumbers = ytdBookings.map((b, i)=> {
    const date = new Date(b)
    return date.getMonth();
  });

  monthNumbers.sort((a, b)=> a - b);
  const numPerMonth = [];

  for(let i = 0 ; i < 12; i++){
    const firstIndex = monthNumbers.indexOf(i);
    const lastIndex = monthNumbers.lastIndexOf(i);
    if(firstIndex === -1){
      numPerMonth.push(0);
    } else {
      numPerMonth.push((lastIndex - firstIndex) + 1)
    }
  };

  let chartData = {
    labels: chartMonths,
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
        num={nbrUpcoming > 0 ? nbrUpcoming : ""}
        positive={nbrUpcoming > 0}
        content={nbrUpcoming > 0
          ? " bookings upcoming"
          : "You have no upcoming bookings"}
      />
    </div>
    <div class="card-separator">
      <InfoCard
        title="Bookings completed last month"
        num={nbrCompletedLastMonth > 0 ? nbrCompletedLastMonth : ""}
        positive={nbrCompletedLastMonth > 0}
        content={nbrCompletedLastMonth > 0
          ? " completed"
          : "You have no completed bookings last month"}
      />
      <InfoCard
        title="Bookings completed this month"
        num={nbrCompletedThisMonth > 0 ? nbrCompletedThisMonth : ""}
        positive={nbrCompletedThisMonth > nbrCompletedLastMonth}
        content={nbrCompletedThisMonth > 0
          ? " completed"
          : "You have no completed bookings this month"}
      />
    </div>
  </div>
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
</style>
