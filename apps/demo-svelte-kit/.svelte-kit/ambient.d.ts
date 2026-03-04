
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const GJS_DEBUG_TOPICS: string;
	export const LESSOPEN: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const USER: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const LC_TIME: string;
	export const VSCODE_NLS_CONFIG: string;
	export const npm_package_dependencies__barddev_honeycomb_svelte: string;
	export const npm_config_user_agent: string;
	export const GIT_EDITOR: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_vite: string;
	export const npm_node_execpath: string;
	export const CLAUDE_AGENT_SDK_VERSION: string;
	export const SHLVL: string;
	export const npm_package_dependencies__codemirror_search: string;
	export const HOME: string;
	export const CHROME_DESKTOP: string;
	export const DESKTOP_SESSION: string;
	export const NVM_BIN: string;
	export const NVM_INC: string;
	export const VSCODE_IPC_HOOK: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const COREPACK_ROOT: string;
	export const APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const LC_MONETARY: string;
	export const MANAGERPID: string;
	export const npm_package_dependencies__codemirror_autocomplete: string;
	export const npm_package_devDependencies__tailwindcss_postcss: string;
	export const SYSTEMD_EXEC_PID: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_devDependencies_typescript: string;
	export const NVM_DIR: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const npm_package_dependencies__codemirror_view: string;
	export const MANDATORY_PATH: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const IM_CONFIG_PHASE: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_dependencies__codemirror_lang_markdown: string;
	export const npm_package_dependencies__codemirror_language_data: string;
	export const npm_package_dependencies_svelte: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const npm_package_type: string;
	export const JOURNAL_STREAM: string;
	export const _: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_adapter_node: string;
	export const WALLABY_PRODUCTION: string;
	export const XDG_SESSION_CLASS: string;
	export const DEFAULTS_PATH: string;
	export const APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
	export const npm_package_dependencies__codemirror_theme_one_dark: string;
	export const npm_config_registry: string;
	export const USERNAME: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const FC_FONTATIONS: string;
	export const GTK2_MODULES: string;
	export const WINDOWPATH: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const INVOCATION_ID: string;
	export const GTK3_MODULES: string;
	export const npm_package_name: string;
	export const NODE: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const XDG_MENU_PREFIX: string;
	export const LC_ADDRESS: string;
	export const XDG_RUNTIME_DIR: string;
	export const GDK_BACKEND: string;
	export const npm_config_frozen_lockfile: string;
	export const DISPLAY: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const LC_TELEPHONE: string;
	export const XMODIFIERS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XAUTHORITY: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_scripts_test: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_devDependencies__tailwindcss_typography: string;
	export const SHELL: string;
	export const LC_NAME: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const NODE_PATH: string;
	export const QT_ACCESSIBILITY: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const GDMSESSION: string;
	export const npm_package_scripts_build: string;
	export const npm_package_dependencies_bits_ui: string;
	export const CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
	export const LESSCLOSE: string;
	export const CLAUDECODE: string;
	export const LC_MEASUREMENT: string;
	export const npm_package_dependencies__codemirror_commands: string;
	export const GPG_AGENT_INFO: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const LC_IDENTIFICATION: string;
	export const npm_package_scripts_test_ui: string;
	export const VIRTUAL_ENV: string;
	export const QT_IM_MODULE: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const XDG_CONFIG_DIRS: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_recursive: string;
	export const LC_NUMERIC: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_command: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const LC_PAPER: string;
	export const npm_package_scripts_preview: string;
	export const PNPM_HOME: string;
	export const npm_package_dependencies__codemirror_state: string;
	export const VSCODE_PID: string;
	export const npm_package_dependencies_highlight_js: string;
	export const INIT_CWD: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		GJS_DEBUG_TOPICS: string;
		LESSOPEN: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		USER: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		LC_TIME: string;
		VSCODE_NLS_CONFIG: string;
		npm_package_dependencies__barddev_honeycomb_svelte: string;
		npm_config_user_agent: string;
		GIT_EDITOR: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		XDG_SESSION_TYPE: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_vite: string;
		npm_node_execpath: string;
		CLAUDE_AGENT_SDK_VERSION: string;
		SHLVL: string;
		npm_package_dependencies__codemirror_search: string;
		HOME: string;
		CHROME_DESKTOP: string;
		DESKTOP_SESSION: string;
		NVM_BIN: string;
		NVM_INC: string;
		VSCODE_IPC_HOOK: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		COREPACK_ROOT: string;
		APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		LC_MONETARY: string;
		MANAGERPID: string;
		npm_package_dependencies__codemirror_autocomplete: string;
		npm_package_devDependencies__tailwindcss_postcss: string;
		SYSTEMD_EXEC_PID: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_devDependencies_typescript: string;
		NVM_DIR: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		npm_package_dependencies__codemirror_view: string;
		MANDATORY_PATH: string;
		QT_QPA_PLATFORMTHEME: string;
		IM_CONFIG_PHASE: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
		npm_package_scripts_dev: string;
		npm_package_dependencies__codemirror_lang_markdown: string;
		npm_package_dependencies__codemirror_language_data: string;
		npm_package_dependencies_svelte: string;
		npm_package_devDependencies__playwright_test: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		npm_package_type: string;
		JOURNAL_STREAM: string;
		_: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_adapter_node: string;
		WALLABY_PRODUCTION: string;
		XDG_SESSION_CLASS: string;
		DEFAULTS_PATH: string;
		APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
		npm_package_dependencies__codemirror_theme_one_dark: string;
		npm_config_registry: string;
		USERNAME: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		GNOME_DESKTOP_SESSION_ID: string;
		FC_FONTATIONS: string;
		GTK2_MODULES: string;
		WINDOWPATH: string;
		MCP_CONNECTION_NONBLOCKING: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		INVOCATION_ID: string;
		GTK3_MODULES: string;
		npm_package_name: string;
		NODE: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		XDG_MENU_PREFIX: string;
		LC_ADDRESS: string;
		XDG_RUNTIME_DIR: string;
		GDK_BACKEND: string;
		npm_config_frozen_lockfile: string;
		DISPLAY: string;
		NoDefaultCurrentDirectoryInExePath: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		LC_TELEPHONE: string;
		XMODIFIERS: string;
		XDG_SESSION_DESKTOP: string;
		XAUTHORITY: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		SSH_AUTH_SOCK: string;
		npm_package_scripts_test: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_devDependencies__tailwindcss_typography: string;
		SHELL: string;
		LC_NAME: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		NODE_PATH: string;
		QT_ACCESSIBILITY: string;
		ELECTRON_RUN_AS_NODE: string;
		GDMSESSION: string;
		npm_package_scripts_build: string;
		npm_package_dependencies_bits_ui: string;
		CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING: string;
		LESSCLOSE: string;
		CLAUDECODE: string;
		LC_MEASUREMENT: string;
		npm_package_dependencies__codemirror_commands: string;
		GPG_AGENT_INFO: string;
		GJS_DEBUG_OUTPUT: string;
		LC_IDENTIFICATION: string;
		npm_package_scripts_test_ui: string;
		VIRTUAL_ENV: string;
		QT_IM_MODULE: string;
		PWD: string;
		npm_execpath: string;
		XDG_CONFIG_DIRS: string;
		VSCODE_CODE_CACHE_PATH: string;
		XDG_DATA_DIRS: string;
		npm_config_recursive: string;
		LC_NUMERIC: string;
		npm_package_devDependencies_postcss: string;
		npm_command: string;
		PNPM_SCRIPT_SRC_DIR: string;
		LC_PAPER: string;
		npm_package_scripts_preview: string;
		PNPM_HOME: string;
		npm_package_dependencies__codemirror_state: string;
		VSCODE_PID: string;
		npm_package_dependencies_highlight_js: string;
		INIT_CWD: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
