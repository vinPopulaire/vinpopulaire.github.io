(function () {
  'use strict';

  var skipNavigation = (function () {
    var link = document.querySelector('.skip-navigation');
    if (!link) return;
    var target = document.querySelector(link.hash);
    if (!target) return;
    target.tabIndex = -1;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      target.focus();
    });
  });

  var stickyNavigation = (function (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '.nav' : _ref$selector,
        _ref$fixedClass = _ref.fixedClass,
        fixedClass = _ref$fixedClass === void 0 ? 'nav--fixed' : _ref$fixedClass,
        _ref$fixedHiddenClass = _ref.fixedHiddenClass,
        fixedHiddenClass = _ref$fixedHiddenClass === void 0 ? 'nav--hide' : _ref$fixedHiddenClass;

    var nav = document.querySelector(selector);
    if (!nav) return;
    var prevY = window.pageYOffset;
    var show, hide;

    var scrollHandler = function () {
      var curY = window.pageYOffset;
      if (curY === prevY) return;
      var isScrollingToTop = curY < prevY;
      show = curY && show || curY > window.innerHeight / 3 && isScrollingToTop;
      hide = show && !isScrollingToTop;
      nav.classList[show ? 'add' : 'remove'](fixedClass);
      nav.classList[hide ? 'add' : 'remove'](fixedHiddenClass);
      prevY = curY;
    };

    window.addEventListener('scroll', scrollHandler, {
      passive: true
    }); // don't make the navigation sticky by navigating through anchors in history

    window.addEventListener('hashchange', function () {
      window.removeEventListener('scroll', scrollHandler, {
        passive: true
      });
      window.addEventListener('scroll', function () {
        return window.addEventListener('scroll', scrollHandler, {
          passive: true
        });
      }, {
        once: true,
        passive: true
      });
    });
  });

  var mobileNavigation = (function (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$buttonSelector = _ref.buttonSelector,
        buttonSelector = _ref$buttonSelector === void 0 ? '.burger' : _ref$buttonSelector,
        _ref$menuSelector = _ref.menuSelector,
        menuSelector = _ref$menuSelector === void 0 ? '.nav__menu' : _ref$menuSelector,
        _ref$bodyClass = _ref.bodyClass,
        bodyClass = _ref$bodyClass === void 0 ? 'nav-menu-open' : _ref$bodyClass;

    var button = document.querySelector(buttonSelector);
    var menu = document.querySelector(menuSelector);
    if (!button || !menu) return;
    button.hidden = false;
    button.addEventListener('click', function () {
      document.body.classList.toggle(bodyClass);
    });
  });

  var themeSwitcher = (function (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$buttonSelector = _ref.buttonSelector,
        buttonSelector = _ref$buttonSelector === void 0 ? '.theme-switcher' : _ref$buttonSelector,
        _ref$documentClass = _ref.documentClass,
        documentClass = _ref$documentClass === void 0 ? 'other-theme' : _ref$documentClass;

    var button = document.querySelector(buttonSelector);
    if (!button || !window.CSS || !CSS.supports('top', 'var(--)')) return;
    button.hidden = false;
    button.addEventListener('click', function () {
      var newTheme = localStorage.getItem('theme') ? '' : documentClass;
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
    });
  });

  var postWebshare = (function (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$webshareSelector = _ref.webshareSelector,
        webshareSelector = _ref$webshareSelector === void 0 ? '.post-meta__item--webshare' : _ref$webshareSelector,
        _ref$fallbackSelector = _ref.fallbackSelector,
        fallbackSelector = _ref$fallbackSelector === void 0 ? '.post-meta__item--twittershare' : _ref$fallbackSelector;

    if (!navigator.share) return;
    document.querySelectorAll(webshareSelector).forEach(function (el) {
      return el.hidden = false;
    });
    document.querySelectorAll(fallbackSelector).forEach(function (el) {
      return el.remove();
    });
    window.addEventListener('click', function (e) {
      var button = e.target.closest(webshareSelector);
      if (!button) return;
      var _button$dataset = button.dataset,
          title = _button$dataset.title,
          text = _button$dataset.text,
          url = _button$dataset.url;
      navigator.share({
        title: title,
        text: text,
        url: url
      });
    });
  });

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var src = createCommonjsModule(function (module) {

  var passiveSupported = false;
  var onceSupported = false;

  function noop() {}

  try {
    var options = Object.create({}, {
      passive: {
        get: function () {
          passiveSupported = true;
        }
      },
      once: {
        get: function () {
          onceSupported = true;
        }
      }
    });
    window.addEventListener('test', noop, options);
    window.removeEventListener('test', noop, options);
  } catch (e) {
    /* */
  }

  var enhance = module.exports = function enhance(proto) {
    var originalAddEventListener = proto.addEventListener;
    var originalRemoveEventListener = proto.removeEventListener;
    var listeners = new WeakMap();

    proto.addEventListener = function (name, originalCallback, optionsOrCapture) {
      if (optionsOrCapture === undefined || optionsOrCapture === true || optionsOrCapture === false || !originalCallback || typeof originalCallback !== 'function' && typeof originalCallback !== 'object') {
        return originalAddEventListener.call(this, name, originalCallback, optionsOrCapture);
      }

      var callback = typeof originalCallback !== 'function' && typeof originalCallback.handleEvent === 'function' ? originalCallback.handleEvent.bind(originalCallback) : originalCallback;
      var options = typeof optionsOrCapture === 'boolean' ? {
        capture: optionsOrCapture
      } : optionsOrCapture || {};
      var passive = Boolean(options.passive);
      var once = Boolean(options.once);
      var capture = Boolean(options.capture);
      var oldCallback = callback;

      if (!onceSupported && once) {
        callback = function (event) {
          this.removeEventListener(name, originalCallback, options);
          oldCallback.call(this, event);
        };
      }

      if (!passiveSupported && passive) {
        callback = function (event) {
          event.preventDefault = noop;
          oldCallback.call(this, event);
        };
      }

      if (!listeners.has(this)) listeners.set(this, new WeakMap());
      var elementMap = listeners.get(this);
      if (!elementMap.has(originalCallback)) elementMap.set(originalCallback, []);
      var optionsOctal = passive * 1 + once * 2 + capture * 4;
      elementMap.get(originalCallback)[optionsOctal] = callback;
      originalAddEventListener.call(this, name, callback, capture);
    };

    proto.removeEventListener = function (name, originalCallback, optionsOrCapture) {
      var capture = Boolean(typeof optionsOrCapture === 'object' ? optionsOrCapture.capture : optionsOrCapture);
      var elementMap = listeners.get(this);
      if (!elementMap) return originalRemoveEventListener.call(this, name, originalCallback, optionsOrCapture);
      var callbacks = elementMap.get(originalCallback);
      if (!callbacks) return originalRemoveEventListener.call(this, name, originalCallback, optionsOrCapture);

      for (var optionsOctal in callbacks) {
        var callbackIsCapture = Boolean(optionsOctal & 4);
        if (callbackIsCapture !== capture) continue; // when unbinding, capture is the only option that counts

        originalRemoveEventListener.call(this, name, callbacks[optionsOctal], callbackIsCapture);
      }
    };
  };

  if (!passiveSupported || !onceSupported) {
    if (typeof EventTarget !== 'undefined') {
      enhance(EventTarget.prototype);
    } else {
      enhance(Text.prototype);
      enhance(HTMLElement.prototype);
      enhance(HTMLDocument.prototype);
      enhance(Window.prototype);
      enhance(XMLHttpRequest.prototype);
    }
  }
  });

  var main = function () {
    themeSwitcher();
    stickyNavigation();
    mobileNavigation();
    skipNavigation();
    postWebshare();
  }; // polyfill addEventlistener option { once: true }
  var unsupportedFeatures = [!window.Symbol && 'Symbol', !Object.assign && 'Object.assign', !Array.from && 'Array.from', !Element.prototype.matches && 'Element.prototype.matches', !Element.prototype.closest && 'Element.prototype.closest', !Element.prototype.append && 'Element.prototype.append', !Element.prototype.remove && 'Element.prototype.remove', !NodeList.prototype.forEach && 'NodeList.prototype.forEach'].filter(function (item) {
    return item;
  }).join();

  if (!unsupportedFeatures) {
    main();
  } else {
    var script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=' + unsupportedFeatures;
    script.onload = main;
    document.head.appendChild(script);
  }

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsic3JjL3NjcmlwdHMvc2tpcE5hdmlnYXRpb24uanMiLCJzcmMvc2NyaXB0cy9zdGlja3lOYXZpZ2F0aW9uLmpzIiwic3JjL3NjcmlwdHMvbW9iaWxlTmF2aWdhdGlvbi5qcyIsInNyYy9zY3JpcHRzL3RoZW1lU3dpdGNoZXIuanMiLCJzcmMvc2NyaXB0cy9wb3N0V2Vic2hhcmUuanMiLCJub2RlX21vZHVsZXMvZXZlbnRsaXN0ZW5lci1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3QgbGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lwLW5hdmlnYXRpb24nKTtcbiAgaWYgKCFsaW5rKSByZXR1cm47XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobGluay5oYXNoKTtcbiAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICB0YXJnZXQudGFiSW5kZXggPSAtMTtcbiAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0YXJnZXQuZm9jdXMoKTtcbiAgfSk7XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgKHtcbiAgc2VsZWN0b3IgPSAnLm5hdicsXG4gIGZpeGVkQ2xhc3MgPSAnbmF2LS1maXhlZCcsXG4gIGZpeGVkSGlkZGVuQ2xhc3MgPSAnbmF2LS1oaWRlJ1xufSA9IHt9KSA9PiB7XG4gIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBpZiAoIW5hdikgcmV0dXJuO1xuXG4gIGxldCBwcmV2WSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgbGV0IHNob3csIGhpZGU7XG4gIGNvbnN0IHNjcm9sbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY3VyWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBpZiAoY3VyWSA9PT0gcHJldlkpIHJldHVybjtcblxuICAgIGNvbnN0IGlzU2Nyb2xsaW5nVG9Ub3AgPSBjdXJZIDwgcHJldlk7XG5cbiAgICBzaG93ID1cbiAgICAgIChjdXJZICYmIHNob3cpIHx8IChjdXJZID4gd2luZG93LmlubmVySGVpZ2h0IC8gMyAmJiBpc1Njcm9sbGluZ1RvVG9wKTtcblxuICAgIGhpZGUgPSBzaG93ICYmICFpc1Njcm9sbGluZ1RvVG9wO1xuXG4gICAgbmF2LmNsYXNzTGlzdFtzaG93ID8gJ2FkZCcgOiAncmVtb3ZlJ10oZml4ZWRDbGFzcyk7XG4gICAgbmF2LmNsYXNzTGlzdFtoaWRlID8gJ2FkZCcgOiAncmVtb3ZlJ10oZml4ZWRIaWRkZW5DbGFzcyk7XG4gICAgcHJldlkgPSBjdXJZO1xuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXG4gIC8vIGRvbid0IG1ha2UgdGhlIG5hdmlnYXRpb24gc3RpY2t5IGJ5IG5hdmlnYXRpbmcgdGhyb3VnaCBhbmNob3JzIGluIGhpc3RvcnlcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCAoKSA9PiB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdzY3JvbGwnLFxuICAgICAgKCkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KSxcbiAgICAgIHsgb25jZTogdHJ1ZSwgcGFzc2l2ZTogdHJ1ZSB9XG4gICAgKTtcbiAgfSk7XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgKHtcbiAgYnV0dG9uU2VsZWN0b3IgPSAnLmJ1cmdlcicsXG4gIG1lbnVTZWxlY3RvciA9ICcubmF2X19tZW51JyxcbiAgYm9keUNsYXNzID0gJ25hdi1tZW51LW9wZW4nXG59ID0ge30pID0+IHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihidXR0b25TZWxlY3Rvcik7XG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG1lbnVTZWxlY3Rvcik7XG4gIGlmICghYnV0dG9uIHx8ICFtZW51KSByZXR1cm47XG5cbiAgYnV0dG9uLmhpZGRlbiA9IGZhbHNlO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoYm9keUNsYXNzKTtcbiAgfSk7XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgKHtcbiAgYnV0dG9uU2VsZWN0b3IgPSAnLnRoZW1lLXN3aXRjaGVyJyxcbiAgZG9jdW1lbnRDbGFzcyA9ICdvdGhlci10aGVtZSdcbn0gPSB7fSkgPT4ge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGJ1dHRvblNlbGVjdG9yKTtcbiAgaWYgKCFidXR0b24gfHwgIXdpbmRvdy5DU1MgfHwgIUNTUy5zdXBwb3J0cygndG9wJywgJ3ZhcigtLSknKSkgcmV0dXJuO1xuXG4gIGJ1dHRvbi5oaWRkZW4gPSBmYWxzZTtcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgbmV3VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA/ICcnIDogZG9jdW1lbnRDbGFzcztcblxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsIG5ld1RoZW1lKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lID0gbmV3VGhlbWU7XG4gIH0pO1xufTtcbiIsImV4cG9ydCBkZWZhdWx0ICh7XG4gIHdlYnNoYXJlU2VsZWN0b3IgPSAnLnBvc3QtbWV0YV9faXRlbS0td2Vic2hhcmUnLFxuICBmYWxsYmFja1NlbGVjdG9yID0gJy5wb3N0LW1ldGFfX2l0ZW0tLXR3aXR0ZXJzaGFyZSdcbn0gPSB7fSkgPT4ge1xuICBpZiAoIW5hdmlnYXRvci5zaGFyZSkgcmV0dXJuO1xuXG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3JBbGwod2Vic2hhcmVTZWxlY3RvcilcbiAgICAuZm9yRWFjaChlbCA9PiAoZWwuaGlkZGVuID0gZmFsc2UpKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChmYWxsYmFja1NlbGVjdG9yKS5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBjb25zdCBidXR0b24gPSBlLnRhcmdldC5jbG9zZXN0KHdlYnNoYXJlU2VsZWN0b3IpO1xuICAgIGlmICghYnV0dG9uKSByZXR1cm47XG5cbiAgICBjb25zdCB7IHRpdGxlLCB0ZXh0LCB1cmwgfSA9IGJ1dHRvbi5kYXRhc2V0O1xuICAgIG5hdmlnYXRvci5zaGFyZSh7IHRpdGxlLCB0ZXh0LCB1cmwgfSk7XG4gIH0pO1xufTtcbiIsInZhciBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2VcbnZhciBvbmNlU3VwcG9ydGVkID0gZmFsc2VcbmZ1bmN0aW9uIG5vb3AoKSB7fVxudHJ5IHtcbiAgdmFyIG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKHt9LCB7XG4gICAgcGFzc2l2ZToge2dldDogZnVuY3Rpb24oKSB7IHBhc3NpdmVTdXBwb3J0ZWQgPSB0cnVlIH19LFxuICAgIG9uY2U6IHtnZXQ6IGZ1bmN0aW9uKCkgeyBvbmNlU3VwcG9ydGVkID0gdHJ1ZSB9fSxcbiAgfSlcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBub29wLCBvcHRpb25zKVxuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGVzdCcsIG5vb3AsIG9wdGlvbnMpXG59IGNhdGNoIChlKSB7IC8qICovIH1cblxudmFyIGVuaGFuY2UgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVuaGFuY2UocHJvdG8pIHtcbiAgdmFyIG9yaWdpbmFsQWRkRXZlbnRMaXN0ZW5lciA9IHByb3RvLmFkZEV2ZW50TGlzdGVuZXJcbiAgdmFyIG9yaWdpbmFsUmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHByb3RvLnJlbW92ZUV2ZW50TGlzdGVuZXJcblxuICB2YXIgbGlzdGVuZXJzID0gbmV3IFdlYWtNYXAoKVxuICBwcm90by5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24obmFtZSwgb3JpZ2luYWxDYWxsYmFjaywgb3B0aW9uc09yQ2FwdHVyZSkge1xuICAgIGlmIChcbiAgICAgIG9wdGlvbnNPckNhcHR1cmUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgb3B0aW9uc09yQ2FwdHVyZSA9PT0gdHJ1ZSB8fFxuICAgICAgb3B0aW9uc09yQ2FwdHVyZSA9PT0gZmFsc2UgfHxcbiAgICAgICghb3JpZ2luYWxDYWxsYmFjayB8fCB0eXBlb2Ygb3JpZ2luYWxDYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb3JpZ2luYWxDYWxsYmFjayAhPT0gJ29iamVjdCcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxBZGRFdmVudExpc3RlbmVyLmNhbGwodGhpcywgbmFtZSwgb3JpZ2luYWxDYWxsYmFjaywgb3B0aW9uc09yQ2FwdHVyZSlcbiAgICB9XG5cbiAgICB2YXIgY2FsbGJhY2sgPSB0eXBlb2Ygb3JpZ2luYWxDYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb3JpZ2luYWxDYWxsYmFjay5oYW5kbGVFdmVudCA9PT0gJ2Z1bmN0aW9uJyA/IG9yaWdpbmFsQ2FsbGJhY2suaGFuZGxlRXZlbnQuYmluZChvcmlnaW5hbENhbGxiYWNrKSA6IG9yaWdpbmFsQ2FsbGJhY2tcbiAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zT3JDYXB0dXJlID09PSAnYm9vbGVhbicgPyB7Y2FwdHVyZTogb3B0aW9uc09yQ2FwdHVyZX0gOiBvcHRpb25zT3JDYXB0dXJlIHx8IHt9XG4gICAgdmFyIHBhc3NpdmUgPSBCb29sZWFuKG9wdGlvbnMucGFzc2l2ZSlcbiAgICB2YXIgb25jZSA9IEJvb2xlYW4ob3B0aW9ucy5vbmNlKVxuICAgIHZhciBjYXB0dXJlID0gQm9vbGVhbihvcHRpb25zLmNhcHR1cmUpXG4gICAgdmFyIG9sZENhbGxiYWNrID0gY2FsbGJhY2tcblxuICAgIGlmICghb25jZVN1cHBvcnRlZCAmJiBvbmNlKSB7XG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBvcmlnaW5hbENhbGxiYWNrLCBvcHRpb25zKVxuICAgICAgICBvbGRDYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcGFzc2l2ZVN1cHBvcnRlZCAmJiBwYXNzaXZlKSB7XG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID0gbm9vcFxuICAgICAgICBvbGRDYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghbGlzdGVuZXJzLmhhcyh0aGlzKSkgbGlzdGVuZXJzLnNldCh0aGlzLCBuZXcgV2Vha01hcCgpKVxuICAgIHZhciBlbGVtZW50TWFwID0gbGlzdGVuZXJzLmdldCh0aGlzKVxuICAgIGlmICghZWxlbWVudE1hcC5oYXMob3JpZ2luYWxDYWxsYmFjaykpIGVsZW1lbnRNYXAuc2V0KG9yaWdpbmFsQ2FsbGJhY2ssIFtdKVxuICAgIHZhciBvcHRpb25zT2N0YWwgPSAocGFzc2l2ZSAqIDEpICsgKG9uY2UgKiAyKSArIChjYXB0dXJlICogNClcbiAgICBlbGVtZW50TWFwLmdldChvcmlnaW5hbENhbGxiYWNrKVtvcHRpb25zT2N0YWxdID0gY2FsbGJhY2tcblxuICAgIG9yaWdpbmFsQWRkRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIG5hbWUsIGNhbGxiYWNrLCBjYXB0dXJlKVxuICB9XG5cbiAgcHJvdG8ucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKG5hbWUsIG9yaWdpbmFsQ2FsbGJhY2ssIG9wdGlvbnNPckNhcHR1cmUpIHtcbiAgICB2YXIgY2FwdHVyZSA9IEJvb2xlYW4odHlwZW9mIG9wdGlvbnNPckNhcHR1cmUgPT09ICdvYmplY3QnID8gb3B0aW9uc09yQ2FwdHVyZS5jYXB0dXJlIDogb3B0aW9uc09yQ2FwdHVyZSlcblxuICAgIHZhciBlbGVtZW50TWFwID0gbGlzdGVuZXJzLmdldCh0aGlzKVxuICAgIGlmICghZWxlbWVudE1hcCkgcmV0dXJuIG9yaWdpbmFsUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIG5hbWUsIG9yaWdpbmFsQ2FsbGJhY2ssIG9wdGlvbnNPckNhcHR1cmUpXG4gICAgdmFyIGNhbGxiYWNrcyA9IGVsZW1lbnRNYXAuZ2V0KG9yaWdpbmFsQ2FsbGJhY2spXG4gICAgaWYgKCFjYWxsYmFja3MpIHJldHVybiBvcmlnaW5hbFJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLCBuYW1lLCBvcmlnaW5hbENhbGxiYWNrLCBvcHRpb25zT3JDYXB0dXJlKVxuXG4gICAgZm9yICh2YXIgb3B0aW9uc09jdGFsIGluIGNhbGxiYWNrcykge1xuICAgICAgdmFyIGNhbGxiYWNrSXNDYXB0dXJlID0gQm9vbGVhbihvcHRpb25zT2N0YWwgJiA0KVxuICAgICAgaWYgKGNhbGxiYWNrSXNDYXB0dXJlICE9PSBjYXB0dXJlKSBjb250aW51ZSAvLyB3aGVuIHVuYmluZGluZywgY2FwdHVyZSBpcyB0aGUgb25seSBvcHRpb24gdGhhdCBjb3VudHNcbiAgICAgIG9yaWdpbmFsUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMsIG5hbWUsIGNhbGxiYWNrc1tvcHRpb25zT2N0YWxdLCBjYWxsYmFja0lzQ2FwdHVyZSlcbiAgICB9XG5cbiAgfVxuXG59XG5cbmlmICghcGFzc2l2ZVN1cHBvcnRlZCB8fCAhb25jZVN1cHBvcnRlZCkge1xuXG4gIGlmICh0eXBlb2YgRXZlbnRUYXJnZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZW5oYW5jZShFdmVudFRhcmdldC5wcm90b3R5cGUpXG4gIH0gZWxzZSB7XG4gICAgZW5oYW5jZShUZXh0LnByb3RvdHlwZSlcbiAgICBlbmhhbmNlKEhUTUxFbGVtZW50LnByb3RvdHlwZSlcbiAgICBlbmhhbmNlKEhUTUxEb2N1bWVudC5wcm90b3R5cGUpXG4gICAgZW5oYW5jZShXaW5kb3cucHJvdG90eXBlKVxuICAgIGVuaGFuY2UoWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlKVxuICB9XG5cbn1cbiIsImltcG9ydCBza2lwTmF2aWdhdGlvbiBmcm9tICcuL3NraXBOYXZpZ2F0aW9uJztcbmltcG9ydCBzdGlja3lOYXZpZ2F0aW9uIGZyb20gJy4vc3RpY2t5TmF2aWdhdGlvbic7XG5pbXBvcnQgbW9iaWxlTmF2aWdhdGlvbiBmcm9tICcuL21vYmlsZU5hdmlnYXRpb24nO1xuaW1wb3J0IHRoZW1lU3dpdGNoZXIgZnJvbSAnLi90aGVtZVN3aXRjaGVyJztcbmltcG9ydCBwb3N0V2Vic2hhcmUgZnJvbSAnLi9wb3N0V2Vic2hhcmUnO1xuXG5jb25zdCBtYWluID0gKCkgPT4ge1xuICB0aGVtZVN3aXRjaGVyKCk7XG4gIHN0aWNreU5hdmlnYXRpb24oKTtcbiAgbW9iaWxlTmF2aWdhdGlvbigpO1xuICBza2lwTmF2aWdhdGlvbigpO1xuICBwb3N0V2Vic2hhcmUoKTtcbn07XG5cbi8vIHBvbHlmaWxsIGFkZEV2ZW50bGlzdGVuZXIgb3B0aW9uIHsgb25jZTogdHJ1ZSB9XG5pbXBvcnQgJ2V2ZW50bGlzdGVuZXItcG9seWZpbGwnO1xuXG5jb25zdCB1bnN1cHBvcnRlZEZlYXR1cmVzID0gW1xuICAhd2luZG93LlN5bWJvbCAmJiAnU3ltYm9sJyxcbiAgIU9iamVjdC5hc3NpZ24gJiYgJ09iamVjdC5hc3NpZ24nLFxuICAhQXJyYXkuZnJvbSAmJiAnQXJyYXkuZnJvbScsXG4gICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzICYmICdFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzJyxcbiAgIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgJiYgJ0VsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QnLFxuICAhRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kICYmICdFbGVtZW50LnByb3RvdHlwZS5hcHBlbmQnLFxuICAhRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlICYmICdFbGVtZW50LnByb3RvdHlwZS5yZW1vdmUnLFxuICAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggJiYgJ05vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoJ1xuXVxuICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSlcbiAgLmpvaW4oKTtcblxuaWYgKCF1bnN1cHBvcnRlZEZlYXR1cmVzKSB7XG4gIG1haW4oKTtcbn0gZWxzZSB7XG4gIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc3JjID1cbiAgICAnaHR0cHM6Ly9wb2x5ZmlsbC5pby92My9wb2x5ZmlsbC5taW4uanM/ZmVhdHVyZXM9JyArIHVuc3VwcG9ydGVkRmVhdHVyZXM7XG4gIHNjcmlwdC5vbmxvYWQgPSBtYWluO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG4iXSwibmFtZXMiOlsibGluayIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInRhcmdldCIsImhhc2giLCJ0YWJJbmRleCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJmb2N1cyIsInNlbGVjdG9yIiwiZml4ZWRDbGFzcyIsImZpeGVkSGlkZGVuQ2xhc3MiLCJuYXYiLCJwcmV2WSIsIndpbmRvdyIsInBhZ2VZT2Zmc2V0Iiwic2hvdyIsImhpZGUiLCJzY3JvbGxIYW5kbGVyIiwiY3VyWSIsImlzU2Nyb2xsaW5nVG9Ub3AiLCJpbm5lckhlaWdodCIsImNsYXNzTGlzdCIsInBhc3NpdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25jZSIsImJ1dHRvblNlbGVjdG9yIiwibWVudVNlbGVjdG9yIiwiYm9keUNsYXNzIiwiYnV0dG9uIiwibWVudSIsImhpZGRlbiIsImJvZHkiLCJ0b2dnbGUiLCJkb2N1bWVudENsYXNzIiwiQ1NTIiwic3VwcG9ydHMiLCJuZXdUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwiZG9jdW1lbnRFbGVtZW50IiwiY2xhc3NOYW1lIiwid2Vic2hhcmVTZWxlY3RvciIsImZhbGxiYWNrU2VsZWN0b3IiLCJuYXZpZ2F0b3IiLCJzaGFyZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWwiLCJyZW1vdmUiLCJjbG9zZXN0IiwiZGF0YXNldCIsInRpdGxlIiwidGV4dCIsInVybCIsInBhc3NpdmVTdXBwb3J0ZWQiLCJvbmNlU3VwcG9ydGVkIiwibm9vcCIsIm9wdGlvbnMiLCJPYmplY3QiLCJjcmVhdGUiLCJnZXQiLCJlbmhhbmNlIiwibW9kdWxlIiwicHJvdG8iLCJvcmlnaW5hbEFkZEV2ZW50TGlzdGVuZXIiLCJvcmlnaW5hbFJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lcnMiLCJXZWFrTWFwIiwibmFtZSIsIm9yaWdpbmFsQ2FsbGJhY2siLCJvcHRpb25zT3JDYXB0dXJlIiwidW5kZWZpbmVkIiwiY2FsbCIsImNhbGxiYWNrIiwiaGFuZGxlRXZlbnQiLCJiaW5kIiwiY2FwdHVyZSIsIkJvb2xlYW4iLCJvbGRDYWxsYmFjayIsImV2ZW50IiwiaGFzIiwic2V0IiwiZWxlbWVudE1hcCIsIm9wdGlvbnNPY3RhbCIsImNhbGxiYWNrcyIsImNhbGxiYWNrSXNDYXB0dXJlIiwiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJUZXh0IiwiSFRNTEVsZW1lbnQiLCJIVE1MRG9jdW1lbnQiLCJXaW5kb3ciLCJYTUxIdHRwUmVxdWVzdCIsIm1haW4iLCJ0aGVtZVN3aXRjaGVyIiwic3RpY2t5TmF2aWdhdGlvbiIsIm1vYmlsZU5hdmlnYXRpb24iLCJza2lwTmF2aWdhdGlvbiIsInBvc3RXZWJzaGFyZSIsInVuc3VwcG9ydGVkRmVhdHVyZXMiLCJTeW1ib2wiLCJhc3NpZ24iLCJBcnJheSIsImZyb20iLCJFbGVtZW50IiwibWF0Y2hlcyIsImFwcGVuZCIsIk5vZGVMaXN0IiwiZmlsdGVyIiwiaXRlbSIsImpvaW4iLCJzY3JpcHQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwib25sb2FkIiwiaGVhZCIsImFwcGVuZENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7QUFBQSx3QkFBZSxZQUFNO0VBQ25CLE1BQU1BLElBQUksR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLGtCQUF2QixDQUFiO0VBQ0EsTUFBSSxDQUFDRixJQUFMLEVBQVc7RUFDWCxNQUFNRyxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QkYsSUFBSSxDQUFDSSxJQUE1QixDQUFmO0VBQ0EsTUFBSSxDQUFDRCxNQUFMLEVBQWE7RUFFYkEsRUFBQUEsTUFBTSxDQUFDRSxRQUFQLEdBQWtCLENBQUMsQ0FBbkI7RUFDQUwsRUFBQUEsSUFBSSxDQUFDTSxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFBQyxDQUFDLEVBQUk7RUFDbENBLElBQUFBLENBQUMsQ0FBQ0MsY0FBRjtFQUNBTCxJQUFBQSxNQUFNLENBQUNNLEtBQVA7RUFDRCxHQUhEO0VBSUQsQ0FYRDs7QUNBQSwwQkFBZSxpQkFJSjtFQUFBLGdDQUFQLEVBQU87RUFBQSwyQkFIVEMsUUFHUztFQUFBLE1BSFRBLFFBR1MsOEJBSEUsTUFHRjtFQUFBLDZCQUZUQyxVQUVTO0VBQUEsTUFGVEEsVUFFUyxnQ0FGSSxZQUVKO0VBQUEsbUNBRFRDLGdCQUNTO0VBQUEsTUFEVEEsZ0JBQ1Msc0NBRFUsV0FDVjs7RUFDVCxNQUFNQyxHQUFHLEdBQUdaLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QlEsUUFBdkIsQ0FBWjtFQUNBLE1BQUksQ0FBQ0csR0FBTCxFQUFVO0VBRVYsTUFB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