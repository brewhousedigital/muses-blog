// Define Variables
const buttonsBlock = document.getElementById("lessons-block");


// US Flag
const unitedStatesFlag = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 7410 3900"><path fill="#b22234" d="M0 0h7410v3900H0z"/><path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" stroke-width="300"/><path fill="#3c3b6e" d="M0 0h2964v2100H0z"/><g fill="#fff"><g id="d"><g id="c"><g id="e"><g id="b"><path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"/><use xlink:href="#a" y="420"/><use xlink:href="#a" y="840"/><use xlink:href="#a" y="1260"/></g><use xlink:href="#a" y="1680"/></g><use xlink:href="#b" x="247" y="210"/></g><use xlink:href="#c" x="494"/></g><use xlink:href="#d" x="988"/><use xlink:href="#c" x="1976"/><use xlink:href="#e" x="2470"/></g></svg>`;



// Helper functions
// Shuffle the array so its random each time
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Handle the localStorage
function storage() {
    let completedLessonsList = [];

    if(localStorage.getItem(localStorageName) !== null) {
        try {
            completedLessonsList = JSON.parse(
                localStorage.getItem(localStorageName)
            );

        } catch(e) {
            localStorage.setItem(localStorageName, JSON.stringify(completedLessonsList));
        }

    } else {
        localStorage.setItem(localStorageName, JSON.stringify(completedLessonsList));
    }

    completedLessonsList.sort(sortArrayNumerically);

    return completedLessonsList;
}

// Check all the lessons that the user has learned
function completedLessons() {
    let completedLessonsList = storage();

    let completedLessonsCheckboxes = document.querySelectorAll(".language-learning-checkbox");

    for (let i = 0; i < completedLessonsCheckboxes.length; i++) {
        let thisEl = completedLessonsCheckboxes[i];
        let thisLesson = parseInt(thisEl.getAttribute("data-num"));

        if(completedLessonsList.includes(thisLesson)) {
            thisEl.checked = true;
        }
    }

    // On the last item, scroll to it once the page is loaded
    let listLength = completedLessonsList.length - 1;

    if(listLength > 0) {
        let targetBtn = document.querySelector("button[data-id='" + completedLessonsList[listLength] + "']");

        setTimeout(function() {
            targetBtn.scrollIntoView(true);
        }, 300);
    }
}

// Sort numeric arrays least to greatest
function sortArrayNumerically(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
}

// Generate list of flashcards for the modal
function flashcards(modal, element, type) {
    let thisLesson = parseInt(element.getAttribute("data-id"));
    let newCardsArray = [];
    let oldCardsArray = [];


    // Total cards , total previous cards, and total random cards
    let cardTotal = 15;
    let cardReviewTotal = 10;


    // For random selection, dont use cardReviewTotal
    let completedLessonsList = storage();


    // Reset the modal html to prepare for the new cards
    let modalBody = modal.querySelector("#flashcard-modal-content");
    modalBody.innerHTML = "";


    if(type === "random") {
        // Reset card total to 20 so we get more to review
        cardTotal = 20;

        // Grab highest lesson completed
        let highestLesson = completedLessonsList[completedLessonsList.length - 1];

        // Grab everything else into its own array
        for(let i = 1; i <= highestLesson; i++) {
            oldCardsArray.push(wordList[i]);
        }

        // Shuffle the remaining deck in a random order
        shuffleArray(oldCardsArray);

        // Take the number of random cards and put them into the new deck
        if(oldCardsArray.length > cardTotal) {
            for (let i = 0; i < cardTotal; i++) {
                newCardsArray.push(oldCardsArray[i]);
            }
        } else {
            for (let i = 0; i < oldCardsArray.length; i++) {
                newCardsArray.push(oldCardsArray[i]);
            }
        }

        cardTotal = newCardsArray.length;

    } else if(type === "all") {
		// Grab highest lesson completed
		let highestLesson = completedLessonsList[completedLessonsList.length - 1];

		// Reset card total to all so we get more to review
		cardTotal = highestLesson;

		// Grab everything else into its own array
		for(let i = 1; i <= highestLesson; i++) {
			oldCardsArray.push(wordList[i]);
		}

		// Shuffle the remaining deck in a random order
		shuffleArray(oldCardsArray);

		// Take the number of random cards and put them into the new deck
		for (let i = 0; i < oldCardsArray.length; i++) {
			newCardsArray.push(oldCardsArray[i]);
		}

		cardTotal = newCardsArray.length;

	} else if(type === "fifty") {
		// Grab highest lesson completed
		let highestLesson = completedLessonsList[completedLessonsList.length - 1];

		// Reset card total to 50 so we get more to review
		cardTotal = 50;

        // Grab the previous 50
        for(let i = highestLesson; i > highestLesson - cardTotal; i--) {
            newCardsArray.push(wordList[i]);
        }

        // Shuffle the remaining deck in a random order
        shuffleArray(newCardsArray);

    } else if(thisLesson > cardTotal) {
		// Grab the previous 10
		for(let i = thisLesson; i > thisLesson - cardReviewTotal; i--) {
			newCardsArray.push(wordList[i]);
		}

		// Grab everything else into its own array
		for(let i = 0; i <= thisLesson - cardReviewTotal; i++) {
			oldCardsArray.push(wordList[i]);
		}

		// Shuffle the remaining deck in a random order
		shuffleArray(oldCardsArray);

		// Choose 5 cards oldCardsArray and add it to the newCardsArray to make 15 total cards.
		for(let i = oldCardsArray.length - 1; i > oldCardsArray.length - (cardTotal - cardReviewTotal + 1); i--) {
			newCardsArray.push(oldCardsArray[i]);
		}

	} else {
        for(let i = 0; i < thisLesson; i++) {
            newCardsArray.push(wordList[i]);
        }

        cardTotal = newCardsArray.length;
    }

    // Shuffle the new deck
    shuffleArray(newCardsArray);

    console.log("newCardsArray", newCardsArray);

    for(let i = 0; i < cardTotal; i++) {
        template_card(modalBody, newCardsArray[i][0], newCardsArray[i][1])
    }

	let bar = document.querySelector("#modal-progress-bar .progress-bar");
	bar.setAttribute("aria-valuemax", String(newCardsArray.length));
	bar.style.width = "0%";
	bar.setAttribute("aria-valuenow", "1")

    let firstChild = modalBody.firstElementChild;
    firstChild.style.display = "block";
}

// Browser based text to speech API
function textToSpeech() {
    let firstWord = document.querySelectorAll(".flash-card")[0];

    if(firstWord.getAttribute("data-lang") === "lang-new") {
        firstWord = firstWord.querySelector(".answer").innerText;
    } else {
        firstWord = firstWord.querySelector(".question").innerText;
    }

    // Adding periods to make the speech synthesis pause between words
    if(firstWord.includes(", ")) {
        firstWord = firstWord.replace(", ", " . . . ");
    } else {
        //firstWord = firstWord + " . . ";
    }

    // Fire it up!
    msg.text = firstWord;
    window.speechSynthesis.speak(msg);
}

// Flip flash card on guess
function flipFlashCard(el) {
	let card = el.closest(".flash-card");
    card.querySelector(".answer").style.opacity = "1";
    card.querySelector(".correct-answer").disabled = false;
    card.querySelector(".wrong-answer").disabled = false;

    textToSpeech();
}

// Complete current card and show the next one
function completeFlashCard(el) {
    // Remove current card
    el.closest(".flash-card").remove();

    // Show the next card
    let cards = document.querySelectorAll(".flash-card");

    let bar = document.querySelector("#modal-progress-bar .progress-bar");
    let barMax = parseInt(bar.getAttribute("aria-valuemax"));
    let barCompleted = barMax - cards.length;
    let barPercentComplete = Math.round((barCompleted / barMax) * 100);
	bar.style.width = barPercentComplete + "%";
	bar.setAttribute("aria-valuenow", String(barCompleted))

    // Show the remaining cards in console
	console.log("Cards Remaining:", cards.length)

    // If that was the last card, show the "Finito" message
    if(cards.length > 0) {
        cards[0].style.display = "block";
    } else {
        document.getElementById("flashcard-modal-content").innerHTML = "<h1 class='text-center display-1 font-italic'>Finito</h1>";
    }
}

// Send current card to the back and show the next one
function redoFlashCard(el) {
    // Copy the card and send it to the back
	let card = el.closest(".flash-card");
    card.style.display = "none";
    card.querySelector(".answer").style.opacity = "0";
	card.querySelector(".correct-answer").disabled = true;
	card.querySelector(".wrong-answer").disabled = true;

    document.getElementById("flashcard-modal-content").insertBefore(card, null);

    // Show the next card
    let cards = document.querySelectorAll(".flash-card");

    cards[0].style.display = "block";
}

// Track your progress on the learned checkboxes
function updateProgress(lessonID, type) {
    let currentLesson = parseInt(lessonID.getAttribute("data-num"));
    let currentStorage = storage();

    if(type === "add") {
        currentStorage.push(currentLesson);
    } else {
        currentStorage = currentStorage.filter(item => item !== currentLesson);
    }

    currentStorage.sort(sortArrayNumerically);
    localStorage.setItem(localStorageName, JSON.stringify(currentStorage));
}


// Templates
// Generate and append the card template to the modal
function template_card(modalContent, question, answer) {

    // 50/50 chance to swap Answer and Question to switch things up! yeet!
    let tempAnswer = answer;
    let tempQuestion = question;
    let lang = "lang-new";

    //let languageNote = "<div><img src='/images/language/flag-united-states.png' alt='United States Flag' class='img-fluid' style='max-width: 30px;'></div>";
    let languageNote = unitedStatesFlag;

    if(Math.random() < 0.5) {
        question = tempAnswer;
        answer = tempQuestion;
        lang = "lang-en";

        //languageNote = "<div><img src='/images/language/flag-italy.png' alt='Italian Flag' class='img-fluid' style='max-width: 30px;'></div>";
		languageNote = languageFlag;
    }

    let template = `
        <div class='flash-card mx-auto w-100' data-lang='${lang}' style="max-width: 500px; display: none;">
            ${languageNote}
            <div class='question display-4'>${question}</div>
            <div class='answer' style='opacity: 0;'>
                <div class='display-3 font-weight-bolder mb-4'>${answer}</div>
            </div>

            <div class='actions mb-5'>
                <button class='btn btn-primary w-100 d-block mb-3 check-answer' style="padding: 30px 0;">Check</button>

                <div class='row'>
                    <div class='col-6'>
                        <button class='btn btn-success w-100 d-block correct-answer' disabled style="padding: 30px 0;">Correct!</button>
                    </div>
                    <div class='col-6'>
                        <button class='btn btn-danger w-100 d-block wrong-answer' disabled style="padding: 30px 0;">Dang</button>
                    </div>
                </div>
            </div>
        </div>`;

    modalContent.insertAdjacentHTML("beforeend", template);
}


// Start the application
completedLessons();

let lessonCheckboxes = document.querySelectorAll(".language-learning-checkbox");
lessonCheckboxes.forEach(function(el) {
    el.addEventListener("click", function() {
        if(this.checked === true) {
            updateProgress(this, "add");
        } else {
            updateProgress(this, "remove");
        }
    });
});


const keyboardShortcuts = (event) => {
	let currentWindow = document.querySelector("#flashcard-modal-content > .flash-card")
	let checkBtn = currentWindow.querySelector(".check-answer");
	let correctBtn = currentWindow.querySelector(".correct-answer");
	let wrongBtn = currentWindow.querySelector(".wrong-answer");

	if(event.key === "ArrowUp") {
		checkBtn.click()
	}

	if(event.key === "ArrowRight") {
		correctBtn.disabled ? checkBtn.click() : correctBtn.click()
	}

	if(event.key === "ArrowDown") {
		wrongBtn.click()
	}
}


MicroModal.init({
    onShow: function(modal,element) {

        if(element.classList.contains("review-random")) {
            flashcards(modal, element, "random");
        } else if(element.classList.contains("review-all")) {
			flashcards(modal, element, "all");
		} else if(element.classList.contains("review-50")) {
			flashcards(modal, element, "fifty");
		} else {
            flashcards(modal, element, "lesson");
        }

        let allCheckBtns = document.querySelectorAll(".check-answer");
        let allCorrectBtns = document.querySelectorAll(".correct-answer");
        let allWrongBtns = document.querySelectorAll(".wrong-answer");

        allCheckBtns.forEach(function(el) {
            el.addEventListener("click", function() {flipFlashCard(this);});
        });

        allCorrectBtns.forEach(function(el) {
            el.addEventListener("click", function() {completeFlashCard(this);});
        });

        allWrongBtns.forEach(function(el) {
            el.addEventListener("click", function() {redoFlashCard(this);});
        });

		document.body.addEventListener("keyup", keyboardShortcuts)
    },
	onClose: (modal) => {
    	// Removing keyboard shortcut
		document.body.removeEventListener("keyup", keyboardShortcuts)
    }
})
