# Favicons

Our favicons are designed for maximum compatibility across platforms, including desktop, iOS, and Android.

## Files

Place the following files in the `public` folder of your project:

- favicon.ico - 48px by 48px
- favicon.svg
- apple-touch-icon.png - 192px by 192px
- android-chrome-192x192.png - 192px by 192px
- android-chrome-512x512.png - 512px by 512px
- site.webmanifest - contains site and icon information for PWA compatibility

## Site.webmanifest Example

```json
{
  "name": "Tach Ignite",
  "short_name": "Tach Ignite",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#33edf5",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

## Metadata

In the root layout of the application, we include a `Head` section to pass favicon and other metadata:

```tsx
<Head>
  <link rel="icon" href="/favicon.ico" sizes="48x48">
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
</Head>
```

## Metadata API

In future versions, we hope to support the app directory and the [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields). NextJS will properly generate the favicon files given the following in the root `layout.tsx` file:

```tsx
export const metadata = {
  ...
  icons: {
    icon: [{url: '/favicon.ico', sizes: '48x48'},{url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml'}],
    apple: {
      url: '/apple-touch-icon.png',
    },
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      }
    ]
  }
};
```

This will generate the following link elements in the rendered html document:

```html
<html>
  <head>
    ...
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    ...
  </head>
</html>
```
