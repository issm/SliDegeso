_root = this
_root.VERSION = '0.0004'
_root.geso_rate =
        s: 1440 / 1920,
        m: 1920 / 1920,
_root.size = 'm'
_root.wiper_enabled = true
_root.help_showed = false


_setup_geso = () ->
    # $('<link rel="stylesheet" type="text/css" href="css/geso.css" />').appendTo 'body'

    _select_geso_size()

    $( """
        <div id=\"gesogeso\">
          <div class=\"geso geso-#{size}\" id=\"gesogeso-geso-1\"></div>
          <div class=\"geso geso-#{size}\" id=\"gesogeso-geso-2\"></div>
          <div class=\"geso geso-#{size}\" id=\"gesogeso-geso-3\"></div>
          <div id=\"geso-wiped\"></div>
        </div>
    """ ).appendTo 'body'

    _fix_geso_position()


_select_geso_size = () ->
    w = $(window).width()
    h = $(window).height()

    switch true
        when w <= 1096  &&  h <= 870
            _root.size = 's'
        when w<= 1680  &&  h <= 860
            _root.size = 'm'
        else
            _root.size = 'm'


_fix_geso_position = () ->
    $geso1 = $ '#gesogeso-geso-1'
    $geso2 = $ '#gesogeso-geso-2'
    $geso3 = $ '#gesogeso-geso-3'

    w_w = $(window).width()
    h_w = $(window).height()

    $geso1.css(
        top: h_w - parseInt( $geso1.height() / 2 ) + parseInt( 160 * geso_rate[size] )
    );

    $geso2.css(
        top: h_w - parseInt( $geso1.height() / 2 ) + parseInt( 160 * geso_rate[size] )
    );

    $geso3.css(
        left: parseInt( (w_w - $geso3.width()) / 2 )
    );

    # #geso-wiped
    $('#geso-wiped').css(
        width:  $(window).width(),
        height: $(document).height()
    );


_wipe = (callback) ->
    [T, t] = [1500, 400]

    _unbind_functions();

    if not _root.wiper_enabled
        ( callback ? () -> )()
        _bind_functions()
        return

    $geso1 = $ '#gesogeso-geso-1'
    $geso2 = $ '#gesogeso-geso-2'
    $geso3 = $ '#gesogeso-geso-3'

    $geso1.css
        '-webkit-animation-iteration-count': '0',
        '-webkit-animation-duration':        (T / 1000) + 's'
    $geso2.css
        '-webkit-animation-iteration-count': '0',
        '-webkit-animation-duration':        ((T - t) / 1000) + 's'
    $geso3.css
        '-webkit-animation-iteration-count': '0',
        '-webkit-animation-duration':        ((T - t * 2) / 1000) + 's'

    setTimeout () ->  #  ----------------- 1st geso
        _wipe_a_geso 1
        setTimeout () ->  # -------------- 2nd geso
            _wipe_a_geso 2
            setTimeout () ->  #  --------- 3rd geso
                _wipe_a_geso 3
                setTimeout () ->  #  ----- wiped screen
                    _wiped_screen true
                    __data.current_slide.hide()
                    setTimeout () ->  #  -- clear wiped
                        _wiped_screen false
                        ( callback ? () -> )()
                        _bind_functions()
                    , 100
                , T - t * 2
            , t
        , t
    , 0


_wipe_a_geso = (i) ->
    $geso_target = $ "#gesogeso-geso-#{i}"
    $geso_target.css
        '-webkit-animation-iteration-count': '1'
    i


_wiped_screen = (b) ->
    if b then $('#geso-wiped').show() else $('#geso-wiped').hide()
    b


_setup_slides = () ->
    data = window.__data =
        pages:  0,                  #  pages of slides
        current_page: 0,

        slides: [],                 #  array of $slides (head, section, footer)
        current_slide: undefined,

        items:              [],
        current_item:       undefined,
        current_item_index: 0,

    $('header, section, footer').each () ->
        $slide = $ this

        if $slide[0].tagName.toLowerCase() is 'section'
            $( """
                <div class=\"wiper-status wiper-status-enabled\"></div>
                <div class=\"navigator navigator-more-item\"></div>
            """ ).appendTo $slide

        data.pages++
        data.slides.push $slide

    _fix_slides()
    _fix_pre_content()


_fix_slides = () ->
    $('header, section, footer').css
        width:  $(window).width()  - 20 - 20,
        height: $(window).height() - 20 - 20


_fix_pre_content = () ->
    $('section pre').each () ->
        lines =
             $(this).html()
                 .replace(/(^ *\n+|\n+ *$)/g, '')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .split('\n')
        try
            [_dummy, indent_del] = (lines[0] ? '').match /^( *)/
            re = new RegExp '^' + indent_del
            for i in [ 0 ... lines.length ]
                lines[i] = lines[i].replace re, ''
            $(this).text lines.join('\n')
        catch ex
            _alert ex


_is_valid_page = (p) ->
    if ( p < __data.pages  &&  p >= 0 ) then true else false


# p: >= 0
_show_page = (p, p_from) ->
    data = __data

    if not _is_valid_page p
        return false

    if data.current_slide
        data.current_slide.hide()

    try
        data.current_slide = data.slides[p].show()
        data.current_page = p

        data.items              = []
        data.current_item       = undefined
        data.current_item_index = 0
    catch ex
        _alert 'oops.'
        return false

    _setup_items ( if p >= p_from then false else true )
    _update_navigator()
    _update_wiper_status()

    return true


_next_page = (b) ->
    p = __data.current_page + 1
    if _is_valid_page p
        h = "#!/page/#{p}/from/#{__data.current_page}"

        if b
            _wipe () -> location.hash = h
        else
            location.hash = h


_prev_page = (b) ->
    p = __data.current_page - 1
    if _is_valid_page p
        h = "#!/page/#{p}/from/#{__data.current_page}"

        if b
            _wipe () -> location.hash = h
        else
            location.hash = h


_first_page = (b) ->
    p = 0
    if _is_valid_page p
        h = "#!/page/#{p}/from/#{__data.current_page}"

        if b
            _wipe () -> location.hash = h
        else
            location.hash = h


_last_page = (b) ->
    p = __data.pages - 1
    if _is_valid_page p
        h = "#!/page/#{p}/from/#{__data.current_page}"

        if b
            _wipe () -> location.hash = h
        else
            location.hash = h


_setup_items = (b_back) ->
    target = 'p, pre, ul > li, ol > li, img'

    data = __data
    $slide = data.current_slide

    if $slide[0].tagName.toLowerCase() isnt 'section'
        return false

    if $slide.hasClass('show-all')
        b_back = true;

    $slide.find(target).each (i) ->
        $item = $ this

        data.items.push $item

        #  "forward" paging
        if not b_back
            $item.hide()
        #  "backward" paging
        else
            $item.show()

    if b_back
        data.current_item_index = data.items.length

    return


_next_item = (b) ->
    data = __data

    #  exists
    if data.items[ data.current_item_index ]
        data.items[ data.current_item_index ].show()
        data.current_item_index++
        _update_navigator()
    #
    else
        _next_page b


_prev_item = (b) ->
    data = __data

    #  exists
    if data.items[ data.current_item_index - 1 ]
        data.current_item_index--
        data.items[ data.current_item_index ].hide()
        _update_navigator()
    #
    else
        _prev_page b


_update_navigator = () ->
    #_alert 'update_navigator'
    data = __data
    $navi = data.current_slide.find '.navigator'

    if data.items[ data.current_item_index ]
        $navi
            .removeClass('navigator-next-page')
            .addClass('navigator-more-item')
    else
        $navi
            .removeClass('navigator-more-item')
            .addClass('navigator-next-page')


_toggle_wiper_status = () ->
    _root.wiper_enabled = not _root.wiper_enabled
    _update_wiper_status()


_update_wiper_status = () ->
    $navi = window.__data.current_slide.find '.wiper-status'
    if _root.wiper_enabled
        $navi.addClass 'wiper-status-enabled'
    else
        $navi.removeClass 'wiper-status-enabled'


_show_help = () ->
    usage = """

         Click:           NEXT     item

         Enter:           NEXT     item
         BackSpace:       PREVIOUS item

         j:               NEXT     item
         k:               PREVIOUS item

         Down:            NEXT     page
         Command + Down:  LAST     page
         Up:              PREVIOUS page
         Command + Up:    FIRST    page

         Shift + (commands above): * \"without\" wiping

         w:               toggle wiper

         h, ?:            show/hide this help
    """

    $help = $ '#geso-help'
    if not $help.size()
        $help = $('<section></section>')
            .attr(
                id: 'geso-help'
            )
            .append(
                $('<pre></pre>').text usage
            )
            .appendTo 'body'
        $help.css
            width:  $(window).width()  - 20 - 20,
            height: $(window).height() - 20 - 20

    if _root.help_showed then $help.hide() else $help.show()
    _root.help_showed = not _root.help_showed


_bind_functions = () ->
    #  click
    $('body').click (ev) ->
        b_wipe = if ev.shiftKey then false else true
        _next_item b_wipe

    #  keydown
    $('body').keydown (ev) ->
        $slide = __data.current_slide
        b_wipe = if ev.shiftKey then false else true

        switch ev.keyCode
            #  j, J, enter
            when 74, 13
                if $slide.hasClass 'show-all'
                     _next_page b_wipe
                else
                    _next_item b_wipe
                return false
            #  k, K, backspace
            when 75, 8
                if $slide.hasClass 'show-all'
                    _prev_page b_wipe
                else
                    _prev_item b_wipe
                return false

            #  p, ↑
            when 80, 38
                if ev.metaKey
                    _first_page b_wipe
                else
                    _prev_page b_wipe
                return false
            #  n, ↓
            when 78, 40
                if  ev.metaKey
                    _last_page b_wipe
                else
                    _next_page b_wipe
                return false

            #  w
            when 87
                _toggle_wiper_status()
                return false

            #  h, ?
            when 72, 191
                if ( ev.keyCode is 191 && not ev.shiftKey? ) then return
                _show_help()


_unbind_functions = () ->
    $('body')
        .unbind('click')
        .unbind('keydown')


#
# URL変化を感知する
#
#   1. _root.handle_url_change(url, url_before) を定義する
#   2. listen_url_change() する
#
_listen_url_change = (interval) ->
    _root.__urlchev__url_before = location.href
    _root.__urlchev__timer = setInterval () ->
        if location.href isnt _root.__urlchev__url_before
            ( _root.handle_url_change ? () -> )( location.href, _root.__urlchev__url_before )
            _root.__urlchev__url_before = location.href
    , interval ? 50


# URL変化時のハンドラ
_root.handle_url_change = (url, url_before) ->
    m = url.match /\#!(.*)$/
    #h = m[1] ? ''
    h = if m? then (m[1] ? '') else ''
    _route h


#
# URLハッシュを基づいたアクションを実行する
#
#   _route();      // location.hash を参照
#   _route(hash);  // hash を参照
#
_route = (h_to) ->
    pre  = '#!'
    h    = location.hash.replace pre, ''
    h_to = ( if h_to? then h_to else '' ).replace pre, ''
    m = []; #  matched

    re_page = new RegExp '/page/([0-9]+)(?:/from/([0-9]*)/?)?'

    tpl_page = pre + '/page/{%p%}/from/{%p_from%}'

    #  URLハッシュも指定もない
    if h_to is ''  &&  h is ''
        _show_page 0, 0
        location.hash = pre + '/page/0'
        return true

    #  指定，もしくは URLハッシュが #!/page/{p}
    m = ( if h_to isnt '' then h_to else h ).match re_page

    if m?
        p      = parseInt m[1] ? 0, 10
        p_from = parseInt m[2] ? 0, 10
        if _is_valid_page p
            location.hash = tpl_page
                .replace( '{%p%}', p )
                .replace( '{%p_from%}', p_from )
            _show_page p, p_from
            return true
        else
            # _route '/page/0'
            location.hash = '#!/page/0'
            return false

    return false;


_alert = (o) ->
    # alert o
    console.log o



__main = () ->
    _setup_geso();
    _setup_slides();
    _bind_functions();
    _listen_url_change();
    _route();
    return


$ ->
    __main()
