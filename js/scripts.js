const numEmployees = 12;
const url = `https://randomuser.me/api/?results=${numEmployees}&nat=us`;
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');

let 
  employees, 
  modalContainer, 
  modalCloseBtn, 
  modalPrev, 
  modalNext, 
  currentIndex, 
  employeeElements, 
  activeEmployees;
const elements = {};

fetch(url)
  .then(response => response.json())
  .then(data => {
    employees = data.results;
    activeEmployees = employees;
    createSearch();
    createCards();
  })
  .catch(error => console.log('There was an error:', error));

  const noResults = () => {
    gallery.innerHTML = '<h3>No results found</h3>';
  };

  const searchEmployees = search => {
    activeEmployees = !search ? employees : employees.filter(employee => {
      const name = `${employee.name.first} ${employee.name.last}`.toLowerCase();
      return name.includes(search);
    });

    activeEmployees.length === 0 ? noResults() : createCards();
  };

  const createSearch = () => {
    const search = `
      <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
      </form>`;
    searchContainer.insertAdjacentHTML('beforeend', search);

    const form = searchContainer.querySelector('form');
    const searchInput = document.getElementById('search-input');

    form.addEventListener('submit', event => {
      event.preventDefault();
      searchEmployees(searchInput.value.toLowerCase());
    });

    searchInput.addEventListener('keyup', () => searchEmployees(searchInput.value.toLowerCase()));
    searchInput.addEventListener('search', () => searchEmployees(searchInput.value.toLowerCase()));
  };


  const createCards = () => {
    gallery.innerHTML = '';
    activeEmployees.forEach(createCard);
  };

  const createCard = employee => {
    const { name, email, location, picture } = employee;
    const employeeCard = `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
          <p class="card-text">${email}</p>
          <p class="card-text cap">${location.city}, ${location.state}</p>
        </div>
      </div>`;
    gallery.insertAdjacentHTML('beforeend', employeeCard);

    const card = gallery.lastElementChild;
    card.addEventListener('click', () => createModal(employee));
  };

  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const updateModal = (change) => {
    currentIndex += change;
    const employee = activeEmployees[currentIndex];
    const { name, email, location, picture, phone, dob } = employee;
    const address = `${location.street.number} ${location.street.name}, ${location.city}, ${location.state}, ${location.postcode}`;

    elements.picture.src = picture.large;
    elements.name.textContent = `${name.first} ${name.last}`;
    elements.email.textContent = email;
    elements.city.textContent = location.city;
    elements.phone.textContent = phone;
    elements.address.textContent = `${address}`;
    elements.birthday.textContent = `Birthday: ${formatDate(dob.date)}`;

    modalPrev.disabled = currentIndex === 0;
    modalNext.disabled = currentIndex === activeEmployees.length - 1;
  };

  const createModal = employee => {
    currentIndex = activeEmployees.indexOf(employee);
    const { name, email, location, picture, phone, dob } = employee;
    const address = `${location.street.number} ${location.street.name}, ${location.city}, ${location.state}, ${location.postcode}`;

    const modal = `
      <div class="modal-container">
        <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
            <img class="modal-img" src="${picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${location.city}</p>
            <hr>
            <p class="modal-text">${phone}</p>
            <p class="modal-text">${address}</p>
            <p class="modal-text">Birthday: ${formatDate(dob.date)}</p>
          </div>
        </div>
        <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
      </div>`;
    gallery.insertAdjacentHTML('beforeend', modal);

    modalContainer = gallery.lastElementChild;
    modalCloseBtn = document.getElementById('modal-close-btn');
    modalCloseBtn.addEventListener('click', () => modalContainer.remove());

    modalPrev = document.getElementById('modal-prev');
    modalNext = document.getElementById('modal-next');

    modalPrev.disabled = currentIndex === 0;
    modalNext.disabled = currentIndex === activeEmployees.length - 1;

    modalPrev.addEventListener('click', () => updateModal(-1));
    modalNext.addEventListener('click', () => updateModal(1));

    elements.picture = modalContainer.querySelector('.modal-img');
    elements.name = elements.picture.nextElementSibling;
    elements.email = elements.name.nextElementSibling;
    elements.city = elements.email.nextElementSibling;
    elements.phone = elements.city.nextElementSibling.nextElementSibling;
    elements.address = elements.phone.nextElementSibling;
    elements.birthday = elements.address.nextElementSibling;
  };