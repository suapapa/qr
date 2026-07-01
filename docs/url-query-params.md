# URL Query Parameters

QR Studio can pre-fill the form and generate a QR code automatically when the page loads with specific query parameters in the URL.

This is useful for:

- Sharing a ready-made QR link from another app or website
- Bookmarking frequently used QR configurations
- Deep-linking from documentation or internal tools

When valid parameters are present, the app selects the matching QR type, fills in the fields, and renders the QR code as soon as the WebAssembly module is ready.

---

## Basic usage

Append query parameters to the page URL:

```
https://example.com/qr/?type=txt&content=hello
https://example.com/qr/?type=wifi&ssid=my-router&pass=1234
```

On load:

1. The matching tab is activated
2. Input fields are populated from the parameters
3. A QR code is generated automatically

If no recognized parameters are present, the app behaves as usual (default URL type with the built-in sample link).

---

## The `type` parameter

Use `type` to select which QR code format to generate.

| Value | QR type | Notes |
|-------|---------|-------|
| `url` | URL / web link | |
| `wifi` | Wi-Fi network | |
| `text` | Plain text | Alias: `txt` |
| `phone` | Phone call | Alias: `tel` |
| `sms` | SMS message | |
| `email` | Email | |

Type names are case-insensitive (`TXT`, `txt`, and `text` all work for plain text).

### Type inference

If `type` is omitted, the app tries to infer the QR type from the other parameters:

| Parameters present | Inferred type |
|--------------------|---------------|
| `ssid` | `wifi` |
| `to` or `email` | `email` |
| `phone`/`tel`/`number` + `message`/`msg` | `sms` |
| `phone`/`tel`/`number` | `phone` |
| `url` | `url` |
| `content` or `text` | `text` |

Example — Wi-Fi without an explicit `type`:

```
?ssid=my-router&pass=1234
```

---

## Parameters by QR type

### URL (`type=url`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `url` | `content` | Destination URL |

```
?type=url&url=https://example.com
```

### Wi-Fi (`type=wifi`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `ssid` | — | Network name (SSID) |
| `pass` | `password` | Network password |
| `security` | `sec` | `WPA`, `WEP`, `nopass`, or `open` (defaults to WPA if omitted) |

```
?type=wifi&ssid=my-router&pass=1234
?type=wifi&ssid=guest-wifi&security=nopass
```

### Text (`type=text` or `type=txt`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `content` | `text` | Text to encode |

```
?type=txt&content=hello
?type=text&content=Scan%20me!
```

### Phone (`type=phone` or `type=tel`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `phone` | `tel`, `number`, `content` | Phone number |

```
?type=phone&phone=%2B1-234-567-8900
```

### SMS (`type=sms`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `phone` | `tel`, `number` | Recipient phone number |
| `message` | `msg`, `body`, `content` | Message body |

```
?type=sms&phone=010-1234-5678&message=Hello
```

### Email (`type=email`)

| Parameter | Aliases | Description |
|-----------|---------|-------------|
| `to` | `email` | Recipient address |
| `subject` | `sub` | Email subject |
| `body` | — | Email body |

```
?type=email&to=user@example.com&subject=Hello&body=Nice%20to%20meet%20you
```

---

## Encoding special characters

Use standard [percent-encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) for spaces, non-ASCII characters, and reserved URL characters.

| Character | Encoded |
|-----------|---------|
| Space | `%20` |
| `&` | `%26` |
| `=` | `%3D` |
| `#` | `%23` |

In JavaScript:

```js
const params = new URLSearchParams({
  type: 'txt',
  content: 'Hello, world!',
});
const url = `https://example.com/qr/?${params.toString()}`;
// ?type=txt&content=Hello%2C+world%21
```

---

## Security note

Query parameters are visible in the browser address bar, browsing history, server access logs (if any), and referrer headers when navigating away.

**Do not put sensitive Wi-Fi passwords or private data in shareable URLs** unless you accept that exposure. For one-off personal use on your own device, the convenience may be acceptable; for public links, prefer generating the QR inside the app without encoding secrets in the URL.

---

## Limitations

- Logo settings, error correction level, and margin size are **not** configurable via query parameters (use the UI after load).
- Invalid or incomplete parameter sets fall back to normal page behavior instead of generating a broken QR code.
- An empty `type` with no inferrable parameters is ignored.
