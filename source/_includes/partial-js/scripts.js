// Custom accordion box
if(document.querySelector("[data-expand-btn]") !== null) {
	let expandBtnGroup = document.querySelectorAll("[data-expand-btn]");

	for (let i = 0; i < expandBtnGroup.length; i++) {
		let expandBtn = expandBtnGroup[i];
		let expandTarget = expandBtn.getAttribute("data-expand-btn");
		let expandTargetGroup = expandBtn.getAttribute("data-expand-group-btn");

		if(document.querySelector("[data-expand='" + expandTarget + "']") !== null) {
			let expandBox = document.querySelector("[data-expand='" + expandTarget + "']");

			expandBtn.addEventListener("click", function() {
				let expandBtnStatus = expandBtn.getAttribute("aria-expanded");

				let group = document.querySelectorAll("[data-expand-group='" + expandTargetGroup + "']");

				for (let j = 0; j < group.length; j++) {
					if(group[j] !== expandBox) {
						console.log(group[j]);
						group[j].classList.remove('d-block');
					}
				}

				expandBtnStatus === "true" ?
					expandBtn.setAttribute("aria-expanded", "false") :
					expandBtn.setAttribute("aria-expanded", "true");

				expandBox.classList.toggle('d-block');
			});
		}
	}
}

