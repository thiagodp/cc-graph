window.app = window.app || {};

window.app.data = {
	nodes: [
		{ data: { id: 'a' } },
		{ data: { id: 'b' } },
		{ data: { id: 'c' } },
		{ data: { id: 'd' } },
		{ data: { id: 'e' } }
	],

	edges: [
		{ data: { id: 'ae', weight: 1, source: 'a', target: 'e' } },
		{ data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
		{ data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
		{ data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
		{ data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
		{ data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
		{ data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
	]
};
