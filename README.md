# PRINT-EL - PRINT A HTML ELEMENT IN THE BROWSER

Simple library for printing a HTMLElement or HTML string on the browser.

## COMPATIBILITY

Should be compatible with most major browsers.

## INSTALL

```
npm i print-el
```

## USAGE

```jsx
import printEl from "print-el";

printEl(targetElement, options);
```

## API

### targetElement

targetElement can be

- a string for query selector element (Example: `#printElement`)
- a element in the page (Example: `document.getElementById('printElement')`)
- a HTML string (Example: `<h1 class="title">Print title</h1>`)

### options

| name            | type    | default | description                                                                       |
| --------------- | ------- | ------- | --------------------------------------------------------------------------------- |
| pageSize?       | string  | A4      | The valid value here: https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size |
| margin?         | number  | 20      | Margin of page                                                                    |
| useGlobalStyle? | boolean | true    | Use the styles of the page for printing, if not -> must be define more custom CSS |
| css?            | string  |         | Custom CSS for printing                                                           |

## NOTE

- The style for printing element, should not depend on parent element.
  Example:

```html
<body class="dark">
  <div class="print-content">...</div>
</body>
```

```css
.dark .print-content {
  background: black;
  color: white;
}
```

## Next feature

- The print element will not be depended on parent element.
