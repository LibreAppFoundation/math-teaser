var initialLimit = 10;
var initialErrorLimit = 1;

var answerStatus = false;
var duration = 10;
var limit = 10;
var errorLimit = 1;
var timeId;
var score;

function getRandomInt(max) {
  min = 1
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomBool() {
  return getRandomInt(10) % 2 == 0;
}

function updateAnswerStatus() {
  answerStatus = getRandomBool();
}

function showGameOver() {
  $("#welcome, #play").hide();
  $("#final-score").text(score);
  $("#gameover").show();
}

function updateTime() {
  var time = $("#time").text();

  if (time > 0) {
    time--;
    $("#time").text(time);
    timeId = window.setTimeout(updateTime, 1000);
  } else {
    // updateExpression();
    showGameOver();
  }
}

function displayExpression(op1, op2, answer) {
  $("#op1").text(op1);
  $("#op2").text(op2);
  $("#answer").text(answer);
  $("#time").text(duration);
}

function updateExpression() {
  updateAnswerStatus();

  var op1 = getRandomInt(limit);
  var op2 = getRandomInt(limit);
  var answer = op1 + op2;

  if (!answerStatus) {
    var error = getRandomInt(errorLimit);
    if(getRandomBool())
      answer += error;
    else
      answer -= error;
  }

  displayExpression(op1, op2, answer);
  timeId = window.setTimeout(updateTime, 1000);
}

function updateScore() {
  score++;
  $("#score").text(score);
}

function updateLimits() {
  limit++;
  errorLimit++;
}

function checkAnswer($this) {
  var answer = $(this).val() == 'true' ? true : false;
  if (Boolean(answer) == answerStatus) {
    updateScore();
    window.clearTimeout(timeId);
    updateLimits();
    updateExpression();
  } else {
    showGameOver();
  }
}

function resetValues() {
  score = 0;
  limit = initialLimit;
  errorLimit = initialErrorLimit;
}

function startGame() {
  resetValues();
  $("#welcome, #gameover").hide();
  $("#play").show();
  if (timeId != undefined) {
    window.clearTimeout(timeId);
  }
  $("#score").text(score);
  updateExpression();
}

function closeAbout() {
  var popupWindow = $("#popup-message-window");
  popupWindow.attr("style", "z-index: -1; opacity: 0");
}

function openAbout() {
  var popupWindow = $("#popup-message-window");
  popupWindow.attr("style", "z-index: 1050; opacity: 1");
}


$(document).ready(function() {
  $("#option-true, #option-false").on("click", checkAnswer);
  $(".start").on("click", startGame);
  $("#about").on("click", openAbout);
  $("#close").on("click", closeAbout);
});