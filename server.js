// Custom server entry point for cPanel "Setup Node.js App" (Phusion Passenger).
//
// cPanel/Passenger needs a startup file it can boot; `next start` (a CLI command)
// doesn't fit that model. Passenger passes the listen target via process.env.PORT
// (a port number or a unix socket path) and we listen on it directly.
//
// Run `npm run build` BEFORE starting this so the .next production build exists.

const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => handle(req, res)).listen(
        process.env.PORT || 3000,
        () => {
            console.log("Next.js server ready");
        },
    );
});
