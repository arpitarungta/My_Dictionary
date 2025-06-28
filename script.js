const wrapper = document.querySelector(".wrapper"),
searchIcon = document.getElementById("search-icon"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word){
    if(result.title){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example || "No example found.";
        let audioUrl = "";
        for (let phonetic of result[0].phonetics) {
            if (phonetic.audio) {
                audioUrl = phonetic.audio;
                break;
            }
        }
        if (audioUrl) {
            audio = new Audio(audioUrl.startsWith("https") ? audioUrl : "https:" + audioUrl);
        } else {
            audio = null; 
        }
              
        let allSynonyms = [];
        result[0].meanings.forEach(meaning => {
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                allSynonyms = allSynonyms.concat(meaning.synonyms);
            }
        });

        if (allSynonyms.length === 0) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            allSynonyms.slice(0, 5).forEach((syn, index, arr) => {
                let comma = index < arr.length - 1 ? "," : "";
                let tag = `<span onclick="search('${syn}')">${syn}${comma}</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            });

        }
    }
}

function search(word){
    fetchApi(word);
    searchInput.value = word;
}

function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}

searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});

volume.addEventListener("click", () => {
    if (audio) {
        volume.style.color = "#4D59FB";
        audio.play();
        setTimeout(() => {
            volume.style.color = "#999";
        }, 800);
    } else {
        alert("No pronunciation available for this word.");
    }
});

removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

searchIcon.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if(word) fetchApi(word);
});
