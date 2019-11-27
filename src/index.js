// URLs
const API_ENDPOINT = "http://localhost:3000"
const QUOTES_URL = `${API_ENDPOINT}/quotes`
const QUOTES_WITH_LIKES_URL = `${API_ENDPOINT}/quotes?_embed=likes`
const LIKES_URL = `${API_ENDPOINT}/likes`

// DOM elements
const quoteList = document.querySelector("#quote-list")
const newForm = document.querySelector("#new-quote-form")

// get quotes
function getQuotes() {
    return fetch(QUOTES_WITH_LIKES_URL)
        .then(function(response) {
            return response.json()
        })
}

// render quotes
getQuotes().then(function(quotesJson) {
    quotesJson.forEach(function(quote) {
        renderQuote(quote)
    })
})

// render single quote
function renderQuote(quote) {
    const li = document.createElement("li")
    li.className = "quote-card"

    const blockQuote = document.createElement("blockquote")
    blockQuote.className = "blockquote"

    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    const footer = document.createElement("footer")
    footer.className = "blockquotefooter"
    footer.innerText = quote.author

    const br = document.createElement("br")

    const span = document.createElement("span")
    span.innerText = quote.likes.length

    const likeBtn = document.createElement("button")
    likeBtn.className = "btn-success"
    likeBtn.innerText = "Likes: "
    likeBtn.append(span)

    // handle like event
    likeBtn.addEventListener("click", function(event) {
        event.preventDefault()
        span.innerText = parseInt(span.innerText) + 1
        handleLikes(quote, span)
    })

    const delBtn = document.createElement("button")
    delBtn.className = "btn-danger"
    delBtn.innerText = "Delete"
    delBtnEvent(quote, delBtn, li)

    blockQuote.append(p, footer, br, likeBtn, delBtn)
    li.append(blockQuote)
    quoteList.append(li)

    return li
}

// remove quote
function removeQuote(quote) {
    let configObj = {
        method: "DELETE"
    }

    return fetch(`${QUOTES_URL}/${quote.id}`, configObj)
}

// event listener on delete button
function delBtnEvent(quote, delBtn, li) {
    delBtn.addEventListener("click", function(event) {
        event.preventDefault()
        removeQuote(quote)
        li.remove()
    })
}

// add quote
function addQuote(newForm) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "quote": newForm.quote.value,
            "author": newForm.author.value,
            "likes": ""
        })
    }

    return fetch(QUOTES_URL, configObj)
        .then(function(response) {
            return response.json()
        })
        .then(function(quote) {
            renderQuote(quote)
        })
}

// event listener on new quote form
newForm.addEventListener("submit", function(event) {
    event.preventDefault()
    addQuote(newForm)
})

// handle likes
function handleLikes(quote, span) {
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "quoteId": quote.id,
            "likes": span.innerText,
            "createdAt": Date.now()
        })
    }
    return fetch(LIKES_URL, configObj)
        .then(function(response) {
            return response.json()
        })
}