const puppeteer = require('puppeteer'); // v13.0.0 or later

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    async function waitForSelectors(selectors, frame, options) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame, options);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(element, timeout) {
      await waitForConnected(element, timeout);
      const isInViewport = await element.isIntersectingViewport({threshold: 0});
      if (isInViewport) {
        return;
      }
      await element.evaluate(element => {
        element.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'auto',
        });
      });
      await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
      await waitForFunction(async () => {
        return await element.getProperty('isConnected');
      }, timeout);
    }

    async function waitForInViewport(element, timeout) {
      await waitForFunction(async () => {
        return await element.isIntersectingViewport({threshold: 0});
      }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector');
      }
      let element = null;
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (element) {
          element = await element.waitForSelector(part, options);
        } else {
          element = await frame.waitForSelector(part, options);
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('>>'));
        }
        if (i < selector.length - 1) {
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }

    async function waitForElement(step, frame, timeout) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":924,"height":635})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto("http://127.0.0.1:5500/index.html");
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 205.9921875, y: 591.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 212.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 212.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 484.9921875, y: 447.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 484.9921875, y: 447.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 634.9921875, y: 453.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 208.9921875, y: 310.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 209.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 209.9921875, y: 450.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 206.9921875, y: 591.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 346.9921875, y: 591.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 441.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 441.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 478.9921875, y: 441.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 205.9921875, y: 723.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 355.9921875, y: 720.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 586.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 586.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 445.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 212.9921875, y: 718.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 724.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 211.9921875, y: 582.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 205.9921875, y: 724.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 172.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 212.9921875, y: 310.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 212.9921875, y: 310.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 79.9921875, y: 441.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 87.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 175.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 175.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 208.9921875, y: 309.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 208.9921875, y: 309.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 203.9921875, y: 456.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 341.9921875, y: 24.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 341.9921875, y: 94.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 341.9921875, y: 97.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 162.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 163.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 205.9921875, y: 304.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 307.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 442.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 343.9921875, y: 588.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 298.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 444.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 444.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 202.9921875, y: 588.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 585.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 451.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 451.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 307.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 307.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 171.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 171.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 341.9921875, y: 100.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 343.9921875, y: 97.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 31.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 724.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 577.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 359.9921875, y: 592.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 444.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 444.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 315.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 312.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 341.9921875, y: 162.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 346.9921875, y: 787.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 356.9921875, y: 727.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 356.9921875, y: 727.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 585.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 585.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 355.9921875, y: 448.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 355.9921875, y: 448.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 309.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 343.9921875, y: 865.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 787.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 353.9921875, y: 793.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 721.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 350.9921875, y: 721.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 352.9921875, y: 570.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 585.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 214.9921875, y: 729.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 340.9921875, y: 724.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 347.9921875, y: 727.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 801.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 349.9921875, y: 801.75} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#canvas"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 346.9921875, y: 870.75} });
    }

    await browser.close();
})();
