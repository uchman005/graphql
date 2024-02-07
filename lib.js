async function fetchData() {
  const token = localStorage.getItem("data");
  const graphqlEndpoint = "https://01.kood.tech/api/graphql-engine/v1/graphql";
  try {
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ query: query })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
let query = `
query {
    user {
        id
        login
        attrs
        totalDown
        totalUp
        transactions(where: {event: {id: {_eq: 85}}}) {
            type
            amount
            object {
                name
            }
        }
    }
}`;

function displayUserData(displayUser, XP = 0) {
  const { attrs,id } = displayUser;
  const { firstName, lastName, nationality, addressCity, tel, email } = attrs;
  const text = `
  <h1>User Data</h1>
  <p>Student: ${firstName} ${lastName}</p>
  <p>Profile ID: ${id}</p>
  <p>Nationality: ${nationality}</p>
  <p>City: ${addressCity}</p>
  <p>Tel: ${tel}</p>
  <p>Email: ${email}</p>
  <p>TotalXp: ${XP}</p>
  `;
  userData.innerHTML = text;
}
function displayAudit(totalUp = 0, totalDown = 0) {
  new Chart("audits", {
    type: "pie",
    data: {
      labels: ['Audits done', 'Audits recieved'],
      datasets: [{
        backgroundColor: ['green', 'white'],
        data: [totalUp, totalDown]
      }]
    },
    options: {
      title: {
        display: true,
        text: "Audit chart"
      }
    }
  });
}
function displayProjects(titles = [], amounts = []) {
  new Chart("projects", {
    type: "bar",
    data: {
      labels: titles,
      datasets: [{
        backgroundColor: 'green',
        data: amounts,
        label: 'Xp points'
      }]
    },
    options: {
      title: {
        display: true,
        text: "Projects chart"
      }
    }
  });
}
async function login(event) {
  event.preventDefault();
  loginBtn.innerText = "Logging in...";
  const { value: username } = usernameInput;
  const { value: password } = passwordInput;
  const credentials = btoa(`${username}:${password}`);
  try {
    const response = await fetch("https://01.kood.tech/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + credentials
      }
    });
    if (!response.ok) {
      loginBtn.innerText = "Log in";
      title.innerText = "Invalid credentials";
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    localStorage.setItem("data", data);
    usernameInput.value = "";
    passwordInput.value = "";
    title.innerText = "PROFILE";
    loginBtn.innerText = "Log in";
    loginContainer.classList.add('hide');
    authContainer.classList.remove('hide');
    const responseData = await fetchData();
    const { user } = responseData;
    const {totalUp, totalDown}= user[0]
    let totalXPPoints = 0;
    const amounts = [];
    const titles = [];
    user[0].transactions.forEach((item) => {
      if (item.type === 'xp') {
        totalXPPoints += item.amount;
        amounts.push(item.amount);
        titles.push(item.object.name);
      }
    });
    displayAudit(totalUp, totalDown);
    displayProjects(titles, amounts);
    displayUserData(user[0], totalXPPoints);
  } catch (error) {
    loginBtn.innerText = "Log in";
    errorText.innerText = error.message;
    errorText.style.color = "white";
  }

}
function logout() {
  localStorage.removeItem('data');
  authContainer.classList.add('hide');
  loginContainer.classList.remove('hide');
  title.innerText = "Log in";
  errorText.innerText = "";
}
function checkLoginStatus() {
  const dataCookie = localStorage.getItem("data");
  if (!dataCookie) {
    title.innerText = "Log in";
    loginContainer.classList.remove('hide');
    authContainer.classList.add('hide');
    return;
  }
  fetchData().then((responseData) => {
    title.innerText = "PROFILE";
    const { user } = responseData;
    let totalXPPoints = 0;
    const amounts = [];
    const titles = [];
    user[0].transactions.forEach((item) => {
      if (item.type === 'xp') {
        totalXPPoints += item.amount;
        amounts.push(item.amount);
        titles.push(item.object.name);
      }
    });
    const { totalUp, totalDown } = user[0];
    displayAudit(totalUp, totalDown);
    displayProjects(titles, amounts);
    displayUserData(user[0], totalXPPoints);
  })
  authContainer.classList.remove('hide');
  loginContainer.classList.add('hide');
}
