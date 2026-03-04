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
		client: {start:"_app/immutable/entry/start.XWx8hZkS.js",app:"_app/immutable/entry/app.SnPl8vxt.js",imports:["_app/immutable/entry/start.XWx8hZkS.js","_app/immutable/chunks/BS3ZoGgF.js","_app/immutable/chunks/CS6HA5RH.js","_app/immutable/entry/app.SnPl8vxt.js","_app/immutable/chunks/CyNzbp2V.js","_app/immutable/chunks/CS6HA5RH.js","_app/immutable/chunks/BQbnYcUe.js","_app/immutable/chunks/BRoMCVLn.js","_app/immutable/chunks/D3YL1QpI.js","_app/immutable/chunks/BEk99SxO.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
