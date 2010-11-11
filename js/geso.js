(function () {
    var _root = this;
    _root.geso_rate = {
        s:  1440 / 1920,
        m:  1920 / 1920
    };
    _root.size = 'm';
    _root.help_showed = false;


    function _setup_geso () {
        // <link rel="stylesheet" type="text/css" href="css/geso.css" />
        //$('<link rel="stylesheet" type="text/css" href="css/geso.css" />').appendTo('body');

        _select_geso_size();

        // <div id="gesogeso">
        //   <div class="geso" id="gesogeso-geso-1"></div>
        //   <div class="geso" id="gesogeso-geso-2"></div>
        //   <div class="geso" id="gesogeso-geso-3"></div>
        //   <div id="geso-wiped"></div>
        // </div>
        var empty_div = '<div></div>';
        // #gesogeso
        $(empty_div)
            .attr({ id: 'gesogeso' })
            // #gesogeso-geso-1
            .append(
                $(empty_div).addClass('geso').addClass('geso-' + size).attr({ id: 'gesogeso-geso-1' })
            )
            // #gesogeso-geso-2
            .append(
                $(empty_div).addClass('geso').addClass('geso-' + size).attr({ id: 'gesogeso-geso-2' })
            )
            // #gesogeso-geso-3
            .append(
                $(empty_div).addClass('geso').addClass('geso-' + size).attr({ id: 'gesogeso-geso-3' })
            )
            // #geso-wiped
            .append(
                $(empty_div).attr({ id: 'geso-wiped' })
            )
            .appendTo('body')
        ;

        _fix_geso_position();
    }


    function _select_geso_size () {
        var w = $(window).width()
          , h = $(window).height()
        ;

        switch (true) {
        case w <= 1096  &&  h <= 870:
            _root.size = 's';
            break;
        case w <= 1680  &&  h <= 860:
            _root.size = 'm';
            break;
        default:
            _root.size = 'm';
        }
    }


    function _fix_geso_position () {
        var $geso1 = $('#gesogeso-geso-1')
          , $geso2 = $('#gesogeso-geso-2')
          , $geso3 = $('#gesogeso-geso-3')
        ;

        var w_w = $(window).width()
          , h_w = $(window).height()
        ;

        $geso1.css({
            top: h_w - parseInt( $geso1.height() / 2 ) + parseInt( 160 * geso_rate[size] )
        });

        $geso2.css({
            top: h_w - parseInt( $geso1.height() / 2 ) + parseInt( 160 * geso_rate[size] )
        });

        $geso3.css({
            left: parseInt( (w_w - $geso3.width()) / 2 )
        });


        // #geso-wiped
        $('#geso-wiped').css({
            width:  $(window).width(),
            height: $(document).height()
        });

    }

    function _wipe (callback) {
        var T = 1500;
        var t = 400;

        _unbind_functions();

        var $geso1 = $('#gesogeso-geso-1')
          , $geso2 = $('#gesogeso-geso-2')
          , $geso3 = $('#gesogeso-geso-3')
        ;
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

        setTimeout(function () {  // ----------------- 1st geso
            _wipe_a_geso(1);
            setTimeout(function () {  //-------------- 2nd geso
                _wipe_a_geso(2);
                setTimeout(function () {  // --------- 3rd geso
                    _wipe_a_geso(3);
                    setTimeout(function () {  // ----- wiped screen
                        _wiped_screen(true);
                        __data.current_slide.hide();
                        setTimeout(function () { // -- clear wiped
                            _wiped_screen(false);
                            ( callback || function () {} )();
                            _bind_functions();
                        }, 100);
                    }, T - t * 2);
                }, t);
            }, t);
        }, 0);
    }

    function _wipe_a_geso (i) {
        var $geso_target = $('#gesogeso-geso-' + i);
        $geso_target.css({
            '-webkit-animation-iteration-count': '1'
        });
    }

    function _wiped_screen(b) {
        b ? $('#geso-wiped').show() : $('#geso-wiped').hide();
    }










    function _setup_slides () {
        var data = window.__data = {
            pages:  0,                  // pages of slides
            current_page: 0,

            slides: [],                 // array of $slides (head, section, footer)
            current_slide: undefined,

            items:              [],
            current_item:       undefined,
            current_item_index: 0,

            _: 1
        };


        $('header, section, footer').each(function () {
            var $slide = $(this);

            if ($slide[0].tagName.toLowerCase() == 'section') {
                $('<div></div>')
                    .addClass('navigator')
                    .addClass('navigator-more-item')
                    .appendTo($slide)
                ;
            }

            data.pages++;
            data.slides.push($slide);
        });


        _fix_slides ();
        _fix_pre_content();
    }



    function _fix_slides () {
        $('header, section, footer').css({
            width:  $(window).width()  - 20 - 20,
            height: $(window).height() - 20 - 20
        });
    }

    function _fix_pre_content () {
        $('section pre').each(function () {
            var lines =
                $(this).text()
                    .replace(/(^ *\n+|\n+ *$)/g, '')
                    .split('\n');
            try {
            var indent_del = (lines[0] || '').match(/^( *)/)[1];
            var re = new RegExp('^' + indent_del);
            for (var i = 0; i < lines.length; i++) {
                lines[i] = lines[i].replace(re, '');
            }
            $(this).text(lines.join('\n'));
            }
            catch (ex) {
                alert(ex);
            }
        });
    }


    function _is_valid_page (p) {
        return (p < __data.pages  &&  p >= 0) ? true : false;
    }

    // p: >= 0
    function _show_page (p, p_from) {
        var data = __data;

        if (!_is_valid_page(p)) {
            return false;
        }


        if (data.current_slide) {
            data.current_slide.hide();
        }

        try {
            data.current_slide = data.slides[p].show();
            data.current_page = p;

            data.items              = [];
            data.current_item       = undefined;
            data.current_item_index = 0;
        }
        catch (ex) {
            alert('oops.');
            return false;
        }


        _setup_items( p >= p_from ? false : true );
        _update_navigator();

        return true;
    }

    function _next_page (b) {
        var tpl_h = '#!/page/{%p%}/from/{%p_from%}';

        if ( _is_valid_page( __data.current_page + 1 ) ) {
            var h = tpl_h
                .replace('{%p%}',      __data.current_page + 1)
                .replace('{%p_from%}', __data.current_page)
            ;

            if (b) {
                _wipe(function () { location.hash = h; });
            }
            else {
                location.hash = h;
            }
        }
    }

    function _prev_page (b) {
        var tpl_h = '#!/page/{%p%}/from/{%p_from%}';

        if ( _is_valid_page( __data.current_page - 1 ) ) {
            var h = tpl_h
                .replace('{%p%}',      __data.current_page - 1)
                .replace('{%p_from%}', __data.current_page)
            ;

            if (b) {
                _wipe(function () { location.hash = h; });
            }
            else {
                location.hash = h;
            }
        }
    }

    function _first_page (b) {
        var tpl_h = '#!/page/{%p%}/from/{%p_from%}';

        if ( _is_valid_page( 0 ) ) {
            var h = tpl_h
                .replace('{%p%}',      0)
                .replace('{%p_from%}', __data.current_page)
            ;

            if (b) {
                _wipe(function () { location.hash = h; });
            }
            else {
                location.hash = h;
            }
        }
    }

    function _last_page (b) {
        var tpl_h = '#!/page/{%p%}/from/{%p_from%}';

        if ( _is_valid_page( __data.pages - 1 ) ) {
            var h = tpl_h
                .replace('{%p%}',      __data.pages - 1)
                .replace('{%p_from%}', __data.current_page)
            ;

            if (b) {
                _wipe(function () { location.hash = h; });
            }
            else {
                location.hash = h;
            }
        }
    }



    function _setup_items (b_back) {
        var target = 'p, pre, ul > li, ol > li, img';

        var data = __data;
        var $slide = data.current_slide;

        if ($slide[0].tagName.toLowerCase() != 'section') {
            return false;
        }

        $slide.find(target).each(function (i) {
            var $item = $(this);

            data.items.push($item);

            // "forward" paging
            if (!b_back) {
                $item.hide();
            }
            // "backward" paging
            else {
                $item.show();
            }
        });

        if (b_back) {
            data.current_item_index = data.items.length;
        }
    }




    function _next_item (b) {
        var data = __data;

        // exists
        if ( data.items[ data.current_item_index ] ) {
            data.items[ data.current_item_index ].show();
            data.current_item_index++;
            _update_navigator();
        }
        //
        else {
            _next_page(b);
        }
    }

    function _prev_item (b) {
        var data = __data;

        // exists
        if ( data.items[ data.current_item_index - 1 ] ) {
            data.current_item_index--;
            data.items[ data.current_item_index ].hide();
            _update_navigator();
        }
        //
        else {
            _prev_page(b);
        }
    }



    function _update_navigator () {
        var data = __data;
        var $navi = data.current_slide.find('.navigator');

        if ( data.items[ data.current_item_index ] ) {
            $navi
                .removeClass('navigator-next-page')
                .addClass('navigator-more-item')
            ;
        }
        else {
            $navi
                .removeClass('navigator-more-item')
                .addClass('navigator-next-page')
            ;
        }
    }



    function _show_help () {
        var usage = [
            '',
            '  Click:           NEXT     item',
            '',
            '  Enter:           NEXT     item',
            '  BackSpace:       PREVIOUS item',
            '',
            '  j:               NEXT     item',
            '  k:               PREVIOUS item',
            '',
            '  Down:            NEXT     page',
            '  Command + Down:  LAST     page',
            '  Up:              PREVIOUS page',
            '  Command + Up:    FIRST    page',
            '',
            '  Shift + (commands above): * "without" wiping',
            '',
            '  h, ?:            show/hide this help',
        ].join('\n');

        var $help = $('#geso-help');
        if (!$help.size()) {
            $help = $('<section></section>')
                .attr('id', 'geso-help')
                .append(
                    $('<pre></pre>').text(usage)
                )
                .appendTo('body')
            ;
            $help.css({
                width:  $(window).width()  - 20 - 20,
                height: $(window).height() - 20 - 20
            });
        }

        _root.help_showed ? $help.hide() : $help.show();
        _root.help_showed = ! _root.help_showed;
    }



    /**
     *
     * URLハッシュを基づいたアクションを実行する
     *
     *   _route();      // location.hash を参照
     *   _route(hash);  // hash を参照
     *
     **/
    function _route (h_to) {
        var pre = '#!';
        var h = location.hash.replace(pre, '');
        h_to = (typeof h_to != 'undefined' ? h_to : '').replace(pre, '');
        var m = []; // matched


        var re_page = new RegExp('/page/([0-9]+)(?:/from/([0-9]*)/?)?');

        var tpl_page = pre + '/page/{%p%}/from/{%p_from%}';

        // URLハッシュも指定もない
        if (h_to == ''  &&  h == '') {
            _show_page(0, 0);
            location.hash = pre + '/page/0';
            return true;
        }

        // 指定，もしくは URLハッシュが #!/page/{p}
        m = ( h_to != '' ? h_to : h ).match(re_page);

        if ( m != null ) {
            var p      = parseInt( m[1] || 0 )
              , p_from = parseInt( m[2] || 0 )
            if (_is_valid_page(p) ) {
                location.hash = tpl_page
                    .replace('{%p%}',      p)
                    .replace('{%p_from%}', p_from)
                ;
                _show_page(p, p_from);
                return true;
            }
            else {
                //_route('/page/0');
                location.hash = '#!/page/0';
                return false;
            }
        }

        return false;
    }



    function _bind_functions () {
        // click
        $('body').click(function (ev) {
            var b_wipe = ev.shiftKey ? false : true;
            _next_item(b_wipe);
        });

        // keydown
        $('body').keydown(function (ev) {
            var b_wipe = ev.shiftKey ? false : true;

            switch (ev.keyCode) {
            // enter
            case 13:
                //_next_page(b_wipe);
                _next_item(b_wipe);
                return false;
                break;

            // backspace
            case 8:
                //_prev_page(b_wipe);
                _prev_item(b_wipe);
                return false;
                break;


            // j, J
            case 74:
                _next_item(b_wipe);
                return false;
                break;
            // k, K
            case 75:
                _prev_item(b_wipe);
                return false;
                break;

            // ↑
            case 38:
                if (ev.metaKey) { _first_page(b_wipe); }
                else            { _prev_page(b_wipe);  }
                return false;
                break;
            // ↓
            case 40:
                if (ev.metaKey) { _last_page(b_wipe); }
                else            { _next_page(b_wipe); }
                return false;
                break;


            // h, ?
            case 72:
            case 191:
                if (ev.keyCode == 191 && !ev.shiftKey) { return; }
                _show_help();
                break;
            }
        });
    }

    function _unbind_functions () {
        $('body')
            .unbind('click')
            .unbind('keydown')
        ;
    }


    /**
     *
     * URL変化を感知する
     *
     *   1. _root.handle_url_change(url, url_before) を定義する
     *   2. listen_url_change() する
     *
     */
    function _listen_url_change (interval) {
        _root.__urlchev__url_before = location.href;
        _root.__urlchev__timer = setInterval(function () {
            if (location.href != __urlchev__url_before) {
                (_root.handle_url_change || function () {}) (location.href, __urlchev__url_before);
                __urlchev__url_before = location.href;
            }
        }, interval || 50);
    }

    // URL変化時のハンドラ
    _root.handle_url_change = function (url, url_before) {
        var m = url.match(/#!(.*)$/);
        var h = m[1] || '';
        _route(h);
    };



    window.__main = function () {
        _setup_geso();
        _setup_slides();
        _bind_functions();
        _listen_url_change();
        _route();
    };

})();



$(function () {
    __main();
});
