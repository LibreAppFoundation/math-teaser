var initialLimit = 10;
var initialErrorLimit = 1;
var maximumErrorLimit = 20;
var maximumNumberLimit = 30;
var operators = ['+', '-', '*', '/'];
var levelBounds = [5, 10, 15, 20];
var maxLevel = 4;

var answerStatus = false;
var duration = 10;
var limit = 10;
var errorLimit = 1;
var timeId;
var score;
var level = 1;

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
  $("#welcome, #play, #levelup").hide();
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

function chooseOperator() {
  var ops = operators.slice(0, level);
  var index = getRandomInt(score) % level;
  return ops[index];
}

function evaluateExpression(op1, op2, optr) {
  switch(optr) {
    case '+' : return op1 + op2;
    case '-' : return op1 - op2;
    case '*' : return op1 * op2;
    case '/' : return Math.ceil(op1 / op2);
  }
}

function displayExpression(op1, op2, optr, answer) {
  $("#op1").text(op1);
  $("#op2").text(op2);
  $("#optr").text(optr);
  $("#answer").text(answer);
  $("#time").text(duration);
}

function updateExpression() {
  updateAnswerStatus();

  var op1 = getRandomInt(limit);
  var op2 = getRandomInt(limit);

  // Don't bring negative
  if (op1 < op2) {
    var temp = op1;
    op1 = op2;
    op2 = temp;
  }

  var operator = chooseOperator();
  var answer = evaluateExpression(op1, op2, operator);

  // Make answer correct
  if(operator == "/") {
    op1 = answer * op2;
  }
  
  if (!answerStatus) {
    var error = Math.ceil(getRandomInt(errorLimit) * answer / 100);
    error = error == 0 ? getRandomInt(level) : error;
    if(getRandomBool())
      answer += error;
    else
      answer -= error;
  }

  displayExpression(op1, op2, operator, answer);
  timeId = window.setTimeout(updateTime, 1000);
}

function updateScore() {
  score++;
  $("#score").text(score);

  if(level < maxLevel && score == levelBounds[level - 1]) {
    level++;
    showLevelUp();
  }
  $("#level").text(level);
}

function updateLimits() {
  
  if(errorLimit < maximumErrorLimit) {
    errorLimit++;
  }

  if (limit < maximumNumberLimit) {
    limit++;
  }
}

function checkAnswer($this) {
  var answer = $(this).val() == 'true' ? true : false;
  if (Boolean(answer) == answerStatus) {
    window.clearTimeout(timeId);
    updateScore();
    updateLimits();
    updateExpression();
  } else {
    showGameOver();
  }
}

function resetValues() {
  score = 0;
  level = 1;
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

function hideLevelUp() {
  $("#levelup").hide();
  $("#play").show();
}

function showLevelUp() {
  $("#play").hide();
  $("#levelup-level").text(level);
  $("#levelup").fadeIn(1000);
  setTimeout(hideLevelUp, 2000);
}

$(document).ready(function() {
  $("#option-true, #option-false").on("click", checkAnswer);
  $(".start").on("click", startGame);
  $("#about").on("click", openAbout);
  $("#close").on("click", closeAbout);
});