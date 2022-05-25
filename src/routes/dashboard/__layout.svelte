<script context="module">
	export function load({ url }) {
		return {
			props: { pageUrl: url.pathname },
		};
	}
</script>

<script>
	import '../../styles/global.css';
	import Sidebar from "$lib/Sidebar.svelte";
	export let pageUrl;

	let items = [
		{ name: "Bookings", ref: "dashboard/bookings" },
		{ name: "Complaints", ref: "dashboard/contact" },
		{ name: "Past Bookings", ref: "dashboard/pastbookings" },
	];
</script>

<main>
	<Sidebar {pageUrl} {items} />
	<slot />
</main>

<style >
	main {
		display: flex;
	}
</style>
