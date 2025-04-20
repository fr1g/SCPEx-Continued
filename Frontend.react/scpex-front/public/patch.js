let __publicSearchboxEffect__called = false;
function publicSearchboxEffect() {
    if(__publicSearchboxEffect__called) return;
    else __publicSearchboxEffect__called = true;
    
    let searchbox = document.getElementById("searhBox"),
        searchBoxHints = [
            'Electronics',
            'Rice Lunch',
            'Tea packs',
            'Flash Drive',
            'Glass jars',
            'Napkin Tissues',
            'Search something...',
        ],
        currentHint = 0, pauseFlashing = false;

    searchbox.addEventListener('focus', () => {
        pauseFlashing = true;
        searchbox.value = searchBoxHints[currentHint - 1] ?? '';
    });

    searchbox.addEventListener('blur', () => {
        pauseFlashing = false;
        searchbox.value = null;
    });

    setTimeout(() => {
        setInterval(() => {
            if (pauseFlashing) return;
            searchbox.classList.replace('fade-in', 'fade-au');
            setTimeout(() => {
                searchbox.setAttribute('placeholder', '');
            }, 333);
            setTimeout(() => {
                searchbox.setAttribute('placeholder', searchBoxHints[currentHint]);
                searchbox.classList.replace('fade-au', 'fade-in');
                currentHint++;
                if (currentHint == searchBoxHints.length) currentHint = 0;
            }, 514);
        }, 5000);
    }, 1234);
}