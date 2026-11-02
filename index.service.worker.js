// PolyTac playtest builds no longer use an offline service worker: every
// reload should get the latest build. This file replaces the old Godot
// worker at the same URL so phones that still have it pick this one up on
// their next visit. It takes over at once, deletes every cache the old
// worker filled, unregisters itself and reloads the open pages, which then
// load straight from the network.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys.map((key) => caches.delete(key)));
		await self.registration.unregister();
		const pages = await self.clients.matchAll({ type: 'window' });
		for (const page of pages) {
			page.navigate(page.url);
		}
	})());
});
