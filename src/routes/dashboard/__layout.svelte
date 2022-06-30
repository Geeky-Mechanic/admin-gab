<script context="module">
	/* export function load({ url }) {
		return {
			props: { pageUrl: url.pathname },
		};
	} */
</script>

<script>
	import '../../styles/global.css';
	import Sidebar from "$lib/Sidebar.svelte";
	//export let pageUrl;

	let items = [
		{name: "Dashboard", ref: "dashboard"},
		{ name: "Bookings", ref: "dashboard/bookings" },
		{ name: "Complaints", ref: "dashboard/contact" },
		{ name: "PastBookings", ref: "dashboard/pastbookings" },
	];
</script>

<main>
	<Sidebar {items} />
	<slot />
</main>

<style >
	main {
		display: flex;
	}
</style>
