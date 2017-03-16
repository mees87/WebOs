$('#applogo').click(function() {
    open_app();
});

function open_app() {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="app.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('App').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });

    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    //top section

    //add buttons

    var cross = createImg('cross.png');

    cross.parent(head);

    cross.class('cross');

    cross.mouseOver(function() {
        cross.attribute('src', 'crosssel.png');
    });

    cross.mouseOut(function() {
        cross.attribute('src', 'cross.png');
    });

    cross.mouseClicked(function() {
        d.remove();
        icon.remove();
        icons--;
    });

    var min = createImg('min.png');

    min.parent(head);

    min.class('cross');

    min.mouseOver(function() {
        min.attribute('src', 'minsel.png');
    });

    min.mouseOut(function() {
        min.attribute('src', 'min.png');
    });

    min.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });


    var max = createImg('max.png');

    max.parent(head);

    max.class('cross');

    max.mouseOver(function() {
        max.attribute('src', 'maxsel.png');
    });

    max.mouseOut(function() {
        max.attribute('src', 'max.png');
    });

    max.mouseClicked(function() {
        d.style('width', '100%').style('height', '100%').position(0, 0);
    });




    //body
    var body = createDiv('').parent(d).class('body');

    //todo

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};
