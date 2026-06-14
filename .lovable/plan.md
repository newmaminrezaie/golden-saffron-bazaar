## Goal
Add zoom-on-hover and click-to-lightbox behavior to the product image gallery on the single product page (`/shop/:slug`).

## Current state
- The product page (`src/routes/shop_.$slug.tsx`) has a simple inline gallery: one main image, a row of thumbnails below, and no zoom or lightbox.
- No image lightbox or zoom library is installed.

## Plan

### 1. Install dependency
Install `yet-another-react-lightbox` (lightweight, React-native, supports zoom/fullscreen plugins).

### 2. Extract gallery into a reusable component
Create `src/components/ProductImageGallery.tsx` to encapsulate the main image, thumbnails, zoom, and lightbox.

### 3. Zoom on hover
Implement a pure-CSS/JS zoom on the main image:
- On mouse enter/move over the main image, track cursor position.
- Scale the image (e.g., `scale(2)`) and offset `transform-origin` based on cursor position so the hovered region magnifies.
- On mouse leave, reset to normal scale.

### 4. Lightbox on click
- Clicking the main image opens a lightbox modal showing the active image.
- Inside the lightbox, the user can swipe/click through all product images.
- Close button (×) and keyboard `Escape` to exit.
- Thumbnails in the lightbox are optional; primary navigation can be prev/next arrows.

### 5. Integrate into product page
Replace the current inline gallery markup in `src/routes/shop_.$slug.tsx` with the new `<ProductImageGallery />` component.

### 6. Verify
- Test hover zoom on the main image.
- Test click-to-lightbox, image navigation, and close.
- Ensure thumbnail selection still updates the main image.

## No changes to
- Product data, pricing, cart logic, or other page sections.