# Widget Project

## Setup Instructions

### Requirements

-   Node.js \>= 18
-   npm or yarn

### Install

``` bash
git clone https://github.com/pdminh180999/assessment.git

npm install
# or
yarn install
```

### Run locally

``` bash
npm run dev
# or
yarn dev
```

Open: `http://localhost:5173` (or the port shown in terminal)

### Build

``` bash
npm run build
# or
yarn build
```

------------------------------------------------------------------------

## How to Embed the Widget

### Option 1: Script Embed

``` html
<div id="wishlist-widget"></div>
<script src="https://your-cdn/wishlist-widget.js"></script>
<script>
  WishlistWidget.init({
    container: "#wishlist-widget",
    theme: "light", // or "dark"
  });
</script>
```

### Option 2: React Embed

``` jsx
import WishlistWidget from "wishlist-widget";

function App() {
  return <WishlistWidget theme="dark" />;
}
```

------------------------------------------------------------------------

## Architecture Decisions

-   **React 19 + Hooks**\
    Simple component-based UI with modern hooks.

-   **Vite**\
    Fast dev server and optimized production build.

-   **Reducer pattern**\
    Manages stacks and cards in a predictable way.

-   **@dnd-kit/core**\
    Low-level drag/swipe handling for:
    -   Desktop dragging
    -   Mobile swiping
    -   Custom gesture logic

-   **Mock API layer**\
    Simulates backend behavior for fast iteration.

-   **Lucide Icons**\
    Lightweight, modern icon set.

------------------------------------------------------------------------

## Trade-offs

-   Used mock API instead of real backend → faster development, less
    realistic.
-   No global state library (Redux/Zustand) → simpler, but harder to
    scale.
-   Limited optimization for very large datasets.

------------------------------------------------------------------------

## What I'd Improve With More Time

-   Real backend.
-   Better gesture physics (momentum, rubber-band effect).
-   Smoother swipe effect.
-   Virtualized lists for large stacks.
-   Accessibility (keyboard navigation, ARIA labels).
-   Unit and E2E tests.
-   Customizable theming system.
-   Plugin-style API for easy embedding on any website.
