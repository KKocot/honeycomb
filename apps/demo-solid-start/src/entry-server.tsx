// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" class="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <title>Honeycomb SolidStart Demo</title>
          {assets}
        </head>
        <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
