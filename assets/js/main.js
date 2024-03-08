const BASEURL = "assets/data/";

// Function for AJAX callback
function ajaxCallBack(url, result) {
    $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        success: result,
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

// Function for header navigation
function header(data) {
    let html = ` <div class="container">
    <a href="index.html"><img class="d-inline-block align-top"src="assets/img/logobanner.png" alt="banner"/></a>
    <button 
    type="button" 
    data-bs-toggle="collapse" 
    data-bs-target="#navbarNav" 
    class="navbar-toggler" 
    aria-controls="navbarNav" 
    aria-expanded="false" 
    aria-label="Toggle navigation"
    >
        Menu
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav" id="pocetna">`;
    let activeLi = 0;
    let klasa = "";
    let brojProizvoda = getLS("brojProizvodaLS");
    for (link of data) {
        if (link.href == "cart.html") {
            if (brojProizvoda == null) {
                html += `<li class="${klasa} nav-item"><a class="nav-link" href="${link.href}">${link.text}<span id="broj-proizvoda">0 products</span></a></li>`;
            } else {
                html += `<li class="${klasa} nav-item"><a class="nav-link" href="${link.href}">${link.text}<span id="broj-proizvoda">${brojProizvoda}</span></a></li>`;
            }
        } else {
            html += `<li class="${klasa} nav-item"><a class="nav-link" href="${link.href}">${link.text}</a></li>`;
        }
    }
    html += `</ul></div></div>`;
    $("#navigation").html(html);
}

// Function for footer
function ispisFootera() {
    let html = `
<div class="container-fluid p-5">
<div class="row">
    <div class="col-lg-4 col-12 mb-5 mb-lg-0 text-center">
        <a href="https://www.instagram.com"><i class="fa fa-3x fa-brands fa-instagram"></i></a>
        <a href="https://www.facebook.com"><i class="fa fa-3x fa-brands fa-facebook"></i></a>
        <a href="sitemap.xml"><i class="fa fa-3x fa-sitemap"></i></a>
        <a href="Documentation.pdf"><i class="fa fa-3x fa-file"></i></a>
    </div>
    <div class="col-lg-4 col-12 mb-5 mb-lg-0 text-center">
        <h2 class="lightBlueColor"><i class="fa fa-copyright lightBlueColor"></i>Kristijan Smailovic 159/21</h2>
    </div>
    <div class="col-lg-4 col-12 text-center">
        <a href="#navigation" id="backToTop">Back to top</a>
    </div>
</div>
</div>`;
    $("footer").html(html);
}

// Function for local storage
function setLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Function to display cart data
function displayCartData() {
    let productInfo = getLS("svemangeLS");
    let productsCartLS = getLS("cart");
    productInfo = productInfo.filter(p => {
        for (let product of productsCartLS) {
            if (p.id == product.id) {
                p.quantity = product.qty;
                return true;
            }
        }
    });
}

// Function to generate table
function generateTable() {
    let html = `
    <table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Image</th>
      <th scope="col">Qty</th>
      <th scope="col">Price</th>
      <th scope="col">Total</th>
      <th scope="col">Remove</th>
    </tr>
  </thead>
  <tbody>`;
    for (let p of productInfo) {
        html += `    
            <tr>
                <th scope="row">${p.name}</th>
                <td><img src="${p.image}" alt="${p.name}" class="image-cart"/></td>
                <td>${p.quantity}</td>
                <td>$${p.price.new}</td>
                <td>$${parseFloat(p.price.new) * p.quantity}</td>
                <td><button onclick="removeFromCart(${p.id})" class="btn" value="remove">remove</button></td>
            </tr>`;
    }
    html += `
    </tbody>
    </table>`;
    $("#products").html(html);
}

// Function to remove from cart
function removeFromCart(id) {
    let korpa = getLS("cart");
    let filtered = korpa.filter(p => p.id != id);
    setLS("cart", filtered);
    displayCartData();
    printNumberOfProducts();
    location.reload();
}

// Function to print number of products
var quantity = 0;
function printNumberOfProducts() {
    let productsCart = getLS("cart");
    if (productsCart == null) {
        $("#broj-proizvoda").html("(0 products)");
    } else {
        quantity = productsCart.length;
        let numberOfProducts = quantity;
        let txt = quantity + " ";

        if (numberOfProducts == 1) {
            txt = quantity + " " + "product";
        } else {
            txt = quantity + " products";
        }
        setLS("brojProizvodaLS", txt);
        $("#broj-proizvoda").html(`${txt}`);
    }
}

// Function to toggle menu
function toggleMenu() {
    const navigationMenu = document.querySelector('#navbarNav');
    navigationMenu.classList.toggle('show');
}

// Event listener for toggling the menu
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.navbar-toggler');
    menuButton.addEventListener('click', toggleMenu);
});

// Functions from author.js
function showMoreAuthor() {
    $('#showMoreAuthor').css("display", "none");
    $('#btnPrikaziViseAutor').click(function (e) {
        e.preventDefault();
        if ($('#showMoreAuthor').is(':visible')) {
            $('#showMoreAuthor').slideUp();
            $(this).val('Show More');
        } else {
            $('#showMoreAuthor').slideDown();
            $(this).val('Show Less');
        }
    });
}

// Functions from cart.js
function cartFunctions() {
    const BASEURL ="assets/data/"
window.onload = function(){
//dynamically writing navigation
ajaxCallBack(BASEURL+"menu.json",function(result){
    header(result);
});
}
//Writing and deleting cart products
$(document).ready(function(){
let productsCartLS=getLS("cart");

if (productsCartLS==null || productsCartLS.length<1){
    $("#products").html(`<div id="greskaShop"><h1>Your shopping cart is empty!</h1></div>`);
}
else{
    displayCartData();
    generateTable(productInfo);
}
});
var productsCartLS=getLS("cart");

//function for getting products from cart
function displayCartData(){
    productInfo=getLS("svemangeLS");
    productInfo=productInfo.filter(p=>{
        for(let product of productsCartLS){
            if(p.id == product.id){
                p.quantity=product.qty;
                return true;
            }
        }
    })
}

var quantity=0;
function printNumberOfProducts(){
    let productsCart = getLS("cart");
    if(productsCart == null){
        $("#broj-proizvoda").html("(0 products)");
    }
    else{
            quantity=productsCart.length;
        let numberOfProducts = quantity;
        let txt = quantity+" ";

        if(numberOfProducts == 1){
            txt = quantity+" "+"product";
        }
        else{
            txt =quantity+" products";
        }
        setLS("brojProizvodaLS",txt);
        $("#broj-proizvoda").html(`${txt}`)
    }
}
}

// Functions from contact.js
function contactFunctions() {
    //FORM 

   //Writing DATE

    //Year
    var nizGodina = [];
    for(let i=2023;i>1929;i--){
        nizGodina.push(i);
    }
    
    var godineIspis = "<select id='godina'>";
    godineIspis += "<option>Year</option>";
    for (let i in nizGodina) {
        godineIspis += "<option>"+nizGodina[i]+"</option>";
    }
    godineIspis += "</select>";
    document.getElementById("ddlYear").innerHTML = godineIspis;
    
        //Month
    var nizMeseca = [];
    for(let i = 12; i>0;i--){
        nizMeseca.push(i);
    }
    
    var meseciIspis = "<select id='mesec'>";
    meseciIspis += "<option>Month</option>";
    for (let i in nizMeseca) {
        meseciIspis += "<option>"+nizMeseca[i]+"</option>";
    }
    meseciIspis += "</select>";
    document.getElementById("ddlMonth").innerHTML = meseciIspis;
    
        //Day
     var nizDana = [];
    for(let i = 31; i>0;i--){
        nizDana.push(i);
    }
    var daniIspis = "<select id='dan'>";
    daniIspis += "<option>Day</option>";
        for (let i in nizDana) {
            daniIspis += "<option>"+nizDana[i]+"</option>";
        }
        daniIspis += "</select>";
        document.getElementById("ddlDay").innerHTML = daniIspis;
    
//REGULARNI IZRAZI
document.getElementById("submitForme").addEventListener("click",function(){
    //getting values from forms
    var ime =   document.getElementById("firstName").value.trim();
    var prezime = document.getElementById("lastName").value.trim();
    var email = document.getElementById("email").value.trim();
    var confirmEmail = document.getElementById("emailConfirm").value.trim();
    var godine = document.getElementById("godina").value;
    var meseci = document.getElementById("mesec").value;
    var dani = document.getElementById("dan").value;
    var pol = document.getElementsByName("Pol");

    //getting divs for errors
    var imeGreska = document.getElementById("firstNameError");
    var prezimeGreska = document.getElementById("lastNameError");
    var emailGreska = document.getElementById("emailError");
    var confirmEmailGreska = document.getElementById("emailConfirmError");
    var godineGreska = document.getElementById("godineError");
    var meseciGreska = document.getElementById("meseciError");
    var daniGreska = document.getElementById("daniError");
    var polGreska = document.getElementById("radioButtonError");

    //regex

    var regexIme = /^[A-Z][a-z]{2,15}$/;
    var regexPrezime = /^[A-Z][a-z]{2,15}$/;
    var regexEmail = /^[a-z]+[\.\-\_\!a-z\d]*\@[a-z]{2,10}(\.[a-z]{2,3}){1,2}$/;
    var regexConfirmEmail = /^[a-z]+[\.\-\_\!a-z\d]*\@[a-z]{2,10}(\.[a-z]{2,3}){1,2}$/;

    //Checking
    //Name
    if(ime==""){
        imeGreska.innerHTML = "This field is required!";
        document.getElementById("firstName").style.borderBottom = "3px solid red";
    }
    else if(!regexIme.test(ime)){
        imeGreska.innerHTML = "Enter valid name!";
        document.getElementById("firstName").style.borderBottom = "3px solid red";
    }else{
        imeGreska.innerHTML = "";
        document.getElementById("firstName").style.borderBottom = "3px solid green";
    }

    //Last Name
    if(prezime==""){
        prezimeGreska.innerHTML = "This field is required!";
        document.getElementById("lastName").style.borderBottom = "3px solid red";
    }
    else if(!regexPrezime.test(prezime)){
        prezimeGreska.innerHTML = "Enter valid lastname!";
        document.getElementById("lastName").style.borderBottom = "3px solid red";
    }else{
        prezimeGreska.innerHTML = "";
        document.getElementById("lastName").style.borderBottom = "3px solid green";
    }

    //email
    if(email==""){
        emailGreska.innerHTML = "This field is required!";
        document.getElementById("email").style.borderBottom = "3px solid red";
    }
    else if(!regexEmail.test(email)){
        emailGreska.innerHTML = "Enter valid e-mail!";
        document.getElementById("email").style.borderBottom = "3px solid red";
    }else{
        emailGreska.innerHTML = "";
        document.getElementById("email").style.borderBottom = "3px solid green";
    }

    //confirmEmail
    if(confirmEmail==""){
        confirmEmailGreska.innerHTML = "This field is required!";
        document.getElementById("emailConfirm").style.borderBottom = "3px solid red";
    }
    else if(email!=confirmEmail){
        confirmEmailGreska.innerHTML = "Please confirm with correct e-mail!";
        document.getElementById("emailConfirm").style.borderBottom = "3px solid red";
    }
    else{
        confirmEmailGreska.innerHTML = "";
        document.getElementById("emailConfirm").style.borderBottom = "3px solid green";
    }

    //year
    if(godine == "Year") {
        godineGreska.classList.add("showError");
    } else {
        godineGreska.classList.remove("showError");
        console.log("Izabrana godina");
    }
    //month
    if(meseci == "Month") {
        meseciGreska.classList.add("showError");
    } else {
        meseciGreska.classList.remove("showError");
        console.log("Izabran mesec");
    }

    //day
    if(dani == "Day") {
        daniGreska.classList.add("showError");
    } else {
        daniGreska.classList.remove("showError");
        console.log("Izabran dan");
    }

    //Gender
    let isValidPol = false;

    for(let i=0; i< pol.length; i++){
        if(pol[i].checked){
            isValidPol = true;
            break;
        }
    }

    if(!isValidPol){
        polGreska.innerHTML = "Please choose gender!";
    }
    else {
        polGreska.innerHTML = "";
        console.log("Chosen gender");
    }

})

function setLS(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}
function getLS(key){
    return JSON.parse(localStorage.getItem(key));
}
}

function mainFunctions() {
     //Button for about
  $('#showMoreTextAbout').css("display", "none");
  $('#btnPrikaziVise').click(function (e) {
      e.preventDefault();
      if ($('#showMoreTextAbout').is(':visible')) {
          $('#showMoreTextAbout').slideUp();
          $(this).val('Show More');
      } else {
          $('#showMoreTextAbout').slideDown();
          $(this).val('Show Less');
      }
  });

    //adding text color for p tags
$(".author-card p").addClass("GrayText");
$("#aboutBlok p").addClass("lightGrayText");

     //SLIDER
var i = 0;
var nizSlika = ["banner-01", "banner-02", "banner-03"];

function imageSlider(){
    var slider=document.getElementById("slider");
    slider.style.opacity = 1;
    setTimeout(() => {
        slider.style.opacity = 0.9;
    }, 3400);
    setTimeout(() => {
        slider.style.opacity = 0.85;
    }, 3500);
    setTimeout(() => {
        slider.style.opacity = 0.8;
    }, 3600);
    setTimeout(() => {
        slider.style.opacity = 0.75;
    }, 3700);
    setTimeout(() => {
        slider.style.opacity = 0.7;
    }, 3800);
    setTimeout(() => {
        slider.style.opacity = 0.65;
    }, 3900);
    slider.style.backgroundImage = "url('assets/img/"+nizSlika[i]+".jpg')";
    slider.style.opacity=0.65;
    setTimeout(() => {
        slider.style.opacity = 0.7;
    }, 100);
    setTimeout(() => {
        slider.style.opacity = 0.75;
    }, 200);
    setTimeout(() => {
        slider.style.opacity = 0.8;
    }, 300);
    setTimeout(() => {
        slider.style.opacity = 0.85;
    }, 400);
    setTimeout(() => {
        slider.style.opacity = 0.95;
    }, 500);
    setTimeout(() => {
        slider.style.opacity = 1;
    }, 600);
    if(i < nizSlika.length-1){
        i++;
    }
    else{
        i=0;
    }

    setTimeout(imageSlider, 4000);
}
imageSlider();
}

// Functions from store.js
function storeFunctions() {
    const BASEURL ="assets/data/"

window.onload = function(){
//clearing localstorage from checkboax
    setLS("kolekcijaLS",null);
    //search 
    document.getElementById("search").addEventListener("input", filterPosts);
    document.getElementById("search").addEventListener("blur", clearSearch);
//dynamically writing navigation
ajaxCallBack(BASEURL+"menu.json",function(result){
header(result);
});
//results from collections.json
ajaxCallBack(BASEURL+"collections.json",function(result){
    printCollections(result)
});
//results from mangas.json
ajaxCallBack(BASEURL+"mangas.json",function(result){;
    setLS("mangeLS",result);
    setLS("svemangeLS",result);
    printMangas(result);
});

//calling function for writing the footer
ispisFootera();
}

//function for writing collections on store page
function printCollections(data){
    let html="<hr/><p>Collections</p>"
    for(kolekcija of data){
        html+=`<a href="#" class="filter-by-collection" data-collectionid="${kolekcija.id}">${kolekcija.name.full}</a><br/><br/>`
    }
    html+=`<a href="#" class="filter-by-collection" data-collectionid="0">All collections</a><br/><br/>`
    html+=`
    <hr/>
    <label for="ddlSort">Sort items</label>
    <select id="sort" title="ddlSort" class="form-control" name="ddlSort">
        <option value="default">Sort by</option>
        <option value="namedescending">Name Descending</option>
        <option value="nameascending">Name Ascending</option>
        <option value="priceasc">Price Ascending</option>
        <option value="pricedesc">Price Descending</option>
    </select>
    <hr/>
    <p>Manga genre</p>
    <form action="">
        <input type="checkbox" id="shonen" name="mangaType1" value="shonen">
        <label class="cardlabel" for="mangaType1">Shonen</label><br>
        <input type="checkbox" id="seinen" name="mangaType2" value="seinen">
        <label class="cardlabel" for="mangaType2">Seinen</label><br>
        <input type="checkbox" id="shoujo" name="mangaType3" value="shoujo">
        <label class="cardlabel" for="mangaType3">Shoujo</label><br><br>
    </form>
    `
    $("#collections").html(html);
    $("#collections a").click(filterByCollection);
    
    $("#collections").click(filterByCheck);
    $("#collections").click(sortDdl);
}
//function for writing products
function printMangas(data){
    let html=""
    for(manga of data){
        html+=`
        <div class="col-md-3 col-sm-6 container-fluid">
        <div class="card">
            <img src="${manga.image}" alt="${manga.name}" class="card-image-top img-fluid">
            <div class="card-body d-flex flex-column">
                <h5 class="text-center">${manga.name}</h5>
        `
        if(manga.price.old==null){
            html+=`<p class="card-text text-center">$${manga.price.new}</p>`
        }
        else{
            html+=`<p class="card-text text-center">$${manga.price.new}</p>
                   <p class="card-text text-center text-decoration-line-through">$${manga.price.old}</p>`
        }
        html+=`
            <div class="btn mt-auto">
                <button type="button" data-id=${manga.id} class="button cartAdd">Add to cart<i class="fa fa-shopping-cart"></i></button>
            </div>
        </div>
    </div>
    </div>
    `
        }
        $("#products").html(html);
        if((document.getElementById("products").innerHTML)==""){
            $("#products").html(`<div id="greskaShop"><h1>That kind of product doesn't exist</h1></div>`);
        }
        setLS("mangeLS",data);
        $('.cartAdd').click(addToCart);
    }
    
//AJAX CallBack

function ajaxCallBack(url,result){
    $.ajax({
        url: url,
        method: "get",
        dataType: "json",
        success:result,
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            return msg;}
    });
}

//search
function filterPosts(){
    const unosKorisnika = this.value;
    $.ajax({
        url: "assets/data/mangas.json",
        method: "get",
        dataType: "json",
        success:function(mange){
            const filtriraneMange = mange.filter(el=>
            {
             if (el.name.toLowerCase().indexOf(unosKorisnika.toLowerCase()) !== -1)
             {
                return true;
             }   
            });
            printMangas(filtriraneMange);
        },
        error: function(xhr){console.log(xhr);}
    });
}

// Filtering by collections
function filterByCollection(e){
    e.preventDefault();
    const idKolekcije=this.dataset.collectionid;
    $.ajax({
        url: "assets/data/mangas.json",
        method: "get",
        dataType: "json",
        success:function(mange){
            $("#sort").val("default");
            document.getElementById("shonen").checked = false;
            document.getElementById("seinen").checked = false;
            document.getElementById("shoujo").checked = false;
            if (idKolekcije==0){
                printMangas(mange);
                setLS("kolekcijaLS",mange);
            }
            else{
                const filtriraneMange = mange.filter(el=>
                    {
                     if (el.collectionId==idKolekcije)
                     {
                        return true;
                     }   
                    });
                    setLS("kolekcijaLS",filtriraneMange);
                    printMangas(filtriraneMange);
                    
            }

        },
        error: function(xhr){console.log(xhr);}
    });
}

//Clearing search
function clearSearch(){
    $(this).val("");
}

function setLS(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}
function getLS(key){
    return JSON.parse(localStorage.getItem(key));
}

//Sorting from dropdown list
function sortDdl(){ 
    let mange=getLS("mangeLS");
    let stampa;
    if ($("#sort").val()=="namedescending"){
        stampa=mange.sort(function(a,b){
            if(a.name > b.name)
            {
                return -1
            }
            else if(a.name < b.name)
            {
                return 1
            }
            else{
                return 0
            }
        });
}
else if ($("#sort").val()=="nameascending"){
        stampa=mange.sort(function(a,b){
        if(a.name > b.name)
        {
            return 1
        }
        else if(a.name < b.name)
        {
            return -1
        }
        else{
            return 0
        }
    });
}
else if ($("#sort").val()=="priceasc"){
    stampa=mange.sort(function(a,b){
       if(parseFloat(a.price.new) > parseFloat(b.price.new))
       {
           return 1
       }
       else if(parseFloat(a.price.new) < parseFloat(b.price.new))
       {
           return -1
       }
       else{
           return 0
       }
   });
}
else if ($("#sort").val()=="pricedesc"){
    stampa=mange.sort(function(a,b){
       if(parseFloat(a.price.new) > parseFloat(b.price.new))
       {
           return -1
       }
       else if(parseFloat(a.price.new) < parseFloat(b.price.new))
       {
           return 1
       }
       else{
           return 0
       }
   });
}
else{
    stampa = mange;
}
    if(stampa!=null){
        printMangas(stampa);
    }
}




//Filtering from checkboxes


function filterByCheck(){
    let prikazane=getLS("kolekcijaLS");
    if(prikazane==null){
        prikazane=getLS("svemangeLS");
    }
    let stampa1=[];
    let stampa2=[]; 
    let stampa3=[]; 
    if ($("#shonen").is(':checked')){
            stampa1=prikazane.filter(e=>e.type=="shonen");
    } 
    else {stampa1=[]}
    if ($("#seinen").is(':checked')){
            stampa2=prikazane.filter(e=>e.type=="seinen");
    } 
    else {stampa2=[]}
    if ($("#shoujo").is(':checked')){
            stampa3=prikazane.filter(e=>e.type=="shoujo");
    } 
    else {stampa3=[]}
    let stampa=[].concat(stampa1,stampa2,stampa3);
    if($("#shonen").is(':checked') || $("#seinen").is(':checked') || $("#shoujo").is(':checked')){
        printMangas(stampa);
    }
   else printMangas(prikazane);
    
}

//Cart 
function addToCart(){
    let idP = $(this).data("id");
    // console.log(idP)

    let productsCart = getLS("cart");
    if(productsCart == null){
        addFirstItemToCart();
        printNumberOfProducts();
    }
    else{
        if(productIsAlreadyInCart()){
            updateQty();
            printNumberOfProducts();
        }
        else{
            addItemToCart();
            printNumberOfProducts();
        }
    }

    function addFirstItemToCart(){
        let products = [
            {
                id: idP,
                qty: 1
            }
        ];

        setLS("cart", products);
    }

    function productIsAlreadyInCart(){
        return productsCart.filter(el => el.id == idP).length;
    }

    function updateQty(){
        let productsLS = getLS("cart");
        for(let p of productsLS){
            if(p.id == idP){
                p.qty++;
                break;
            }
        }

        setLS("cart", productsLS);
    }

    function addItemToCart(){
        let productLS = getLS("cart");

        productLS.push({
            id: idP,
            qty: 1
        });

        setLS("cart", productLS);
    }
}
var quantity=0;
function printNumberOfProducts(){
    let productsCart = getLS("cart");
    if(productsCart == null){
        $("#broj-proizvoda").html("(0 products)");
        console.log("problem?");
    }
    else{   
        quantity=productsCart.length;
        let numberOfProducts = quantity;
        let txt = quantity+" ";

        if(numberOfProducts == 1){
            txt = quantity+" "+"product";
        }
        else{
            txt =quantity+" products";
        }
        setLS("brojProizvodaLS",txt);
        $("#broj-proizvoda").html(`${txt}`)
    }
}


}

// Call the page-specific functions based on the page
const currentPage = window.location.pathname;
if (currentPage.includes("author.html")) {
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    showMoreAuthor();
} else if (currentPage.includes("cart.html")) {
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    cartFunctions();
} else if (currentPage.includes("contact.html")) {
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    contactFunctions();
} else if (currentPage.includes("index.html")) {
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    mainFunctions();
} else if (currentPage.includes("store.html")) {
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    storeFunctions();
}else{
    ajaxCallBack(BASEURL + "menu.json", header);
    ispisFootera();
    mainFunctions();
} 
