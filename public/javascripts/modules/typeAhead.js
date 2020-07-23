const axios = require('axios')
const dompurify = require('dompurify')

function searchResultsHTML(stores){
    return stores.map(store => {
        return `<a href='/stores/${store.slug}' class='search__result'>
            <strong>${store.name}</strong>
        </a>
        `}
    ).join('')
}

function typeAhead(search){
    if(!search){
        return;
    }
    const searchInputs = document.querySelector('input[name="search"]')
    const searchResults = document.querySelector('.search__results')

    searchInputs.on('input',function(e){

        if(!this.value){
            searchResults.style.display = 'none';
            return;
        }

        searchResults.style.display = 'block';
        searchResults.innerHTML = '';

        axios
        .get(`/api/search?q=${this.value}`)
        .then(results => {
            if(results.data.length){
                searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(results.data))
                return;
            }   
            searchResults.innerHTML = dompurify.sanitize(`<div class='search__results'>No results found for ${this.value}</div>`);
        })
        .catch(err => {
            console.log(err)
        })
    })
        searchInputs.on('keydown',function (e){
            if(![38,40,13].includes(e.keyCode)){
                return;
            }
            
            const activeClass = 'search__result--active'
            const current = search.querySelector(`.${activeClass}`)
            const items = search.querySelectorAll('.search__result')

            let next;
            if(e.keyCode === 40 && current){
                next = current.nextElementSibling || items[0]
            }
            else if (e.keyCode === 40) {
                next = items[0]

            }
            else if(e.keyCode === 38 && current){
                next = current.previousElementSibling || items[items.length - 1 ]
            }
            else if(e.keyCode === 38){
                next = items[items.length - 1]
            }
            else if(e.keyCode === 13 && current.href){
                window.location = current.href;
                return;
            }

            if(current){
                current.classList.remove(activeClass);
            }
            next.classList.add(activeClass)
        })
}

export default typeAhead