let languageLetters = document.querySelectorAll(".highlight-language-text");
languageLetters.forEach(function(el) {
	let letters = [...el.innerText];
	console.log(letters);

	for (let i = 0; i < letters.length; i++) {
		if(i % 2) {
			letters[i] = "<span>" + letters[i] + "</span>";
		}
	}

	el.innerHTML = letters.join("");
})
