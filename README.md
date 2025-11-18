# Bingo Generator

Simple Vite + React app to create bingo images from a list of items.

Quick start

```bash
cd /path/to/workspace
npm install
npm run dev
```

Open http://localhost:5173 in your browser. Paste items (one per line), pick a grid size, then click "Download PNG" to export the bingo image.

Alternative runtimes (if you don't want to install Node globally)

- Using Docker (build and run a container):

```bash
# build image
docker build -t bingo-generator .
# run static site on port 5000
docker run --rm -p 5000:80 bingo-generator
```

Open http://localhost:5000 to view the app.

- Using `npx serve` (requires Node installed locally but avoids a global server):

```bash
npm install
npm run build
npx serve dist -l 5000
```

Or use the included helper script:

```bash
./run-with-npx.sh
```

