(function () {

    function _setup_geso () {
        // <link rel="stylesheet" type="text/css" href="css/geso.css" />
        //$('<link rel="stylesheet" type="text/css" href="css/geso.css" />').appendTo('body');

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
                $(empty_div).addClass('geso').attr({ id: 'gesogeso-geso-1' })
            )
            // #gesogeso-geso-2
            .append(
                $(empty_div).addClass('geso').attr({ id: 'gesogeso-geso-2' })
            )
            // #gesogeso-geso-3
            .append(
                $(empty_div).addClass('geso').attr({ id: 'gesogeso-geso-3' })
            )
            // #geso-wiped
            .append(
                $(empty_div).attr({ id: 'geso-wiped' })
            )
            .appendTo('body')
        ;

        _fix_geso_position();
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
            top: h_w - parseInt( $geso1.height() / 2 ) + 160
        });

        $geso2.css({
            top: h_w - parseInt( $geso1.height() / 2 ) + 160
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

        setTimeout(function () {
            _wipe_a_geso(1);
            setTimeout(function () {
                _wipe_a_geso(2);
                setTimeout(function () {
                    _wipe_a_geso(3);
                    setTimeout(function () {
                        _wiped_screen(true);
                        setTimeout(function () {
                            _wiped_screen(false);
                            ( callback || function () {} )();
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

            _: 1
        };


        $('header, section, footer').each(function () {
            var $slide = $(this);
            data.pages++;
            data.slides.push($slide);
        });


        _fix_slides ();
        _show_page(0);
    }



    function _fix_slides () {
        $('header, section, footer').css({
            width:  $(window).width()  - 20 - 20,
            height: $(window).height() - 20 - 20
        });
    }


    function _is_valid_page (p) {
        return (p < __data.pages  &&  p >= 0) ? true : false;
    }

    // p: >= 0
    function _show_page (p) {
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

            // modify url
            var url_hash = '#!/page/' + p;
            if ( /(?:#.*$)/.test(location.href) ) {
                location.href = location.href.replace( /(?:#.*$)/, url_hash );
            }
            else {
                location.href += url_hash;
            }
        }
        catch (ex) {
            alert('oops.');
            return false;
        }

        return true;
    }

    function _next_page (b) {
        if (b) {
            if ( _is_valid_page( __data.current_page + 1 ) ) {
                _wipe(function () { _show_page(__data.current_page + 1) });
            }
        }
        else {
            _show_page(__data.current_page + 1);
        }
    }

    function _prev_page (b) {
        if (b) {
            if ( _is_valid_page( __data.current_page - 1 ) ) {
                _wipe(function () { _show_page(__data.current_page - 1) });
            }
        }
        else {
            _show_page(__data.current_page - 1);
        }
    }



    function _next_item (b) {
    }

    function _prev_item (b) {
    }




    /**
     *
     *  CLick:              next item
     *  Shift + Click:      next item without wiping
     *
     *  Enter:              next page with wiping
     *  Shift + Enter:      next page without wiping
     *  BackSpace:          previous page with wiping
     *  Shift + BackSpace:  previous page without wiping
     *
     *  j: next item
     *  k: previous item
     *
     **/
    function _bind_keys () {
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
                _next_page(b_wipe);
                return false;
                break;

            // backspace
            case 8:
                _prev_page(b_wipe);
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

            }
        });
    }





    window.__main = function () {
        _setup_geso();
        _setup_slides();
        _bind_keys();
    };

})();



$(function () {
    __main();
});
