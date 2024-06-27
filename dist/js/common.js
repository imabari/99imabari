function displayData(option) {
  fetch("data.json")
    .then((response) => response.json())
    .then((jsonData) => {
      let datesToShow = [];

      // Get today's date
      let now = new Date();

      let today = new Date(now.getTime() + 9 * 3600000);
      let todayDate = today.toISOString().split("T")[0];

      let yesterday = new Date(now.getTime() - 15 * 3600000);
      let yesterdayDate = yesterday.toISOString().split("T")[0];

      if (option === "today") {
        // Check if current time is after 8:30
        let nowHour = now.getHours();
        let nowMinute = now.getMinutes();

        if (nowHour < 8 || (nowHour === 8 && nowMinute < 30)) {
          // Get yesterday's date and add to the list of dates to show
          datesToShow.push(yesterdayDate);
          jsonData = jsonData.map((entry) => {
            if (entry.date === yesterdayDate) {
              entry.hospital = entry.hospital.filter((hospital) =>
                hospital.time.includes("翌日")
              );
            }
            return entry;
          });

          datesToShow.push(todayDate);
        } else if (nowHour < 17 || (nowHour === 17 && nowMinute <= 30)) {
          datesToShow.push(todayDate);
        } else {
          datesToShow.push(todayDate);
          jsonData = jsonData.map((entry) => {
            if (entry.date === todayDate) {
              entry.hospital = entry.hospital.filter(
                (hospital) => hospital.medical === "指定なし"
              );
            }
            return entry;
          });
        }
      } else if (option === "all") {
        datesToShow = jsonData.map((data) => data.date);
      }

      // Filter out data for the dates to show
      let filteredData = jsonData.filter((entry) =>
        datesToShow.includes(entry.date)
      );

      // HTMLのmain要素を選択します
      let mainElement = document.querySelector("section");

      // Filtered JSONデータをループして各日付の情報をHTMLに追加します
      filteredData.forEach((dateData) => {
        // 日付のサブヘッドを追加します
        let subhead = document.createElement("h3");
        subhead.classList.add("page-subhead");

        let link = document.createElement("a");
        link.href = "#";
        link.textContent = dateData.date_week;
        subhead.appendChild(link);

      // hrタグを追加
      let hrTag = document.createElement("hr");
      mainElement.appendChild(hrTag);

        mainElement.appendChild(subhead);

        // 各病院の情報をループしてカードを追加します
        dateData.hospital.forEach((hospital) => {
          let cardWrap = document.createElement("div");
          cardWrap.classList.add("card-wrap");

          let card = `
                    <div class="card">
                        <p class="subtitle">${hospital.medical}</p>
                        <p class="title"><a href='${hospital.link}'>${hospital.name}</a></p>
                        <p>${hospital.time}</p>
                        <p>${hospital.address}</p>
                        <p>${hospital.daytime ? `TEL <a href='tel:${hospital.daytime}'>${hospital.daytime}</a>` : ''}</p>
                        <div class="icon-wrap"><a href='${hospital.navi}'><button class="goto-button">ルート案内</button></a></div>
                    </div>
                `;

          cardWrap.innerHTML = card;
          mainElement.appendChild(cardWrap);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching the JSON data:", error);
    });
}