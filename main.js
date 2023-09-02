// selectors
let questionsCount = document.querySelector(".ques-count span");
let questionsSection = document.querySelector(".ques-section");
let submitButton = document.querySelector(".submit");
let footer = document.querySelector(".footer");
let bullets = document.querySelector(".bullets");
let timer = document.querySelector(".timer span");
let result = document.querySelector(".result");
let level = document.querySelector(".level");
let rightAnswers = document.querySelector(".right-ans");
let totalQuestions = document.querySelector(".total-ques");

// settings

let currentIndex = 0;
let rightAnswersCounter = 0;
let countdown;

// fetch data
function getData() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let data = JSON.parse(this.responseText);

      let totalQuestionsNum = data.length;

      questionsCount.innerHTML = totalQuestionsNum;

      createBullets(totalQuestionsNum);

      addQuestion(data[currentIndex]);

      setCounter(totalQuestionsNum, 3);

      submitButton.addEventListener("click", () => {
        if (currentIndex + 1 === totalQuestionsNum) {
          showResult(totalQuestionsNum);
        } else {
          let rightAnswer = data[currentIndex]["right_answer"];

          checkAnswer(rightAnswer);
          currentIndex++;

          addQuestion(data[currentIndex]);

          handelBullets();

          clearInterval(countdown);
          setCounter(totalQuestionsNum, 3);
        }
      });
    }
  };
  req.open("GET", "/QuizApplication/data.json", true);
  req.send();
}

getData();

function createBullets(totalQuestionsNum) {
  for (let i = 0; i < totalQuestionsNum; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.classList.add("active");
    }
    bullets.appendChild(span);
  }
}

function handelBullets() {
  let spans = Array.from(document.querySelectorAll(".bullets span"));

  spans.forEach((span, index) => {
    if (index <= currentIndex) {
      span.className = "active";
    }
  });
}

function addQuestion(ques) {
  questionsSection.innerHTML = "";
  let h2 = document.createElement("h2");
  let txt = document.createTextNode(ques.title);
  h2.append(txt);

  let ul = document.createElement("ul");

  for (let i = 1; i <= 4; i++) {
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.name = "answer";
    input.id = `ans${i}`;
    input.type = "radio";
    input.dataset.ans = ques[`answer_${i}`];

    let label = document.createElement("label");
    label.htmlFor = `ans${i}`;
    let txt = document.createTextNode(ques[`answer_${i}`]);
    label.append(txt);

    li.append(input, label);
    ul.append(li);
  }
  questionsSection.append(h2, ul);
}

function checkAnswer(rightAnswer) {
  let answers = Array.from(document.querySelectorAll("input"));
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.ans;
    }
  }

  if (theChoosenAnswer === rightAnswer) {
    rightAnswersCounter++;
  }
}

function setCounter(totalQuestionsNum, duration) {
  if (currentIndex < totalQuestionsNum) {
    let minutes = duration - 1;
    let seconds = 59;
    countdown = setInterval(() => {
      seconds--;
      timer.innerHTML = `${minutes >= 10 ? minutes : `0${minutes}`}:${
        seconds >= 10 ? seconds : `0${seconds}`
      }`;
      if (minutes == "0" && seconds == "0") {
        clearInterval(countdown);
        submitButton.click();
      }
      if (seconds === 0) {
        seconds = 59;
        minutes--;
      }
    }, 1000);
  }
}

function showResult(totalQuestionsNum) {
  result.style.display = "block";
  questionsSection.remove();
  submitButton.remove();
  footer.remove();
  level.innerHTML =
    rightAnswersCounter >= parseInt(totalQuestionsNum / 2) ? "good" : "bad";
  if (level.innerHTML === "good") {
    level.classList.add("good");
  } else {
    level.classList.add("bad");
  }
  rightAnswers.innerHTML = rightAnswersCounter;
  totalQuestions.innerHTML = totalQuestionsNum;
}
