(function () {


    function _fix_geso_position () {
        var $geso1 = $('#gesogeso-geso-1')
          , $geso2 = $('#gesogeso-geso-2')
          , $geso3 = $('#gesogeso-geso-3')
        ;

        var w_w = $(window).width()
          , h_w = $(window).height()
        ;

        $geso1.css({
            bottom: - parseInt( $geso1.height() / 2 ) - 160
        });

        $geso2.css({
            //bottom: - parseInt( $geso2.width() / 2 )
            bottom: - parseInt( $geso2.height() / 2 ) - 160
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








    function _bind_keys () {
        $('body').click(function () {
            _wipe();
        });
    }
















    window.__main = function () {
        _fix_geso_position();
        _bind_keys();
    };

})();



$(function () {
    __main();
});
