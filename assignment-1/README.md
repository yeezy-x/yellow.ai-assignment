# Weather-Aware Order Management System

A Node.js/TypeScript CLI that reads delivery orders from JSON, fetches live weather for each city in parallel, marks orders as delayed when conditions are unsafe, prints personalized apologies, and writes updated orders to disk.

## Features

- **Parallel weather fetching** — One OpenWeatherMap request per order city via `Promise.allSettled()`
- **Resilient error handling** — Invalid cities or HTTP failures for one order do not stop the rest
- **Live delay rules** — Uses OpenWeather condition codes (not a hardcoded rain/snow list)
- **Delay reasons** — Stores OpenWeather `description` (e.g. `moderate rain`) on delayed orders
- **Customer notifications** — Console messages for delayed deliveries

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

## Setup

1. Clone or download the project, then install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```

3. Ensure `orders.json` exists at the project root (a sample file is included).

## Usage

**Development (TypeScript directly):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
npm start
```

## Input and output

| File | Description |
|------|-------------|
| `orders.json` | Source orders (`order_id`, `customer`, `city`, `status`) |
| `updated_orders.json` | Output after processing; delayed orders include `delayReason` |
| `.env` | `OPENWEATHER_API_KEY` (not committed; see `.gitignore`) |

### Order schema (input)

```json
{
  "order_id": "1001",
  "customer": "Alice Smith",
  "city": "New York",
  "status": "Pending"
}
```

### Order schema (delayed output)

```json
{
  "order_id": "1003",
  "customer": "Charlie Green",
  "city": "Kuching",
  "status": "Delayed",
  "delayReason": "moderate rain"
}
```

## How delay logic works

For each successful weather response, the app inspects OpenWeather `weather[0]`:

| Condition | Behavior |
|-----------|----------|
| `id === 800` (clear) | Stay **Pending** |
| `id` 801–804 (clouds) | Stay **Pending** |
| Any other condition `id` (rain, snow, thunderstorm, fog, etc.) | **Delayed**; `delayReason` = API `description` |

If `id` is missing, fallback: delay when `main` is not `Clear` or `Clouds`.

Failed weather lookups (e.g. invalid city) leave the order unchanged, log an error, and continue with other orders.

## Example run

```text
Failed to fetch weather for InvalidCity123: Error: Failed to fetch weather data for InvalidCity123
Hi Charlie Green, your request to deliver to Kuching is delayed due to moderate rain.

Updated orders saved to updated_orders.json

Final Order Status:
(order table with status and delayReason columns)
```

To demo **Delayed** status, set an order `city` to a place with current rain (e.g. `Kuching`, `Medellin`, `Juneau`). Cities with only clear or clouds often remain **Pending**.

## Project structure

```text
assignment-1/
├── orders.json
├── updated_orders.json
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── config/
    │   └── env.ts
    ├── services/
    │   ├── weather.service.ts
    │   └── order.service.ts
    └── types/
        ├── order.types.ts
        └── weather.types.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with `tsx` (`src/index.ts`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/index.js` |

## Tech stack

- TypeScript (ES modules, `NodeNext`)
- OpenWeatherMap Current Weather API (`/data/2.5/weather`)
- `dotenv` for environment variables
- `tsx` for local development

## AI development

See `AI-LOG.md` for prompts and notes from AI-assisted development (if submitted with the assignment).
