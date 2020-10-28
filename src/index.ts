interface PrintConfig {
  pageSize?: string; // A4, A3...
  margin?: number;
  useGlobalStyle?: boolean; // if true, all the style will be apply for printing
  css?: string; // String of custom CSS
  onDone?: Function;
}

const getElementFromQuerySelector = (input: string): HTMLElement => {
  const el: HTMLElement | null = document.querySelector(input);
  if (!el) throw new Error("The element can not be found");
  return el;
};

const getHTMLStringFromInput = (input: string | HTMLElement): string => {
  if (input instanceof HTMLElement) {
    return input.outerHTML;
  }
  if (input.trim().startsWith("<")) {
    return input;
  }
  return getElementFromQuerySelector(input).outerHTML;
};

const getAllStyleElements = (): NodeListOf<HTMLStyleElement> => {
  return document.querySelectorAll("link[rel=stylesheet], style");
};

const createIFrameElement = () => {
  // Create an iframe for printing content.
  const iFrame = document.createElement("iframe");
  // update style for iFrame to hide this element.
  iFrame.style.width = `0px`;
  iFrame.style.height = `0px`;
  iFrame.style.position = "absolute";
  document.body.append(iFrame);
  return iFrame;
};

export default (
  input: string | HTMLElement,
  config: PrintConfig = {}
): void => {
  if (!input) throw new Error("The input element can not be null");
  const {
    useGlobalStyle = true,
    pageSize = "A4",
    margin = 20,
    css,
    onDone = () => {},
  } = config;

  const printContent = getHTMLStringFromInput(input);

  const iFrame = createIFrameElement();

  const iFrameWindow: Window | null = iFrame.contentWindow;
  if (iFrameWindow === null) throw new Error("Can not get window if iframe");

  iFrameWindow.document.open();

  if (useGlobalStyle)
    getAllStyleElements().forEach((styleEl) => {
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
    iFrame.parentNode?.removeChild(iFrame);
    onDone();
  };

  iFrameWindow.onload = () => {
    iFrameWindow.focus();
    iFrameWindow.print();
  };
};
