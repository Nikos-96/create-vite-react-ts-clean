# create-vite-react-ts-clean

A minimal Vite + React + TypeScript starter template. No clutter, no demo code — just a clean, solid foundation to build on.

## Usage
```bash
npm create vite-react-ts-clean@latest my-app
cd my-app
npm run dev
```

Or in the current directory:
```bash
npm create vite-react-ts-clean@latest .
npm run dev
```

## What's included

- React 19 + TypeScript + Vite
- Strict TypeScript config out of the box
- `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## CSS baseline

A single `App.css` file with a practical global reset — box-sizing, margin/padding, system font stack with smoothing, line-height, iOS text scaling fix, media element and form resets, and two starter variables (`--primary`, `--bg`).

## Production ESLint

For production apps, consider enabling type-aware lint rules in `eslint.config.js` for stronger type checking at the cost of slightly slower save times:
```js
tseslint.configs.recommendedTypeChecked
```

See [typescript-eslint docs](https://typescript-eslint.io/getting-started/typed-linting) for details.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## License

MIT