/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */


/*var getScore = function(){

    'use strict';

    $('#scoreDisplayId').show();
    var url = 'score';
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/' + url,
        crossDomain: true,
        dataType: 'json'
    }).done(function(msg) {
        if (msg.answer === false) {
            msg.answer = 'false';
        }
        console.log(msg);
        $('#rightId').val(msg.right);
        $('#wrongId').val(msg.wrong);
    });
};
*/
var postQuestion = function(){

    'use strict';

    var url = 'question';
    var question = $('#questionId').val();
    var answer = $('#answerId').val();
    var data = {
        'question': question,
        'answer': answer
    };
    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/' + url,
        crossDomain: true,
        dataType: 'json',
        data: data
    }).done(function(msg) {
        if (msg.answer === false) {
            msg.answer = 'false';
        }
        $('#displayQueId').show();
        $('#addQueBtnId').show();
        $('#addQueDivId').hide();
        $('#userNameId').hide();
        alert(msg.message);
        $('#questionId').val('');
        $('#ansId').val('');
    });
};

var playGame = function(){

    'use strict';

    var url = 'question';
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/' + url,
        crossDomain: true,
        dataType: 'json',
    }).done(function(msg) {
        if (msg.answer === false) {
            msg.answer = 'false';
        }
        $('#allQueId').show();
        $('#scoreBtnId').show();
        $('#addQueBtnId').show();
        $('#addQueDivId').hide();
        $('#playBtnDivId').hide();
        $('#displayQueId').show();
        $('#onlineUser').show();
    });
};

var main = function(){
    'use strict';

    var socket = io(),
        userName;

    console.log('At client side');
    $('#scoreDivId').hide();
    $('#displayQueId').hide();
    $('#onlineUser').hide();

    $('#playBtnId').on('click', function(){
        console.log('Playing game...');
        $('#scoreDivId').show();
        userName = $('#userNameId').val();
        $('#currentUserId').val(userName);
        console.log('Current user: '+userName);
        playGame();
        socket.emit('play', userName);
    });

    socket.on('play', function(name){
        var item;
        $('#userName').text('Hi...!! '+name);
        //for(var i=0; i<name.length; i++){
       // $('#onlineUser').append(userName);
        item = $('<textarea readonly="true" class="ui label" id="'+name+'">').text(name);
        $('#onlineUser').append(item);
    });

    socket.on('newQue', function(question){
        $('#queId').val(question.question);
        $('#askedQueId').val(question._id);
        $('#askedQueAns').val(question.answer);
        $('#'+userName).css('color','black');
    });

    $('#sendBtnId').on('click', function(){
        console.log($('#ansId').val());
        console.log('Question ::::: ',$('#askedQueId').val());
        socket.emit('score', { questionId : $('#askedQueId').val(),
                                 givenAns : $('#ansId').val(), 
                                    actualAns : $('#askedQueAns').val()});
    });

    $('#nextBtnId').on('click', function(){
        $('#ansId').val('');
        playGame();
    });

    socket.on('score', function(data){
        $('#rightAns').val(data.right);
        $('#wrongAns').val(data.wrong);
        console.log($('#currentUserId').val());
        if(data.flag === 1){
            if($('#currentUserId').val() === $('#'+userName+'').text()) {
                $('#'+userName+'').css('color','#33D166');
            }
        }
        if(data.flag === 0){
            if($('#currentUserId').val() === $('#'+userName+'').text()) {
                $('#'+userName+'').css('color','#F1492A');
        }
        }
    });
    

    $('#addQueBtnId').on('click', function() {
        $('#addQueDivId').show();
        $('#displayQueId').hide();
        $('#addQueBtnId').hide();
        $('#playBtnId').hide();
        $('#userNameId').hide();
        $('#answerId').val('');
    });

    $('#submitBtnId').on('click' ,function(){
        postQuestion();

    });
};

$(document).ready(main);