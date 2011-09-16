(function() {
  var __main, _alert, _bind_functions, _first_page, _fix_geso_position, _fix_pre_content, _fix_slides, _is_valid_page, _last_page, _listen_url_change, _next_item, _next_page, _prev_item, _prev_page, _root, _route, _select_geso_size, _setup_geso, _setup_items, _setup_slides, _show_help, _show_page, _toggle_wiper_status, _unbind_functions, _update_navigator, _update_wiper_status, _wipe, _wipe_a_geso, _wiped_screen;
  _root = this;
  _root.VERSION = '0.0003';
  _root.geso_rate = {
    s: 1440 / 1920,
    m: 1920 / 1920
  };
  _root.size = 'm';
  _root.wiper_enabled = true;
  _root.help_showed = false;
  _setup_geso = function() {
    _select_geso_size();
    $("<div id=\"gesogeso\">\n  <div class=\"geso geso-" + size + "\" id=\"gesogeso-geso-1\"></div>\n  <div class=\"geso geso-" + size + "\" id=\"gesogeso-geso-2\"></div>\n  <div class=\"geso geso-" + size + "\" id=\"gesogeso-geso-3\"></div>\n  <div id=\"geso-wiped\"></div>\n</div>").appendTo('body');
    return _fix_geso_position();
  };
  _select_geso_size = function() {
    var h, w;
    w = $(window).width();
    h = $(window).height();
    switch (true) {
      case w <= 1096 && h <= 870:
        return _root.size = 's';
      case w <= 1680 && h <= 860:
        return _root.size = 'm';
      default:
        return _root.size = 'm';
    }
  };
  _fix_geso_position = function() {
    var $geso1, $geso2, $geso3, h_w, w_w;
    $geso1 = $('#gesogeso-geso-1');
    $geso2 = $('#gesogeso-geso-2');
    $geso3 = $('#gesogeso-geso-3');
    w_w = $(window).width();
    h_w = $(window).height();
    $geso1.css({
      top: h_w - parseInt($geso1.height() / 2) + parseInt(160 * geso_rate[size])
    });
    $geso2.css({
      top: h_w - parseInt($geso1.height() / 2) + parseInt(160 * geso_rate[size])
    });
    $geso3.css({
      left: parseInt((w_w - $geso3.width()) / 2)
    });
    return $('#geso-wiped').css({
      width: $(window).width(),
      height: $(document).height()
    });
  };
  _wipe = function(callback) {
    var $geso1, $geso2, $geso3, T, t, _ref;
    _ref = [1500, 400], T = _ref[0], t = _ref[1];
    _unbind_functions();
    if (!_root.wiper_enabled) {
      (callback != null ? callback : function() {})();
      _bind_functions();
      return;
    }
    $geso1 = $('#gesogeso-geso-1');
    $geso2 = $('#gesogeso-geso-2');
    $geso3 = $('#gesogeso-geso-3');
    $geso1.css({
      '-webkit-animation-iteration-count': '0',
      '-webkit-animation-duration': (T / 1000) + 's'
    });
    $geso2.css({
      '-webkit-animation-iteration-count': '0',
      '-webkit-animation-duration': ((T - t) / 1000) + 's'
    });
    $geso3.css({
      '-webkit-animation-iteration-count': '0',
      '-webkit-animation-duration': ((T - t * 2) / 1000) + 's'
    });
    return setTimeout(function() {
      _wipe_a_geso(1);
      return setTimeout(function() {
        _wipe_a_geso(2);
        return setTimeout(function() {
          _wipe_a_geso(3);
          return setTimeout(function() {
            _wiped_screen(true);
            __data.current_slide.hide();
            return setTimeout(function() {
              _wiped_screen(false);
              (callback != null ? callback : function() {})();
              return _bind_functions();
            }, 100);
          }, T - t * 2);
        }, t);
      }, t);
    }, 0);
  };
  _wipe_a_geso = function(i) {
    var $geso_target;
    $geso_target = $("#gesogeso-geso-" + i);
    $geso_target.css({
      '-webkit-animation-iteration-count': '1'
    });
    return i;
  };
  _wiped_screen = function(b) {
    if (b) {
      $('#geso-wiped').show();
    } else {
      $('#geso-wiped').hide();
    }
    return b;
  };
  _setup_slides = function() {
    var data;
    data = window.__data = {
      pages: 0,
      current_page: 0,
      slides: [],
      current_slide: void 0,
      items: [],
      current_item: void 0,
      current_item_index: 0
    };
    $('header, section, footer').each(function() {
      var $slide;
      $slide = $(this);
      if ($slide[0].tagName.toLowerCase() === 'section') {
        $("<div class=\"wiper-status wiper-status-enabled\"></div>\n<div class=\"navigator navigator-more-item\"></div>").appendTo($slide);
      }
      data.pages++;
      return data.slides.push($slide);
    });
    _fix_slides();
    return _fix_pre_content();
  };
  _fix_slides = function() {
    return $('header, section, footer').css({
      width: $(window).width() - 20 - 20,
      height: $(window).height() - 20 - 20
    });
  };
  _fix_pre_content = function() {
    return $('section pre').each(function() {
      var i, indent_del, lines, re, _dummy, _ref, _ref2, _ref3;
      lines = $(this).text().replace(/(^ *\n+|\n+ *$)/g, '').split('\n');
      try {
        _ref2 = ((_ref = lines[0]) != null ? _ref : '').match(/^( *)/), _dummy = _ref2[0], indent_del = _ref2[1];
        re = new RegExp('^' + indent_del);
        for (i = 0, _ref3 = lines.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
          lines[i] = lines[i].replace(re, '');
        }
        return $(this).text(lines.join('\n'));
      } catch (ex) {
        return _alert(ex);
      }
    });
  };
  _is_valid_page = function(p) {
    if (p < __data.pages && p >= 0) {
      return true;
    } else {
      return false;
    }
  };
  _show_page = function(p, p_from) {
    var data;
    data = __data;
    if (!_is_valid_page(p)) {
      return false;
    }
    if (data.current_slide) {
      data.current_slide.hide();
    }
    try {
      data.current_slide = data.slides[p].show();
      data.current_page = p;
      data.items = [];
      data.current_item = void 0;
      data.current_item_index = 0;
    } catch (ex) {
      _alert('oops.');
      return false;
    }
    _setup_items((p >= p_from ? false : true));
    _update_navigator();
    _update_wiper_status();
    return true;
  };
  _next_page = function(b) {
    var h, p;
    p = __data.current_page + 1;
    if (_is_valid_page(p)) {
      h = "#!/page/" + p + "/from/" + __data.current_page;
      if (b) {
        return _wipe(function() {
          return location.hash = h;
        });
      } else {
        return location.hash = h;
      }
    }
  };
  _prev_page = function(b) {
    var h, p;
    p = __data.current_page - 1;
    if (_is_valid_page(p)) {
      h = "#!/page/" + p + "/from/" + __data.current_page;
      if (b) {
        return _wipe(function() {
          return location.hash = h;
        });
      } else {
        return location.hash = h;
      }
    }
  };
  _first_page = function(b) {
    var h, p;
    p = 0;
    if (_is_valid_page(p)) {
      h = "#!/page/" + p + "/from/" + __data.current_page;
      if (b) {
        return _wipe(function() {
          return location.hash = h;
        });
      } else {
        return location.hash = h;
      }
    }
  };
  _last_page = function(b) {
    var h, p;
    p = __data.pages - 1;
    if (_is_valid_page(p)) {
      h = "#!/page/" + p + "/from/" + __data.current_page;
      if (b) {
        return _wipe(function() {
          return location.hash = h;
        });
      } else {
        return location.hash = h;
      }
    }
  };
  _setup_items = function(b_back) {
    var $slide, data, target;
    target = 'p, pre, ul > li, ol > li, img';
    data = __data;
    $slide = data.current_slide;
    if ($slide[0].tagName.toLowerCase() !== 'section') {
      return false;
    }
    $slide.find(target).each(function(i) {
      var $item;
      $item = $(this);
      data.items.push($item);
      if (!b_back) {
        return $item.hide();
      } else {
        return $item.show();
      }
    });
    if (b_back) {
      data.current_item_index = data.items.length;
    }
  };
  _next_item = function(b) {
    var data;
    data = __data;
    if (data.items[data.current_item_index]) {
      data.items[data.current_item_index].show();
      data.current_item_index++;
      return _update_navigator();
    } else {
      return _next_page(b);
    }
  };
  _prev_item = function(b) {
    var data;
    data = __data;
    if (data.items[data.current_item_index - 1]) {
      data.current_item_index--;
      data.items[data.current_item_index].hide();
      return _update_navigator();
    } else {
      return _prev_page(b);
    }
  };
  _update_navigator = function() {
    var $navi, data;
    data = __data;
    $navi = data.current_slide.find('.navigator');
    if (data.items[data.current_item_index]) {
      return $navi.removeClass('navigator-next-page').addClass('navigator-more-item');
    } else {
      return $navi.removeClass('navigator-more-item').addClass('navigator-next-page');
    }
  };
  _toggle_wiper_status = function() {
    _root.wiper_enabled = !_root.wiper_enabled;
    return _update_wiper_status();
  };
  _update_wiper_status = function() {
    var $navi;
    $navi = window.__data.current_slide.find('.wiper-status');
    if (_root.wiper_enabled) {
      return $navi.addClass('wiper-status-enabled');
    } else {
      return $navi.removeClass('wiper-status-enabled');
    }
  };
  _show_help = function() {
    var $help, usage;
    usage = "\nClick:           NEXT     item\n\nEnter:           NEXT     item\nBackSpace:       PREVIOUS item\n\nj:               NEXT     item\nk:               PREVIOUS item\n\nDown:            NEXT     page\nCommand + Down:  LAST     page\nUp:              PREVIOUS page\nCommand + Up:    FIRST    page\n\nShift + (commands above): * \"without\" wiping\n\nw:               toggle wiper\n\nh, ?:            show/hide this help";
    $help = $('#geso-help');
    if (!$help.size()) {
      $help = $('<section></section>').attr({
        id: 'geso-help'
      }).append($('<pre></pre>').text(usage)).appendTo('body');
      $help.css({
        width: $(window).width() - 20 - 20,
        height: $(window).height() - 20 - 20
      });
    }
    if (_root.help_showed) {
      $help.hide();
    } else {
      $help.show();
    }
    return _root.help_showed = !_root.help_showed;
  };
  _bind_functions = function() {
    $('body').click(function(ev) {
      var b_wipe;
      b_wipe = ev.shiftKey ? false : true;
      return _next_item(b_wipe);
    });
    return $('body').keydown(function(ev) {
      var b_wipe;
      b_wipe = ev.shiftKey ? false : true;
      switch (ev.keyCode) {
        case 13:
          _next_item(b_wipe);
          return false;
        case 8:
          _prev_item(b_wipe);
          return false;
        case 74:
          _next_item(b_wipe);
          return false;
        case 75:
          _prev_item(b_wipe);
          return false;
        case 80:
        case 38:
          if (ev.metaKey) {
            _first_page(b_wipe);
          } else {
            _prev_page(b_wipe);
          }
          return false;
        case 78:
        case 40:
          if (ev.metaKey) {
            _last_page(b_wipe);
          } else {
            _next_page(b_wipe);
          }
          return false;
        case 87:
          _toggle_wiper_status();
          return false;
        case 72:
        case 191:
          if (ev.keyCode === 191 && !(ev.shiftKey != null)) {
            return;
          }
          return _show_help();
      }
    });
  };
  _unbind_functions = function() {
    return $('body').unbind('click').unbind('keydown');
  };
  _listen_url_change = function(interval) {
    _root.__urlchev__url_before = location.href;
    return _root.__urlchev__timer = setInterval(function() {
      var _ref;
      if (location.href !== _root.__urlchev__url_before) {
        ((_ref = _root.handle_url_change) != null ? _ref : function() {})(location.href, _root.__urlchev__url_before);
        return _root.__urlchev__url_before = location.href;
      }
    }, interval != null ? interval : 50);
  };
  _root.handle_url_change = function(url, url_before) {
    var h, m, _ref;
    m = url.match(/\#!(.*)$/);
    h = m != null ? (_ref = m[1]) != null ? _ref : '' : '';
    return _route(h);
  };
  _route = function(h_to) {
    var h, m, p, p_from, pre, re_page, tpl_page, _ref, _ref2;
    pre = '#!';
    h = location.hash.replace(pre, '');
    h_to = (h_to != null ? h_to : '').replace(pre, '');
    m = [];
    re_page = new RegExp('/page/([0-9]+)(?:/from/([0-9]*)/?)?');
    tpl_page = pre + '/page/{%p%}/from/{%p_from%}';
    if (h_to === '' && h === '') {
      _show_page(0, 0);
      location.hash = pre + '/page/0';
      return true;
    }
    m = (h_to !== '' ? h_to : h).match(re_page);
    if (m != null) {
      p = parseInt((_ref = m[1]) != null ? _ref : 0, 10);
      p_from = parseInt((_ref2 = m[2]) != null ? _ref2 : 0, 10);
      if (_is_valid_page(p)) {
        location.hash = tpl_page.replace('{%p%}', p).replace('{%p_from%}', p_from);
        _show_page(p, p_from);
        return true;
      } else {
        location.hash = '#!/page/0';
        return false;
      }
    }
    return false;
  };
  _alert = function(o) {
    return console.log(o);
  };
  __main = function() {
    _setup_geso();
    _setup_slides();
    _bind_functions();
    _listen_url_change();
    _route();
  };
  $(function() {
    return __main();
  });
}).call(this);
