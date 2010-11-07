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
            bottom: - $geso1.height()
        });

        $geso2.css({
            bottom: - parseInt( $geso2.width() / 2 )
        });

        $geso3.css({
            left: parseInt( (w_w - $geso3.width()) / 2 )
        });

    }

    function _wipe (callback) {
        var t = 800;
        var t_cross = 400;
        
        var $geso1 = $('#gesogeso-geso-1')
          , $geso2 = $('#gesogeso-geso-2')
          , $geso3 = $('#gesogeso-geso-3')
        ;
        $geso1.css({
            '-webkit-animation-iteration-count': '0',
            '-webkit-animation-duration': (t / 1000) + 's'
        });
        $geso2.css({
            '-webkit-animation-iteration-count': '0',
            '-webkit-animation-duration': (t / 1000) + 's'
        });
        $geso3.css({
            '-webkit-animation-iteration-count': '0',
            '-webkit-animation-duration': (t / 1000) + 's'
        });

        setTimeout(function () {
            _wipe_a_geso(1);
            setTimeout(function () {
                _wipe_a_geso(2);
                setTimeout(function () {
                    _wipe_a_geso(3);
                    setTimeout(function () {
                        ( callback || function () {} )();
                    }, t);
                }, t - t_cross);
            }, t - t_cross);
        }, 0);

    }

    function _wipe_a_geso (i) {
        var $geso_target = $('#gesogeso-geso-' + i);
        $geso_target.css({
            '-webkit-animation-iteration-count': '1'
        });
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
