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
		client: {start:"_app/immutable/entry/start.CqAcOnI6.js",app:"_app/immutable/entry/app.DwGuEsJA.js",imports:["_app/immutable/entry/start.CqAcOnI6.js","_app/immutable/chunks/Bp7Gc2Fk.js","_app/immutable/chunks/t7QkZnUW.js","_app/immutable/entry/app.DwGuEsJA.js","_app/immutable/chunks/AagSw_hr.js","_app/immutable/chunks/t7QkZnUW.js","_app/immutable/chunks/LOPYPSoD.js","_app/immutable/chunks/BTj3Adh1.js","_app/immutable/chunks/BkLHf1Va.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
