/* Add "https://api.ipify.org?format=json" statement
               this will communicate with the ipify servers in
               order to retrieve the IP address $.getJSON will
               load JSON-encoded data from the server using a
               GET HTTP request */
let ipAddress;
let PostOffices;

$.getJSON("https://api.ipify.org?format=json", function (data) {
  // Setting text of element P with id gfg
  $("#gfg").html(data.ip);
  ipAddress = data.ip;
  console.log(ipAddress);
});

let loc;
async function getLocation() {
  const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
  const data = await response.json();
  console.log(data);
  dataToUI(data);
}

async function getPostOffices(pincode) {
  const response = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  const POs = await response.json();
  console.log(POs[0]);
  return POs[0];
}

const container = document.getElementById("container");
async function dataToUI(data) {
  const listing = document.createElement("div");
  listing.classList.add("listing");

  let dateTime_str = new Date().toLocaleString("en-US", {
    timeZone: data.timezone,
  });

  let POS = await getPostOffices(data.postal);
  PostOffices = POS.PostOffice;
  //   console.log(POS.PostOffice);

  listing.innerHTML = `<div class="header">
<p class="">IP Address : ${ipAddress}</p>
<div class="top-grid">
  <div class="item">
    <p>Lat: ${data.latitude}</p>
    <p>Long: ${data.longitude}</p>
  </div>
  <div class="item">
    <p>City: ${data.city}</p>
    <p>Region: ${data.region}</p>
  </div>
  <div class="item">
    <p>Organization: ${data.org}</p>
    <p>HostName: ${data.asn}</p>
  </div>
</div>
</div>
<div class="map">
<h1>Your Current Location</h1>
<iframe
  src="https://maps.google.com/maps?q=${data.latitude}, ${data.longitude}&z=15&output=embed"
  width="700"
  height="500"
  frameborder="0"
  style="border: 0"
></iframe>
</div>
<div class="moreInfo">
<h2>More Information about you</h2>
<p>Time Zone: ${data.timezone}</p>
<p>Date and Time: ${dateTime_str}</p>
<p>Pin code: ${data.postal}</p>
<p>Message: ${POS.Message}</p>
</div>`;

  const address_container = document.createElement("div");
  address_container.classList.add("address_container");
  address_container.innerHTML = `<h2>Post Offices Near You</h2>
  <div class="search">
<input type="text"id="PS_search" placeholder="Search By Name" />
<button onclick="searchPOS()">Search</button></div>`;

  const post_cards = document.createElement("div");
  post_cards.classList.add("post_cards");
  for (let i = 0; i < POS.PostOffice.length; i++) {
    let card = createCard(POS.PostOffice[i]);
    post_cards.appendChild(card);
  }
  console.log(post_cards);
  address_container.appendChild(post_cards);
  listing.appendChild(address_container);

  container.innerHTML = "";
  container.appendChild(listing);
}

async function createCardContainer(POS) {
  const post_cards = document.createElement("div");
  post_cards.classList.add("post_cards");
  for (let i = 0; i < POS.length; i++) {
    let card = createCard(POS[i]);
    post_cards.appendChild(card);
  }
}

function createCard(cardData) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<p class="card_item">Name :${cardData.Name}</p>
<p class="card_item">Branch Type :${cardData.BranchType}</p>
<p class="card_item">Delivery Status: ${cardData.DeliveryStatus}</p>
<p class="card_item">District :${cardData.District}</p>
<p class="card_item">Division :${cardData.Division}</p>`;

  return card;
}

function searchPOS() {
  const input = document.getElementById("PS_search");
  const key = input.value.toLowerCase();
  const newArr = PostOffices.filter((obj) => {
    return obj.Name.toLowerCase().includes(key);
  });

  const cont = document.querySelector(".post_cards");
  cont.innerHTML = "";
  for (let i = 0; i < newArr.length; i++) {
    let card = createCard(newArr[i]);
    cont.appendChild(card);
  }
}
