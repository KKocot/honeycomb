export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.BYhtjf1h.js",app:"_app/immutable/entry/app.CTfLVNYT.js",imports:["_app/immutable/entry/start.BYhtjf1h.js","_app/immutable/chunks/C5cJxAWc.js","_app/immutable/chunks/Cy2DzVtA.js","_app/immutable/entry/app.CTfLVNYT.js","_app/immutable/chunks/D-Vf_9NZ.js","_app/immutable/chunks/Cy2DzVtA.js","_app/immutable/chunks/DN1FmwMV.js","_app/immutable/chunks/DI-KHAut.js","_app/immutable/chunks/k71ffVbc.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/showcase",
				pattern: /^\/showcase\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base = "";