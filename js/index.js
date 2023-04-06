document.addEventListener("DOMContentLoaded", function() {
    /*
Get a list of books & render them http://localhost:3000/books /X
Be able to click on a book, you should see the book's thumbnail 
and description and a list of users who have liked the book. /X
You can like a book by clicking on a button. You are user 1 
{"id":1, "username":"pouros"}, so to like a book send 
a PATCH request to http://localhost:3000/books/:id with an array 
of users who like the book. This array should be equal to the existing 
array of users that like the book, plus your user. For example, if the 
previous array was "[{"id":2, "username":"auer"}, {"id":8, "username":"maverick"}], 
you should send as the body of your PATCH request:
*/

//-----State-----//

let currentBook = 1


//-----Variables-----//

const bookUl = document.querySelector("#list-panel")
const bookDiv = document.querySelector("#show-panel")
const userUl = document.querySelector("#user-ul")


//-----Fetches-----//

const titleFetch = () => {
    fetch(`http://localhost:3000/books`)
    .then(r => r.json())
    .then(bookObjs => {
        console.log(bookObjs)
        bookObjs.forEach(renderBookTitle)
    })
}

const bookDetailFetch = (id) => {
    
    fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
    .then(bookObj => {
        console.log(bookObj)
        renderBook(bookObj)
    })
}

const getBookUsers = (id) => {
    return fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
}

const likePatchRequest = (likeObj, id) => {
    //console.log("before fetch:",likeObj, id)
    fetch(`http://localhost:3000/books/${id}`,{
        method: "PATCH",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({users: likeObj})
    })
    .then(r => r.json())
    .then(updatedLike => {
        updatedLike.users.forEach(renderUsers)
        console.log(updatedLike.users)
    })
}


//-----Render Functions-----//

const addUser = (book) => {
    newUser = {
        id:1, username:"pouros"
    }
    const userArray = book.users.slice()
    userArray.push(newUser)
    return userArray
}

const renderBookTitle = (book) => {
    const bookLi = document.createElement("li")
    bookLi.dataset.id = book.id
    bookLi.id = "book-li"
    bookLi.textContent = book.title
    bookUl.append(bookLi)
}

const renderBook = (book) => {
    bookDiv.innerHTML = '<ul id="user-ul"></ul>'
    const bookImg = document.createElement("img")
    const bookTitle = document.createElement("h1")
    const bookSubtitle = document.createElement("h3")
    const bookAuthor = document.createElement("h4")
    const bookDesc = document.createElement("p")
    const likeButton = document.createElement("button")
    

    bookImg.src = book.img_url
    bookTitle.textContent = book.title 
    bookSubtitle.textContent = book.subtitle
    bookAuthor.textContent = book.author
    bookDesc.textContent = book.description
    likeButton.innerText = "Like"
    
    bookDiv.prepend(bookImg, bookTitle, bookSubtitle, bookAuthor, bookDesc, likeButton)
    book.users.forEach(user => {renderUsers(user)})
}

const renderUsers = (user) => {
    const userUl = document.querySelector("#user-ul")
    const bookUser = document.createElement("li")
    bookUser.textContent = user.username
    bookUser.dataset.id = user.id
    userUl.append(bookUser)
    //debugger
}




//-----Event Listeners-----//

bookUl.addEventListener("click", (event) => {
    if(event.target.matches("#book-li")){
        //console.log("success", event)

        const id = event.target.dataset.id
        currentBook = parseInt(id)
        console.log("Current Book:", currentBook)
        bookDetailFetch(id)

    }

})

bookDiv.addEventListener("click", (event) => {
    if(event.target.matches("button")){
        //console.log("You clicked like!")
        const userUl = document.querySelector("#user-ul")
        const likeButton = event.target
        
        getBookUsers(currentBook).then(bookObj => {
            const unliked = bookObj.users.filter(user => user.id !== 1)
            const liked = addUser(bookObj)
            //console.log("unliked:",unliked,"liked:", liked)
            //console.log(liker.innerText)
            if (likeButton.innerText === "Like"){
                likeButton.innerText = "Unlike"
                userUl.innerHTML = ""
                likePatchRequest(liked, currentBook)
                //console.log("you liked it!")
                
            } else if (likeButton.innerText === "Unlike") {
                likeButton.innerText = "Like"
                userUl.innerHTML = ""
                likePatchRequest(unliked, currentBook)
                //console.log("you unliked it!")
                
            }

        })
        
    }
})


//-----Initialize-----//

titleFetch()
});
