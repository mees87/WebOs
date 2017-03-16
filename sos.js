$('.login_page').css({
    position: 'absolute',
    width: $(window).width(),
    height: $(window).height(),
    top: '0px',
    left: '0px'
});

$('#os').css({
    position: 'absolute',
    width: $(window).width(),
    height: $(window).height(),
    top: '0px',
    left: '0px'
});


$('.taskbar').css({
    position: 'absolute',
    width: $(window).width(),
    height: '40px',
    top: ($(window).height() - 41),
    left: '0px'
});


//var os = select('#os');



// Initialize Firebase
var config = {
    apiKey: "AIzaSyDBjpfifmxfd5OyJrnamn_hrbZwwD4Axvs",
    authDomain: "sos-users.firebaseapp.com",
    databaseURL: "https://sos-users.firebaseio.com",
    storageBucket: "sos-users.appspot.com",
    messagingSenderId: "882097385139"
};
firebase.initializeApp(config);

var database = firebase.database();
var storage = firebase.storage();

username = 'undefined';
settings = {};

firebase.auth().signOut();



var icons = 0;

var user_key;

$('#loginButton').click(function() {
    username = $('#username').val();
    var pass = $('#pass').val();
    var ref = database.ref(username);
    ref.once('value', function(data) {
        user_key = Object.keys(data.val())[0];
        key = Object.keys(data.val())[0];
        var email = data.val()[key].email;
        firebase.auth().signInWithEmailAndPassword(email, pass).then(function() {
            var background = data.val()[key].background;
            settings = data.val()[key].settings;
            var background = background[Object.keys(background)[Object.keys(background).length - 1]];
            if (background != 'default') {
              if (background != 'storeimg') {
                $('#os').css('background-image', 'url("' + background + '")');
                $('#logo').remove();
              }else if (background == 'storeimg') {
                storage.ref(username + '/os/system/background.png').getDownloadURL().then(function(url) {

                    $('#os').css('background-image', 'url("' + url + '")');
                });
                //$('#os').css('background-image', 'url("' + background + '")');
                $('#logo').remove();
              }

            }/*
            if (background == 'storeimg') {
                storage.ref(username + '/os/system/background.png').getDownloadURL().then(function(url) {

                    $('#os').css('background-image', 'url("' + url + '")');
                });
                //$('#os').css('background-image', 'url("' + background + '")');
                $('#logo').remove();
            }*/
            if (settings['background-repeat']) {
                if (settings['background-repeat-x'] && settings['background-repeat-y']) {
                    $('#os').css('background-repeat', 'repeat');
                } else if (settings['background-repeat-y']) {
                    $('#os').css('background-repeat', 'repeat-y');
                } else if (settings['background-repeat-x']) {
                    $('#os').css('background-repeat', 'repeat-x');
                } else {
                    $('#os').css('background-repeat', 'no-repeat');
                }
            } else {
                $('#os').css('background-repeat', 'no-repeat');
            }

            $('#os').css('background-size', settings['background-size']);
        });

        all_files = data.val()[key].file_loc;
    });


    //firebase.auth().signInWithEmailAndPassword(username, pass);
});

firebase.auth().onAuthStateChanged(function(user) {
    //go to real os
    if (user) {
        $('.login_page').animate({
            top: '-=' + $(window).height().toString()
        }, 1500, function() {
            this.remove()
        });
    }
});


function back_url(url) {
    console.log('test1');
    if (/(http|https):\/\//.test(url)) {
        console.log('test2');

        var res = /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/.test(url);
        if (res) {
            console.log('test3');
            var ref = database.ref(username);
            ref.once('value', function(data) {
                var key = Object.keys(data.val())[0];
                database.ref(username + '/' + key + '/background').push(url);
            });
            location.reload();
        } else {
            alert('Invalid URL');
        }
    } else {
        back_url('http://' + url);
    }
}

function back_file(file) {
    //file
    var file = file.files[0];

    //storage ref
    var ref = storage.ref(username + '/os/system/background.png');

    //upload
    ref.put(file).then(function() {
        location.reload();
    });

    //set background
    var ref2 = database.ref(username);
    ref2.once('value', function(data) {
        var key = Object.keys(data.val())[0];
        database.ref(username + '/' + key + '/background').push('storeimg');
    });
}


$('#os').contextmenu(function(evt) {
    $('.ui.dropdown#pref').dropdown({
        transition: 'fade',
        onHide: function() {
            if ($.trim($('#backfile').val()).length) {
                return false;
            }
        }
    });
    var pref = select('#pref');
    pref.position(evt.pageX, evt.pageY);
    $('#pref>.text').click();
    evt.preventDefault();
});

$('#pref').mouseleave(function() {
    $('#os').click();
});

$('#file_opt').mouseleave(function() {
    $('#os').click();
});

$('.uploadb').click(function() {
    $('#backfile').val('');
});

function addDropdown(files, dir) {
    if (files.length > 0) {
        for (i = 0; i < files.length; i++) {
            filename = files[i];
            if (filename.split('.').pop() != filename) {
                if (dir != '') {
                    $('#apps#' + dir).append('<div class="item">' + filename + '</div>');
                } else {
                    $('#apps').append('<div class="item">' + filename + '</div>');
                }
            } else if (filename.split('.').pop() == filename) {
                if (dir != '') {
                    $('#apps#' + dir).append('<div class="item"><i class="dropdown icon"></i>' + filename + '<div id="' + dir + '-' + filename + '" class="menu"></div></div></div>');
                } else {
                    $('#apps').append('<div class="item"><i class="dropdown icon"></i>' + filename + '<div id="' + dir + '-' + filename + '" class="menu"></div></div></div>');
                }
                //get data
                var ref = database.ref(username);
                ref.on('value', function(data) {
                    var key = Object.keys(data.val())[0];

                    var ref = database.ref(username + '/' + key + '/files/' + dir.replace(/-/g, "/") + filename);
                    ref.once('value', function(data) {
                        var files = [];
                        for (j = 0; j < Object.keys(data.val()).length; j++) {
                            // j altijd 0
                            var key = Object.keys(data.val())[j];
                            if (data.val()[key] != 'default.txt') {
                                var filename = data.val()[key];
                                if (typeof filename === 'object') {
                                    filename = key;
                                }
                                files.push(filename);
                            }
                        }
                        //console.log(filename);
                        //addDropdown(files, dir + filename);
                    });
                });
                //end data
            }
        }
    }
}


function addApps() {
    var ref = database.ref(username);
    ref.on('value', function(data) {
        var key = Object.keys(data.val())[0];
        var ref = database.ref(username + '/' + key + '/files');
        ref.once('value', function(data) {
            var files = [];
            for (i = 0; i < Object.keys(data.val()).length; i++) {
                var key = Object.keys(data.val())[i];
                if (data.val()[key] != 'default.txt') {
                    var filename = data.val()[key];
                    if (typeof filename === 'object') {
                        filename = key;
                    }
                    files.push(filename);
                }
            }
            addDropdown(files, '');
        });
    });
}

$('#loginButton').click(function() {
    addApps();
})

//os

$('#home').click(function() {
    //$('#homeDropUp').show();
    $('.ui.dropdown').dropdown();
});

/*
//browser popup
function getFile() {
    var d = createDiv('').parent(os);
    d.class('window ui-widget-content');
    var head = createDiv('Select file').parent(d).class('head');


}

*/




//notepad
$('#notepadlogo').click(function() {
    open_notepad();
});


function open_notepad(d_f_n = '', d_t_f = '', dir = '') {
    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    $('.window').css('z-index', '0');
    $(this).css('z-index', '1');
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="notepad.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Notepad').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });

    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    //top section


    var save = createButton('save');

    save.parent(d);

    save.class('sf');

    save.mouseClicked(function() {
        //check if filename has extension
        var fn_content = fn.value();

        var res = /\./g.test(fn_content);

        if (!res) {
            fn_content += '.txt';
        }

        var storageRef = storage.ref(username + '/os' + dir);
        var textFile = null;
        var value = t_f.value();


        var data = new Blob([value], {
            type: 'text/plain'
        });

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }


        //textFile = window.URL.createObjectURL(data);
        var uploadTask = storageRef.child(fn_content).put(data);
        var ref = database.ref(username);
        ref.once('value', function(data) {
            var key = Object.keys(data.val())[0];
            var files = data.val()[key].files;
            //dir.replace(/\./g, "_P").replace(' ', '_S')      todo
            database.ref(username + '/' + key + '/files' + dir + '/' + fn_content.replace(/\./g, "_P").replace(' ', '_S')).push(value);
            database.ref(username + '/' + key + '/file_loc/' + fn_content.replace(/\./g, "_P").replace(' ', '_S')).push(dir);
        });
    });

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

    createElement('br').parent(d);



    //body
    var body = createDiv('').parent(d).class('body');



    var fn = createInput('').attribute('value', d_f_n).parent(body).attribute('style', 'margin-left:5px;');

    createElement('br').parent(body);




    var t_f = createElement('textarea').html(d_t_f).parent(body);

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};




//file explorer
$('#explorerlogo').click(function() {
    open_explorer();
});




function ndir(ndir, dir) {
    var storageRef = storage.ref(username + '/os' + dir + '/' + ndir);
    var uploadTask = storageRef.child('default.txt').put(new Blob([''], {
        type: 'text/plain'
    }));
    var ref = database.ref(username);
    ref.once('value', function(data) {
        var key = Object.keys(data.val())[0];
        var files = data.val()[key].files;
        database.ref(username + '/' + key + '/files' + dir + '/' + ndir.replace(/\./g, "_P").replace(' ', '_S')).push('default.txt');
    });
}



function open_explorer(dir = '', wpos = '', size = '', icon = undefined) {

    //display / window

    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid).style('overflow', 'hidden');
    if (size != '') {
        d.size(size['width'], size['height']);
    }

    if (wpos == '') {
        var pos = (50 + (60 * icons)).toString() + 'px';
        icons++;
        //console.log((50 + (60 * icons)).toString() + 'px');
        var icon = createElement('task_icon').html('<img src="explorer.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    }
    $('.window').css('z-index', '0');
    $(this).css('z-index', '1');
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_e');

    if (wpos != '') {
        d.position(wpos['x'], wpos['y']);
    } else {
        d.position(200, 200);
    }

    var head = createDiv('File explorer').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });

    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    $('.ui-resizable-e,.ui-resizable-s').remove();

    //$('.head').css('position', 'fixed');

    //top section
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


    var n_f = createButton('new file');

    n_f.parent(body);

    n_f.class('n_f');

    n_f.mouseClicked(function() {
        console.log(dir);
        open_notepad('', '', dir)
    });



    var n_d = createButton('new dir');

    n_d.parent(body);

    n_d.mouseClicked(function() {
        var storageRef = storage.ref(username + '/' + dir);
        createDiv('<input type="text" onchange="ndir($(this).val(),&#39;' + dir + '&#39;); $(this).remove()" >').parent(d).class('file');
    });

    var import_file = createButton('Import file');

    import_file.parent(body);

    import_file.mouseClicked(function() {
            var win = createDiv('').parent(os);
            win.class('window ui-widget-content');
            $('.window').draggable();
            var win_head = createDiv('Import files').parent(win).class('head');
            var win_body = createDiv('').parent(win).class('body');
            createElement('input').attribute('type', 'file').id('file_selection').parent(win_body);
            $('#file_selection').change(function() {

                var file = $(this)[0].files[0];
                var reader = new FileReader();

                var storageRef = storage.ref(username + '/os' + dir);


                var data = file;


                //textFile = window.URL.createObjectURL(data);
                var uploadTask = storageRef.child(file.name).put(data);
                var ref = database.ref(username);
                ref.once('value', function(data) {
                    var key = Object.keys(data.val())[0];
                    var files = data.val()[key].files;
                    //dir.replace(/\./g, "_P").replace(' ', '_S')      todo
                    reader.addEventListener("load", function () {
                      value = reader.result;
                      database.ref(username + '/' + key + '/files' + dir + '/' + file.name.replace(/\./g, "_P").replace(' ', '_S')).push(value);
                    }, false);

                    if (file) {
                      reader.readAsDataURL(file);
                    }
                    database.ref(username + '/' + key + '/file_loc/' + file.name.replace(/\./g, "_P").replace(' ', '_S')).push(dir);
                });
                win.remove();

            });
            var dropdiv = createDiv('Or drop files here').attribute('style', 'height:200px; width:200px; border:solid black 1px').parent(win_body);
            dropdiv.drop(gotFile);

            function gotFile(file) {
              console.log(file);
                var storageRef = storage.ref(username + '/os' + dir);
                var textFile = null;
                var value = file.data;
            var data = file.file;
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }


            //textFile = window.URL.createObjectURL(data);
            var uploadTask = storageRef.child(file.name).put(data);
            var ref = database.ref(username);
            ref.once('value', function(data) {
                var key = Object.keys(data.val())[0];
                var files = data.val()[key].files;
                //dir.replace(/\./g, "_P").replace(' ', '_S')      todo
                database.ref(username + '/' + key + '/files' + dir + '/' + file.name.replace(/\./g, "_P").replace(' ', '_S')).push(value);
                database.ref(username + '/' + key + '/file_loc/' + file.name.replace(/\./g, "_P").replace(' ', '_S')).push(dir);
            });
            win.remove();
            return false;

        }

    });




    createElement('br').parent(body);



    var n_d = createButton('< back');

    n_d.parent(body);

    n_d.mouseClicked(function() {

        if (dir != '') {



            var exec = /\/[^/]*$/.exec(dir).toString();

            open_explorer(dir.replace(exec, ''), d.position(), d.size(), icon);
            d.remove();

        }

    });
    n_d.attribute('style', 'margin-top: 3px;');



    createElement('br').parent(body);



    var dyn_body = createDiv('').parent(body);
    var files = [];
    var ref = database.ref(username);
    ref.on('value', function(data) {
        var key = Object.keys(data.val())[0];
        var ref = database.ref(username + '/' + key + '/files' + dir);
        ref.once('value', function(data) {
            dyn_body.html('');
            for (i = 0; i < Object.keys(data.val()).length; i++) {
                var key = Object.keys(data.val())[i];
                if (data.val()[key] != 'default.txt') {
                    var filename = data.val()[key];
                    files = [];
                    if (typeof filename === 'object') {
                        filename = key;
                    }
                    filename = filename.replace(/\_P/g, ".").replace('_S', ' ');
                    var ext = filename.split('.').pop();
                    if (ext == filename) {
                        ext = '';
                    }
                    switch (ext.toLowerCase()) {
                        case 'txt':
                            var file = createDiv('<i style="font-size: 30px;" class="file text outline icon"></i><br><span>' + filename + '</span>').parent(dyn_body).class('file');
                            break;
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                            var file = createDiv('<i style="font-size: 30px;" class="file image outline icon"></i><br><span>' + filename + '</span>').parent(dyn_body).class('file');
                            break;
                        case 'mp4':
                        case 'avi':
                        case 'mov':
                        case 'webm':
                        case 'wmv':
                        case 'ogg':
                        case 'mpeg':
                            var file = createDiv('<i style="font-size: 30px;" class="file video outline icon"></i><br><span>' + filename + '</span>').parent(dyn_body).class('file');
                            break;
                        case '':
                            var file = createDiv('<i style="font-size: 30px;" class="folder open outline icon"></i><br><span>' + filename + '</span>').parent(dyn_body).class('file');
                            break;
                        default:
                            var file = createDiv('<i style="font-size: 30px;" class="file outline icon"></i><br><span>' + filename + '</span>').parent(dyn_body).class('file');
                    }
                    files.push(file);

                }
            }
        });
        $('.file').click(function() {
            $('.file').removeClass('selected');
            $(this).addClass('selected');
        });
        $('.file').contextmenu(function(evt) {

            $('.ui.dropdown#file_opt').dropdown({
                transition: 'fade'
            });
            var pref = select('#file_opt');
            pref.position(evt.pageX + 5, evt.pageY + 5);
            var name = '';
            if ($(this).attr('class') == 'file') {
                console.log(username + '/os' + dir + '/' + $(this).children('span').html());
                name = $(this).children('span').html();
                var ref = storage.ref(username + '/os' + dir + '/' + $(this).children('span').html());
            } else {
                console.log(username + '/os' + dir + '/' + $(this).parent('div.file').children('span').html());
                name = $(this).parent('div.file').children('span').html();
                var ref = storage.ref(username + '/os' + dir + '/' + $(this).parent('div.file').children('span').html());
            }

            ref.getDownloadURL().then(function(url) {
                $('#download_file>a').attr('href', url);
            });
            $('#del_file').click(function() {

                var ref = storage.ref(username + '/os' + dir + '/' + name);
                ref.delete();
                console.log(name.replace(/\./g, "_P").replace(' ', '_S'));
                var ref1 = database.ref(username + '/' + user_key + '/files' + dir + '/' + name.replace(/\./g, "_P").replace(' ', '_S'));
                ref1.remove();
                database.ref(username + '/' + user_key + '/file_loc' + dir + '/' + name.replace(/\./g, "_P").replace(' ', '_S')).remove();

            });
            $('#file_opt>.text').click();
            evt.preventDefault();
            evt.stopPropagation();
        });
        $('.file').dblclick(function() {
            $('.file').removeClass('selected');
            var name = $(this).children('span').html();
            if (name != undefined) {
                if (name != name.split('.').pop()) {
                  ext = name.split('.').pop().toLowerCase();
                    name = name.replace(/\./g, "_P").replace(' ', '_S');
                        var file_ref = database.ref(username + '/' + user_key + '/files' + dir + '/' + name);
                        file_ref.once('value', function(data) {
                            var data = data.val();
                            var file_key = Object.keys(data)[Object.keys(data).length - 1];
                            var file = data[file_key];
                            switch (ext) {
                              case 'png':
                              case 'jpg':
                              case 'jpeg':
                              case 'gif':
                                console.log(name);
                                  open_img_viewer(name,dir);
                                  break;
                              case 'mp4':
                              case 'avi':
                              case 'mov':
                              case 'webm':
                              case 'wmv':
                              case 'ogg':
                              case 'mpeg':
                                  alert('todo!');
                                  break;
                              default:
                                open_notepad(name.replace(/\_P/g, '.').replace('_S', ' '), file, dir);
                            }

                        });

                    //var file =
                    //console.log(file);
                    //open_notepad(name, 'test');
                    ////var fileRef = storage.ref(username + '/os').child(name);
                    ////fileRef.getDownloadURL().then(function(url) {
                    // Once we have the download URL, we set it to our img element
                    ////    createA(url, 'View file').parent(d);

                    ////  });
                } else {
                    open_explorer('/' + name.replace(' ', '_S').replace(/\./g, '_P'), d.position(), d.size(), icon);
                    d.remove();

                }
            }
        });
        //for(i=0es[i]).parent(d);
        //}
    });
    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};





// photo viewer
$('#imglogo').click(function() {
    open_img_viewer();
});


function open_img_viewer(filename, dir = '') {
    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    $('.window').css('z-index', '0');
    $(this).css('z-index', '1');
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="photov.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Photo viewer').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });

    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    //top section

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
    if(filename){
    var ref = database.ref(username+'/'+user_key+'/files'+dir+'/'+filename);
    var photo;
    ref.once('value',function(data){
      data = data.val();
      var key = Object.keys(data)[Object.keys(data).length-1];
      //createDiv('<figure style="width: intrinsic;"><img style="width:50%; height:50%; margin:0px" src="'+data[key]+'" /></figure>').parent(body);
      photo = createDiv('<img style="max-height:'+(d.size()['height']-29)+'px; max-width:'+(d.size()['width']-2)+'px;" src="'+data[key]+'" />').parent(body);
      //                                                            margin left = (body width - img width)/2
      //                                                            margin top =  (body height - img height)/2
      //console.log(((d.size()['height']-18-photo.child()[0].height)/2)-5.5);
      var width = (body.size()['width']-photo.child()[0].width)/2;
      var height = ((d.size()['height']-18-photo.child()[0].height)/2)-5.5;
      photo.child()[0].style.cssText += 'margin-left:'+width+'px; margin-top:'+height+'px;';
      //photo.child()[0].style((d.size()['width']-photo.child()[0].width)/2);

    });
  }else{
    createP('No file opened').parent(body).attribute('style','margin-left:25%; margin-top: 35%;');
  }

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
            var width = (ui.size.width-12-photo.child()[0].width)/2;
            var height = ((ui.size.height-18-photo.child()[0].height)/2)-5.5;
            photo.child()[0].style.cssText += 'margin-left:'+width+'px; margin-top:'+height+'px;';
            photo.child()[0].style.marginTop = height+'px;';
        },
        autoHide: true
    });

};




//word                  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!not used!!!!
$('#wordlogo').click(function() {
    open_word();
});


function open_word(d_f_n = '', d_t_f = '', dir = 'os') {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="word.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Word').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });


    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    //top section




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

    createElement('br').parent(d);



    //body
    var body = createDiv('').parent(d).class('body');

    var save = createButton('save');

    save.parent(body);

    save.class('sf');

    save.mouseClicked(function() {
        //check if filename has extension
        var fn_contentt = fn.value();
        var patt = new RegExp("[a-zA-Z]+\.[a-zA-Z]{3}([a-zA-Z])?");
        var res = patt.test(fn_content);
        if (!res) {
            fn_content += '.txt';
        }

        var storageRef = storage.ref(username + '/' + dir);
        var textFile = null;
        var value = CKEDITOR.instances[t_f.id()].getData();

        var data = new Blob([value], {
            type: 'text/plain'
        });

        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }


        //textFile = window.URL.createObjectURL(data);
        var uploadTask = storageRef.child('/' + fn_content).put(data);
        var ref = database.ref(username);
        ref.once('value', function(data) {
            var key = Object.keys(data.val())[0];
            var files = data.val()[key].files;
            database.ref(username + '/' + key + '/files').push(fn_content);
        });
    });

    var fn = createInput('').attribute('value', d_f_n).parent(body).attribute('style', 'margin-left:5px;');

    createElement('br').parent(d);




    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var t_f = createElement('textarea').html(d_t_f).parent(body).id(uid);
    var editor = CKEDITOR.replace(uid);

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);

        },
        autoHide: true
    });

};






//browser
$('#browserlogo').click(function() {
    open_browser();
});


function open_browser(url = 'http://p5.comxa.com', dir = 'os') {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="browser.ico" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Browser').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });

    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });

    //top section



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

    createElement('br').parent(d);



    //body
    var body = createDiv('').parent(d).class('body');

    var id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    var searchbox = createElement('input').attribute('type', 'text').style('width', '79%').style('display', 'inline').attribute('onchange', '$("#' + id + '").attr("src",$(this).val());$(this).val("")').parent(body);
    var search = createButton('Search').style('display', 'inline').style('width', '20%').parent(body);

    createElement('br').parent(body);
    var frame = createElement('iframe').attribute('src', url).id(id).parent(body);



    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};



//settings
$('#settingslogo').click(function() {
    open_settings();
});


function open_settings(dir = 'os') {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="settings.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);

    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Settings').parent(d).class('head');

    $(".window").draggable({
        handle: '.head'
    });


    $('.window').click(function() {
        $('.window').css('z-index', '0');
        $(this).css('z-index', '1');
    });


    //top section


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

    createElement('br').parent(d);



    //body
    var body = createDiv('').parent(d).class('body');

    var pers = createImg('personalize_setting.png').parent(body).class('setting');
    pers.position(50, 34).style('cursor', 'pointer');
    pers.mouseClicked(function() {
        var repeat = 'off';
        var repeatx = 'off';
        var repeaty = 'off';
        if (settings['background-repeat']) {
            var repeat = 'on';
            if (settings['background-repeat-x']) {
                var repeatx = 'on';
            }
            if (settings['background-repeat-y']) {
                var repeaty = 'on';
            }
        }
        body.html('<div class="ui top attached tabular menu pers_tabs">\
        <a class = "item active"  data-tab = "first"> Background </a> \
        <a class = "item"  data-tab = "second"> Second </a> \
        <a class = "item"  data-tab = "third"> Third </a> </div>\
        <div class = "ui bottom attached tab segment active" data-tab = "first">Repeat background: \
        <i style="font-size: 1.4em;" id ="repeat" class="toggle ' + repeat + ' icon"> </i> <br>\
        &nbsp;&nbsp;&nbsp;&nbsp;Repeat background x: <i style="font-size: 1.4em;" id ="repeatx" class="toggle ' + repeatx + ' icon"> </i><br>\
        &nbsp;&nbsp;&nbsp;&nbsp;Repeat background y: <i style="font-size: 1.4em;" id ="repeaty" class="toggle ' + repeaty + ' icon"> </i><br>\
        Background size: <select id="size">\
        <option>Fit width and height</option>\
        <option>Fit width</option>\
        <option>Fit height</option>\
        <option>Default size</option>\
        </select>  \
        or choose specific size here: <br> width: <input id="swidth" type="number" style="width:55px"><select id="sws">\
        <option>px</option>\
        <option>%</option>\
        </select> \
        height: <input id="sheight" type="number" style="width:55px"><select id="shs">\
        <option>px</option>\
        <option>%</option>\
        </select> <button id="ssize">ok</button>\
        </div> \
        <div class = "ui bottom attached tab segment" data-tab = "second">Second </div> \
        <div class = "ui bottom attached tab segment" data-tab = "third">Third </div>');
        $('.pers_tabs .item').tab();
        $('.toggle#repeat').click(function() {
            $('.toggle#repeat').toggleClass('on').toggleClass('off');
            if ($('.toggle#repeat').hasClass('on')) {
                $('.toggle').removeClass('off').addClass('on');
            } else {
                $('.toggle').removeClass('on').addClass('off');
            }
            database.ref(username + '/' + user_key + '/settings/background-repeat').set($('.toggle#repeat').hasClass('on'));
            if ($('.toggle#repeat').hasClass('on')) {
                $('#os').css('background-repeat', 'repeat');
            } else {
                $('#os').css('background-repeat', 'no-repeat');
            }
        });
        $('.toggle#repeatx').click(function() {
            if ($('.toggle#repeat').hasClass('on')) {
                $('.toggle#repeatx').toggleClass('on').toggleClass('off');
                database.ref(username + '/' + user_key + '/settings/background-repeat-x').set($('.toggle#repeatx').hasClass('on'));
                if ($('.toggle#repeatx').hasClass('on')) {
                    $('#os').css('background-repeat', 'repeat-x');
                    if ($('.toggle#repeaty').hasClass('on')) {
                        $('#os').css('background-repeat', 'repeat');
                    }
                } else {
                    if ($('.toggle#repeaty').hasClass('on')) {
                        $('#os').css('background-repeat', 'repeat-y');
                    } else {
                        $('.toggle#repeat').click();
                    }
                }
            }
        });
        $('.toggle#repeaty').click(function() {
            if ($('.toggle#repeat').hasClass('on')) {
                $('.toggle#repeaty').toggleClass('on').toggleClass('off');
                database.ref(username + '/' + user_key + '/settings/background-repeat-y').set($('.toggle#repeaty').hasClass('on'));
                if ($('.toggle#repeaty').hasClass('on')) {
                    $('#os').css('background-repeat', 'repeat-y');
                    if ($('.toggle#repeatx').hasClass('on')) {
                        $('#os').css('background-repeat', 'repeat');
                    }
                } else {
                    if ($('.toggle#repeatx').hasClass('on')) {
                        $('#os').css('background-repeat', 'repeat-x');
                    } else {
                        $('.toggle#repeat').click();
                    }
                }
            }
        });

        //size
        $('select#size').change(function() {
            var ref = database.ref(username + '/' + user_key + '/settings/background-size');
            switch ($(this).val()) {
                case 'Fit width':
                    ref.set('cover');
                    $('#os').css('background-size', 'cover');
                    break;
                case 'Fit height':
                    ref.set('contain');
                    $('#os').css('background-size', 'contain');
                    break;
                case 'Fit width and height':
                    ref.set('100% 100%');
                    $('#os').css('background-size', '100% 100%');
                    break;
                case 'Default size':
                    ref.set('auto');
                    $('#os').css('background-size', 'auto');
                    break;
            }
        });

        //specific size
        $('button#ssize').click(function() {
            var sw = $('#swidth').val();
            var sh = $('#sheight').val();
            var sws = $('#sws').val();
            var shs = $('#shs').val();
            var ref = database.ref(username + '/' + user_key + '/settings/background-size');
            ref.set(sw + sws + ' ' + sh + shs);
            $('#os').css('background-size', sw + sws + ' ' + sh + shs);
        });
    });

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};


//app
$('#storelogo').click(function() {
    open_store();
});

//    other args
function open_store() {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="appstore.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('WebOS store').parent(d).class('head');

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

    createElement('br').parent(d);



    //body
    var body = createDiv('').parent(d).class('body');

    database.ref('store').on('value', function(data) {
        data = data.val();
        for (i = 0; i < Object.keys(data).length; i++) {
            createDiv(Object.keys(data)[i]).parent(d);
        }
        /*
        photo
        film
        music
        text
        */
    });

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};

$('#calclogo').click(function() {
    open_calc();
});


function open_calc() {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="calc_wit.png" style="width: 24px; height: 35px; margin-top: 2px" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });
    d.size(200, 300);

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Calculator').parent(d).class('head');

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
    var done = false;

    var out = createDiv('<span id="outputtext"></span>').parent(body).id('output');
    var buttons = {
        1: createButton('1').class('calcbut num').parent(body),
        2: createButton('2').class('calcbut num').parent(body),
        3: createButton('3').class('calcbut num').parent(body),
        4: createButton('4').class('calcbut num').parent(body),
        5: createButton('5').class('calcbut num').parent(body),
        6: createButton('6').class('calcbut num').parent(body),
        7: createButton('7').class('calcbut num').parent(body),
        8: createButton('8').class('calcbut num').parent(body),
        9: createButton('9').class('calcbut num').parent(body),
        0: createButton('0').class('calcbut num').parent(body),
        plus: createButton('+').class('calcbut operator').parent(body).style('top', '71px').style('left', '160px'),
        minus: createButton('-').class('calcbut operator').parent(body).style('top', '101px').style('left', '160px'),
        times: createButton('&times;').class('calcbut operator').parent(body).style('top', '131px').style('left', '160px'),
        divide: createButton('&divide;').class('calcbut operator').parent(body).style('top', '161px').style('left', '160px'),
        equal: createButton('=').class('calcbut operator equal').parent(body).style('top', '191px').style('left', '160px'),
        clear: createButton('ce').class('calcbut operator').parent(body).style('width', '80px').style('left', '60px')
    }
    $('#' + uid + ' .calcbut.num').click(function() {
      if(done){
        $('#' + uid + ' #outputtext').html('');
        done = false;
      }
        $('#' + uid + ' #outputtext').append($(this).html());
    });

    $('#' + uid + ' .calcbut.ce').click(function() {
        $('#' + uid + ' #outputtext').html('');
    });

    $('#' + uid + ' .calcbut.operator').click(function() {
        var text = $('#' + uid + ' #outputtext');
        switch ($(this).html()) {
            case '+':
                text.append('+');
                break;
            case '-':
                text.append('-');
                break;
            case '×':
                text.append('*');
                break;
            case '÷':
                text.append('/');
                break;
            case '=':
                text.html(eval(text.html()));
                done = true;
                break;
            case 'ce':
                text.html('');
                break;
        }
    });

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};

$('#gamelogo').click(function() {
    open_game();
});


function open_game() {

    //display / window
    var uid = 'a' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    var d = createDiv('').parent(os).id(uid);

    var pos = (50 + (60 * icons)).toString() + 'px';
    icons++;
    //console.log((50 + (60 * icons)).toString() + 'px');
    var icon = createElement('task_icon').html('<img src="games.png" />').parent(taskbar).class('task_icon').style('margin-left', pos);
    icon.mouseClicked(function() {
        $('#' + uid).transition('slide up');
    });

    d.class('window ui-widget-content d_np');

    d.position(200, 200);

    var head = createDiv('Game').parent(d).class('head');

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

    createImg('https://blogs.windows.com/devices/wp-content/uploads/sites/43/2011/11/Snake-game.jpg').parent(body).size(75, 75).style('cursor', 'pointer').style('margin-left', '10px');
    createImg('http://members.chello.nl/~nej.tromp/doolhof.gif').parent(body).size(100, 75).style('cursor', 'pointer').style('margin-left', '10px');

    $(".window").resizable({
        resize: function(event, ui) {
            body.size(ui.size.width - 12, ui.size.height - 76);
        },
        autoHide: true
    });

};


var clicked = false;

$("#searchapps").focus(
    function() {
        if (!clicked) {
            $("#searchapps").blur();
        }
    });

$("#searchapps").click(
    function() {
        clicked = true;
        $('#home_drop>.item').hide();
        for (i = 0; i < Object.keys(all_files).length; i++) {
            var item = Object.keys(all_files)[i].replace(/\_P/g, '.');
            $('#home_drop').prepend('<div class="item appendend">' + item + '</div>');
        }
    });


$("#searchapps").focusout(
    function() {
        clicked = false;
        $('#home_drop>.item.appendend').remove();
        $('#home_drop>.item').show();
    });
