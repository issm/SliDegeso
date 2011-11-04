(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.SliDegeso = (function() {
    SliDegeso.VERSION = '0.0005';
    SliDegeso.config = {};
    function SliDegeso() {
      var _ref, _ref2;
      this.config = (_ref = this.constructor.config) != null ? _ref : {};
      this.geso_rate = {
        s: 1440 / 1920,
        m: 1920 / 1920
      };
      this.size = 'm';
      this.wiper_enabled = (_ref2 = this.config.wiper_enabled) != null ? _ref2 : true;
      this.help_showed = false;
      this.__data;
      this.handle_url_change = __bind(function(url, url_before) {
        var h, m, _ref3;
        m = url.match(/\#!(.*)$/);
        h = m != null ? (_ref3 = m[1]) != null ? _ref3 : '' : '';
        return this._route(h);
      }, this);
      this._setup_geso();
      this._setup_slides();
      this._bind_functions();
      this._listen_url_change();
      this._route();
    }
    SliDegeso.prototype._setup_geso = function() {
      this._select_geso_size();
      $("<div id=\"gesogeso\">\n  <div class=\"geso geso-" + this.size + "\" id=\"gesogeso-geso-1\"></div>\n  <div class=\"geso geso-" + this.size + "\" id=\"gesogeso-geso-2\"></div>\n  <div class=\"geso geso-" + this.size + "\" id=\"gesogeso-geso-3\"></div>\n  <div id=\"geso-wiped\"></div>\n</div>").appendTo('body');
      return this._fix_geso_position();
    };
    SliDegeso.prototype._select_geso_size = function() {
      var h, w;
      w = $(window).width();
      h = $(window).height();
      switch (true) {
        case w <= 1096 && h <= 870:
          return this.size = 's';
        case w <= 1680 && h <= 860:
          return this.size = 'm';
        default:
          return this.size = 'm';
      }
    };
    SliDegeso.prototype._fix_geso_position = function() {
      var $geso1, $geso2, $geso3, h_w, w_w;
      $geso1 = $('#gesogeso-geso-1');
      $geso2 = $('#gesogeso-geso-2');
      $geso3 = $('#gesogeso-geso-3');
      w_w = $(window).width();
      h_w = $(window).height();
      $geso1.css({
        top: h_w - parseInt($geso1.height() / 2) + parseInt(160 * this.geso_rate[this.size])
      });
      $geso2.css({
        top: h_w - parseInt($geso1.height() / 2) + parseInt(160 * this.geso_rate[this.size])
      });
      $geso3.css({
        left: parseInt((w_w - $geso3.width()) / 2)
      });
      return $('#geso-wiped').css({
        width: $(window).width(),
        height: $(document).height()
      });
    };
    SliDegeso.prototype._wipe = function(callback) {
      var $geso1, $geso2, $geso3, T, t, _ref;
      _ref = [1500, 400], T = _ref[0], t = _ref[1];
      this._unbind_functions();
      if (!this.wiper_enabled) {
        (callback != null ? callback : function() {})();
        this._bind_functions();
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
      return setTimeout(__bind(function() {
        this._wipe_a_geso(1);
        return setTimeout(__bind(function() {
          this._wipe_a_geso(2);
          return setTimeout(__bind(function() {
            this._wipe_a_geso(3);
            return setTimeout(__bind(function() {
              this._wiped_screen(true);
              this.__data.current_slide.hide();
              return setTimeout(__bind(function() {
                this._wiped_screen(false);
                (callback != null ? callback : __bind(function() {}, this))();
                return this._bind_functions();
              }, this), 100);
            }, this), T - t * 2);
          }, this), t);
        }, this), t);
      }, this), 0);
    };
    SliDegeso.prototype._wipe_a_geso = function(i) {
      var $geso_target;
      $geso_target = $("#gesogeso-geso-" + i);
      $geso_target.css({
        '-webkit-animation-iteration-count': '1'
      });
      return i;
    };
    SliDegeso.prototype._wiped_screen = function(b) {
      if (b) {
        $('#geso-wiped').show();
      } else {
        $('#geso-wiped').hide();
      }
      return b;
    };
    SliDegeso.prototype._setup_slides = function() {
      var data;
      data = this.__data = {
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
      this._fix_slides();
      return this._fix_pre_content();
    };
    SliDegeso.prototype._fix_slides = function() {
      return $('header, section, footer').css({
        width: $(window).width() - 20 - 20,
        height: $(window).height() - 20 - 20
      });
    };
    SliDegeso.prototype._fix_pre_content = function() {
      var self;
      self = this;
      return $('section pre').each(function() {
        var i, indent_del, lines, re, _dummy, _ref, _ref2, _ref3;
        lines = $(this).html().replace(/(^ *\n+|\n+ *$)/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').split('\n');
        try {
          _ref2 = ((_ref = lines[0]) != null ? _ref : '').match(/^( *)/), _dummy = _ref2[0], indent_del = _ref2[1];
          re = new RegExp('^' + indent_del);
          for (i = 0, _ref3 = lines.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
            lines[i] = lines[i].replace(re, '');
          }
          return $(this).text(lines.join('\n'));
        } catch (ex) {
          return self._alert(ex);
        }
      });
    };
    SliDegeso.prototype._is_valid_page = function(p) {
      if (p < this.__data.pages && p >= 0) {
        return true;
      } else {
        return false;
      }
    };
    SliDegeso.prototype._show_page = function(p, p_from) {
      var data;
      data = this.__data;
      if (!this._is_valid_page(p)) {
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
        this.alert('oops.');
        return false;
      }
      this._setup_items((p >= p_from ? false : true));
      this._update_navigator();
      this._update_wiper_status();
      return true;
    };
    SliDegeso.prototype._next_page = function(b) {
      var h, p;
      p = this.__data.current_page + 1;
      if (this._is_valid_page(p)) {
        h = "#!/page/" + p + "/from/" + this.__data.current_page;
        if (b) {
          return this._wipe(function() {
            return location.hash = h;
          });
        } else {
          return location.hash = h;
        }
      }
    };
    SliDegeso.prototype._prev_page = function(b) {
      var h, p;
      p = this.__data.current_page - 1;
      if (this._is_valid_page(p)) {
        h = "#!/page/" + p + "/from/" + this.__data.current_page;
        if (b) {
          return this._wipe(function() {
            return location.hash = h;
          });
        } else {
          return location.hash = h;
        }
      }
    };
    SliDegeso.prototype._first_page = function(b) {
      var h, p;
      p = 0;
      if (this._is_valid_page(p)) {
        h = "#!/page/" + p + "/from/" + this.__data.current_page;
        if (b) {
          return this._wipe(function() {
            return location.hash = h;
          });
        } else {
          return location.hash = h;
        }
      }
    };
    SliDegeso.prototype._last_page = function(b) {
      var h, p;
      p = this.__data.pages - 1;
      if (this._is_valid_page(p)) {
        h = "#!/page/" + p + "/from/" + this.__data.current_page;
        if (b) {
          return this._wipe(function() {
            return location.hash = h;
          });
        } else {
          return location.hash = h;
        }
      }
    };
    SliDegeso.prototype._setup_items = function(b_back) {
      var $slide, data, target;
      target = 'p, pre, ul > li, ol > li, img';
      data = this.__data;
      $slide = data.current_slide;
      if ($slide[0].tagName.toLowerCase() !== 'section') {
        return false;
      }
      if ($slide.hasClass('show-all')) {
        b_back = true;
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
    SliDegeso.prototype._next_item = function(b) {
      var data;
      data = this.__data;
      if (data.items[data.current_item_index]) {
        data.items[data.current_item_index].show();
        data.current_item_index++;
        return this._update_navigator();
      } else {
        return this._next_page(b);
      }
    };
    SliDegeso.prototype._prev_item = function(b) {
      var data;
      data = this.__data;
      if (data.items[data.current_item_index - 1]) {
        data.current_item_index--;
        data.items[data.current_item_index].hide();
        return this._update_navigator();
      } else {
        return this._prev_page(b);
      }
    };
    SliDegeso.prototype._update_navigator = function() {
      var $navi, data;
      data = this.__data;
      $navi = data.current_slide.find('.navigator');
      if (data.items[data.current_item_index]) {
        return $navi.removeClass('navigator-next-page').addClass('navigator-more-item');
      } else {
        return $navi.removeClass('navigator-more-item').addClass('navigator-next-page');
      }
    };
    SliDegeso.prototype._toggle_wiper_status = function() {
      this.wiper_enabled = !this.wiper_enabled;
      return this._update_wiper_status();
    };
    SliDegeso.prototype._update_wiper_status = function() {
      var $navi;
      $navi = this.__data.current_slide.find('.wiper-status');
      if (this.wiper_enabled) {
        return $navi.addClass('wiper-status-enabled');
      } else {
        return $navi.removeClass('wiper-status-enabled');
      }
    };
    SliDegeso.prototype._show_help = function() {
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
      if (this.help_showed) {
        $help.hide();
      } else {
        $help.show();
      }
      return this.help_showed = !this.help_showed;
    };
    SliDegeso.prototype._bind_functions = function() {
      $('body').click(__bind(function(ev) {
        var b_wipe;
        b_wipe = ev.shiftKey ? false : true;
        return this._next_item(b_wipe);
      }, this));
      return $('body').keydown(__bind(function(ev) {
        var $slide, b_wipe;
        $slide = this.__data.current_slide;
        b_wipe = ev.shiftKey ? false : true;
        switch (ev.keyCode) {
          case 74:
          case 13:
            if ($slide.hasClass('show-all')) {
              this._next_page(b_wipe);
            } else {
              this._next_item(b_wipe);
            }
            return false;
          case 75:
          case 8:
            if ($slide.hasClass('show-all')) {
              this._prev_page(b_wipe);
            } else {
              this._prev_item(b_wipe);
            }
            return false;
          case 80:
          case 38:
            if (ev.metaKey) {
              this._first_page(b_wipe);
            } else {
              this._prev_page(b_wipe);
            }
            return false;
          case 78:
          case 40:
            if (ev.metaKey) {
              this._last_page(b_wipe);
            } else {
              this._next_page(b_wipe);
            }
            return false;
          case 87:
            this._toggle_wiper_status();
            return false;
          case 72:
          case 191:
            if (ev.keyCode === 191 && !(ev.shiftKey != null)) {
              return;
            }
            return this._show_help();
        }
      }, this));
    };
    SliDegeso.prototype._unbind_functions = function() {
      return $('body').unbind('click').unbind('keydown');
    };
    SliDegeso.prototype._listen_url_change = function(interval) {
      this.__urlchev__url_before = location.href;
      return this.__urlchev__timer = setInterval(__bind(function() {
        var _ref;
        if (location.href !== this.__urlchev__url_before) {
          ((_ref = this.handle_url_change) != null ? _ref : function() {})(location.href, this.__urlchev__url_before);
          return this.__urlchev__url_before = location.href;
        }
      }, this), interval != null ? interval : 50);
    };
    SliDegeso.prototype._route = function(h_to) {
      var h, m, p, p_from, pre, re_page, tpl_page, _ref, _ref2;
      pre = '#!';
      h = location.hash.replace(pre, '');
      h_to = (h_to != null ? h_to : '').replace(pre, '');
      m = [];
      re_page = new RegExp('/page/([0-9]+)(?:/from/([0-9]*)/?)?');
      tpl_page = pre + '/page/{%p%}/from/{%p_from%}';
      if (h_to === '' && h === '') {
        this._show_page(0, 0);
        location.hash = pre + '/page/0';
        return true;
      }
      m = (h_to !== '' ? h_to : h).match(re_page);
      if (m != null) {
        p = parseInt((_ref = m[1]) != null ? _ref : 0, 10);
        p_from = parseInt((_ref2 = m[2]) != null ? _ref2 : 0, 10);
        if (this._is_valid_page(p)) {
          location.hash = tpl_page.replace('{%p%}', p).replace('{%p_from%}', p_from);
          this._show_page(p, p_from);
          return true;
        } else {
          location.hash = '#!/page/0';
          return false;
        }
      }
      return false;
    };
    SliDegeso.prototype.alert = function(o) {
      return console.log(o);
    };
    return SliDegeso;
  })();
  $(function() {
    return window._slidegeso = new SliDegeso;
  });
}).call(this);
