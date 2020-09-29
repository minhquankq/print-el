"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getElementFromQuerySelector = (input) => {
    const el = document.querySelector(input);
    if (!el)
        throw new Error("The element can not be found");
    return el;
};
const getHTMLStringFromInput = (input) => {
    if (input instanceof HTMLElement) {
        return input.outerHTML;
    }
    if (input.trim().startsWith('<')) {
        return input;
    }
    return getElementFromQuerySelector(input).outerHTML;
};
const getAllStyleElements = () => {
    return document.querySelectorAll('link[rel=stylesheet], style');
};
exports.default = (input, config = {}) => {
    if (!input)
        throw new Error("The input element can not be null");
    const { useGlobalStyle = true, pageSize = 'A4', margin = 20, css } = config;
    const printContent = getHTMLStringFromInput(input);
    // Create an iframe for printing content.
    const iFrame = document.createElement("iframe");
    document.body.append(iFrame); // TODO: Add more style for hidden this element.
    const iFrameWindow = iFrame.contentWindow;
    if (iFrameWindow === null)
        throw new Error("Can not get window if iframe");
    iFrameWindow.document.open();
    if (useGlobalStyle)
        getAllStyleElements().forEach(styleEl => {
            iFrameWindow.document.write(styleEl.outerHTML);
        });
    if (css) {
        iFrameWindow.document.write(`
      <style>
        ${css}
      </style>`);
    }
    iFrameWindow.document.write(`
    <style>
      @page {
        size: ${pageSize};
        margin: ${margin}px;
      }
    </style>`);
    iFrameWindow.document.write(printContent); // content
    iFrameWindow.document.close();
    iFrameWindow.onafterprint = function () {
        var _a;
        (_a = iFrame.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(iFrame);
    };
    iFrameWindow.focus();
    iFrameWindow.print();
};
