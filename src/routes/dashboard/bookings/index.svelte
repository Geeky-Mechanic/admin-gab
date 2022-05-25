<script>
    import FullCalendar from "svelte-fullcalendar";
    import daygridPlugin from "@fullcalendar/daygrid";
    import interactionPlugin from '@fullcalendar/interaction';
    import timegridPlugin from '@fullcalendar/timegrid';
  
    let options = {
      dateClick: (event) => alert('date click! ' + event.dateStr),
      initialView: "dayGridMonth",
      plugins: [timegridPlugin, daygridPlugin, interactionPlugin],
      headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
        height: '70%',
      },
    };
  </script>
  
  <main>
    <FullCalendar {options} />
  </main>
  
  <style>
    main {
      flex: 5;
    }
  </style>