var socket = io(),
    userName;


function triviaViewModel() {

    var self = this;

    self.right = ko.obeservable();
    self.wrong = ko.observable();
    self.question = ko.observable();
    self.answer = ko.observable();
    self.displayQueId = ko.observable();
    self.addQueBtnId = ko.observable();
    self.addQueDivId = ko.observable();
    self.userNameId = ko.observable();
    self.allQueId = ko.observable();
    self.scoreBtnId = ko.observable();
    self.playBtnDivId = ko.observable();
    self.onlineUser = ko.observable();

    self.getScore = function() {

        $("#scoreDisplayId").show();
        var url = "score";
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/" + url,
            crossDomain: true,
            dataType: "json"
        }).done(function(msg) {
            if (msg.answer === false) {
                msg.answer = "false";
            }
            self.right(msg.right);
            self.worng(msg.wrong);
        });
    }

    self.postQuestion = function() {

        var url = "question";
        var data = {
            "question": self.question,
            "answer": self.answer
        };
        var dataJSON = JSON.stringify(data);
        console.log(dataJSON);
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/" + url,
            crossDomain: true,
            dataType: "json",
            data: data
        }).done(function(msg) {
            if (msg.answer === false) {
                msg.answer = "false";
            }
            self.displayQueId(true);
            self.addQueBtnId(true);
            self.addQueDivId(false);
            self.userNameId(false);
            self.question(null);
            self.answer(null);
        });
    };

    self.playGame = function() {

        var url = "question";
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/" + url,
            crossDomain: true,
            dataType: "json",
        }).done(function(msg) {
            if (msg.answer === false) {
                msg.answer = "false";
            }

            self.allQueId(true);
            self.scoreBtnId(true);
            self.addQueBtnId(true);
            self.addQueDivId(false);
            self.playBtnDivId(false);
            self.displayQueId(true);
            self.onlineUser(true);
        });
    };
    
    self.addQueBtnIdEvent=function(){
        self.addQueDivId(true);
        self.displayQueId(false);
        self.addQueBtnId(false);
        self.playBtnId(false);
        self.userNameId(false);
        seld.answer(null);
    }
    

    self.main = function() {

        self.scoreDivId = false;
        self.displayQueId = false;
        self.onlineUser = false;


    }

    self.startGame = function() {
        console.log("Playing game...");
        self.scoreDivId = true;
        self.userName = self.userNameId;
        self.currentUserId = self.userName;

        console.log("Current user: " + self.userName);
        self.playGame();
        socket.emit('play', self.userName);
    }


    socket.on('newQue', function(question) {
        self.queId = question.question;
        self.askedQueId = question._id;
        self.askedQueAns = question.answer;
        $('#' + userName).css("color", "black");
    });

    self.sendBtnEvent = function() {
        console.log($('#ansId').val());
        console.log("Question ::::: ", $('#askedQueId').val());
        socket.emit('score', {
            questionId: $('#askedQueId').val(),
            givenAns: $('#ansId').val(),
            actualAns: $('#askedQueAns').val()
        });
    }

}
ko.applyBindings(new triviaViewModel());


socket.on('play', function(name) {
        var item;
        //for(var i=0; i<name.length; i++){
        // $('#onlineUser').append(userName);
        item = $('<textarea readonly="true" class="ui label" id="' + name + '">').text(name);
        $('#onlineUser').append(item);
});


    socket.on('score', function(data) {
        $('#rightAns').val(data.right);
        $('#wrongAns').val(data.wrong);
        console.log($('#currentUserId').val());
        if (data.flag == 1) {
            if ($('#currentUserId').val() == $('#' + userName + '').text()) {
                $('#' + userName + '').css("color", "#33D166");
            }
        }
        if (data.flag == 0) {
            if ($('#currentUserId').val() == $('#' + userName + '').text()) {
                $('#' + userName + '').css("color", "#F1492A");
            }
        }
    });
$(document).ready(main);