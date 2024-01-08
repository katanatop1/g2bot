// ==UserScript==
// @name         AutoPlay
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  GangstersPL Bot
// @author       Nieznany
// @match        https://g2.gangsters.pl/*
// @icon         https://g2.gangsters.pl/images/g2/module/weapon/icon.png
// @require      https://cdn.jsdelivr.net/npm/tesseract.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @run-at       document-end
// ==/UserScript==
(async function () {
    'use strict';
    const thisVersion = '1.1.1';
  
    try {
      // autologin email i haslo
      const autologin_email = '';
      const autologin_password = '';
  
      // axios + version check
      function injectAxios() {
        const axiosScript = document.createElement('script');
        axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios@1.6.4/dist/axios.min.js';
        axiosScript.async = true;
        document.head.appendChild(axiosScript);
        axiosScript.onload = async function () {
          const res = await axios.get('https://raw.githubusercontent.com/katanatop1/g2bot/master/bot.user.js');
          const version = res.data.split('\n')[3].replaceAll(' ', '').replaceAll('\r', '').split('version')[1];
          if (Number(version.split('.')[0]) > Number(thisVersion.split('.')[0])) {
            Notifier.notifyByMsg('error', `<b style='color: yellow;'>UWAGA! STARA WERSJA SKRYPTU</b><br> Twoja: ${thisVersion} Nowa: ${version}<br>Kliknij TUTAJ aby zaktualizować!`, 'https://github.com/katanatop1/g2bot/raw/main/bot.user.js');
          } else if (Number(version.split('.')[1]) > Number(thisVersion.split('.')[1])) {
            Notifier.notifyByMsg('warning', `<b style='color: red;'>UWAGA! STARA WERSJA SKRYPTU</b><br> Twoja: ${thisVersion} Nowa: ${version}<br>Kliknij TUTAJ aby zaktualizować!`, 'https://github.com/katanatop1/g2bot/raw/main/bot.user.js');
          } else if (Number(version.split('.')[2] || 0) > Number(thisVersion.split('.')[2])) {
            Notifier.notifyByMsg('information', `<b style='color: red;'>UWAGA! STARA WERSJA SKRYPTU</b><br> Twoja: ${thisVersion} Nowa: ${version}<br>Kliknij TUTAJ aby zaktualizować!`, 'https://github.com/katanatop1/g2bot/raw/main/bot.user.js');
          }
        };
      }
      injectAxios();
  
      // font awesome
      function injectFontAwesome() {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fontAwesome);
      }
      injectFontAwesome();
  
      // utils
      const updateData = (item, key, value) => {
        const data = JSON.parse(localStorage.getItem(item)) || {};
        data[key] = value;
        localStorage.setItem(item, JSON.stringify(data));
      };
  
      const getData = (item, key) => {
        const data = JSON.parse(localStorage.getItem(item)) || {};
        return data[key];
      };
  
      const parsesStrToNum = (str) => {
        const numericValue = parseFloat(str.replace(/[^\d.-]/g, ''));
        return numericValue;
      };
  
      const wait = async (ms) => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };
  
      const generateColorGradient = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          const ratio = i / (numColors - 1);
          const r = Math.floor(150 * ratio);
          const g = Math.floor(150 * (1 - ratio));
          const b = 0;
          colors.push(`rgb(${r},${g},${b})`);
        }
        return colors;
      };
  
      const urlIncludes = (url) => {
        return window.location.href.includes(url);
      };
      // end utils
  
      // attack stripe
      const tryAttack = (powerInPercentage, attackBar) => {
        const [maxPower, minPower] = [0, 255];
        const power = (maxPower - minPower) * (powerInPercentage / 100) + minPower;
        if (attackBar) {
          attackBar.style.top = `${power}px`;
          attackBar.click();
        }
      };
  
      if (getData('attackStripe', 'full')) {
        setInterval(() => {
          const attackBar = document.querySelector('#attack-stripe-bar');
          if (attackBar) {
            setInterval(() => {
              tryAttack(100, attackBar);
            }, 1);
          }
        }, 200);
      }
  
      // captcha
      if (document.querySelector('.captchaTextBox')) {
        const selfClick = async () => {
          const checkboxes = Array.from(document.querySelectorAll('[type="checkbox"]'));
          const button = document.querySelector('[type="submit"]');
          const backgroundImage = document.querySelector('.captchaTextBox').style?.backgroundImage;
  
          // auto captcha switches
          const getTextFromImage = async () => {
            const { createWorker } = Tesseract;
            const worker = await createWorker();
            await worker.load();
            await worker.loadLanguage('pol');
            await worker.initialize('pol');
            const url = `https://g2.gangsters.pl/${backgroundImage.split('"')[1]}`;
            const result = await worker.recognize(url);
            await worker.terminate();
            window.setTimeout(() => {
              // deleteAllCookies();
              // window.setTimeout(() => {
              //    location.reload();
              // }, 2000);
              let audio = new Audio('/sounds/default_notify.mp3');
              window.setInterval(() => audio.play(), 2250);
            }, 10000);
            return result.data.text;
          };
          const ocrResult = await getTextFromImage();
  
          const ocrResultsEasier = [...ocrResult.toLowerCase().replaceAll(' ', '').replaceAll('\n', '')].join('');
          if (ocrResultsEasier.includes('drugiorazpiątykwadrat') || ocrResultsEasier.includes('drugiorazpiatykwadrat')) {
            checkboxes[1].checked = true;
            checkboxes[4].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('dwaśrodkowekwadraty') || ocrResultsEasier.includes('dwasrodkowekwadraty')) {
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('dwakwadratyodlewej')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('dwakwadratyodprawej')) {
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('ostatnikwadratorazdwaśrodkowe') || ocrResultsEasier.includes('ostatnikwadratorazdwasrodkowe')) {
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('pierwszykwadratorazdwaśrodkowe') || ocrResultsEasier.includes('pierwszykwadratorazdwasrodkowe')) {
            checkboxes[0].checked = true;
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('trzeciiostatnikwadrat')) {
            checkboxes[2].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('drugiiprzedostatnikwadrat')) {
            checkboxes[1].checked = true;
            checkboxes[6].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('drugiorazpiatykwadrat')) {
            checkboxes[1].checked = true;
            checkboxes[4].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('czterykwadratyodlewej')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            checkboxes[3].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('czterykwadratyodprawej')) {
            checkboxes[4].checked = true;
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('pierwszyorazczwartykwadrat')) {
            checkboxes[0].checked = true;
            checkboxes[3].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('wszystkiekwadratypozaostatnim')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('wszystkiekwadratypozapierwszym')) {
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('wszystkiekwadratypozaśrodkowymi') || ocrResultsEasier.includes('wszystkiekwadratypozasrodkowymi')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('wszystkiekwadraty')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            checkboxes[3].checked = true;
            checkboxes[4].checked = true;
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('trzykwadratyodlewej')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('trzykwadratyodprawej')) {
            checkboxes[5].checked = true;
            checkboxes[6].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (
            ocrResultsEasier.includes('codrugikwadrat(zaczynającodpierwszegozprawej)') ||
            ocrResultsEasier.includes('codrugikwadrat(zaczynajacodpierwszegozprawej)') ||
            ocrResultsEasier.includes('codrugikwadrat(zaczynajacodplerwszegozprawej)')
          ) {
            checkboxes[1].checked = true;
            checkboxes[3].checked = true;
            checkboxes[5].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('codrugikwadrat(zaczynającodpierwszegozlewej)') || ocrResultsEasier.includes('codrugikwadrat(zaczynajacodpierwszegozlewej)')) {
            checkboxes[0].checked = true;
            checkboxes[2].checked = true;
            checkboxes[4].checked = true;
            checkboxes[6].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('pierwszyiostatnikwadrat') || ocrResultsEasier.includes('pierwszy|ostatnikwadrat')) {
            checkboxes[0].checked = true;
            checkboxes[7].checked = true;
            button.click();
            return;
          } else if (ocrResultsEasier.includes('template')) {
            checkboxes[0].checked = true;
            checkboxes[1].checked = true;
            checkboxes[2].checked = true;
            button.click();
            return;
          } else {
            console.log(ocrResult, ocrResultsEasier, 'nie opracowane');
            let audio = new Audio('/sounds/default_notify.mp3');
            window.setInterval(() => audio.play(), 2250);
            return;
          }
        };
        window.setTimeout(() => selfClick(), 400);
      }
  
      // back from profile
      if (urlIncludes('/profil.html')) {
        window.history.back();
      }
  
      // autologin
      if (urlIncludes('login.html') && getData('autologin', 'enabled')) {
        const loginBtn = document.querySelector('[value="Zaloguj się"]');
        const emailValue = document.querySelector('[name="email"]');
        const passValue = document.querySelector('[name="pass"]');
        emailValue.value = autologin_email || 'Błąd! Nie podano emaila w ustawieniach skryptu!';
        passValue.value = autologin_password;
        loginBtn.click();
      }
  
      // profil
      if (urlIncludes('/index.php?id=9')) {
        const regex = /\d+/g;
        const biznesValue = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(1) > span:nth-child(10)');
        let biznesBonus = 0;
        if (biznesValue) {
          const biznes = biznesValue.innerText.replace(' ', '').match(regex);
          biznesBonus = Number(biznes[0]);
        }
  
        const dziwkiValue = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(1) > span:nth-child(7)');
        let dziwkiBonus = 0;
        if (dziwkiValue) {
          const dziwki = dziwkiValue.innerText.replace(' ', '').match(regex);
          dziwkiBonus = Number(dziwki[0]);
        }
  
        let salary = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(1) > div:nth-child(1)').innerText.split(':')[1];
        let salaryBonus = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(1) > div:nth-child(1) > font')?.innerText.replace(',', '.').replace('(', '').replace(')', '').replace('+', '').replace('%', '') || 0;
        salaryBonus = Number(salaryBonus);
        salary = Number(salary.replace('zł/h', '').replaceAll(' ', ''));
        updateData('salary', 'salary', salary);
        updateData('salary', 'salaryBonus', salaryBonus);
        updateData('salary', 'biznesBonus', biznesBonus);
        updateData('salary', 'dziwkiBonus', dziwkiBonus);
        const pvpStats = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(2)');
        const win = Number(document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(2)').getElementsByTagName('b')[1].innerText.replace(' ', ''));
        const lose = Number(document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(2)').getElementsByTagName('b')[2].innerText.replace(' ', ''));
        const newB = document.createElement('b');
        newB.innerText = `${(win / lose).toFixed(3)}`;
        pvpStats.innerHTML += 'Winratio: ';
        pvpStats.appendChild(newB);
  
        const boxes = document.querySelector('#s > div.centerBox > div > div:nth-child(2)');
        const boxInfo = document.querySelector('#s > div.centerBox > div > div:nth-child(2) > div');
        const scriptInfo = boxInfo.cloneNode(true);
        scriptInfo.innerHTML = '';
        scriptInfo.style.marginTop = '5px';
        scriptInfo.style.display = 'grid';
        scriptInfo.style.justifyContent = 'center';
        scriptInfo.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        boxes.appendChild(scriptInfo);
  
        // attackStripe settings
        const attackDiv = document.createElement('div');
        attackDiv.style.margin = '3px';
        attackDiv.style.borderRadius = '10px';
        attackDiv.style.width = 'fit-content';
        attackDiv.style.background = '#2e3035';
        attackDiv.style.padding = '5px';
        attackDiv.style.color = '#fff';
        attackDiv.style.fontSize = '12px';
        attackDiv.style.fontWeight = 'bold';
        attackDiv.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
        attackDiv.style.width = '150px';
        attackDiv.style.display = 'flex';
        attackDiv.style.flexDirection = 'column';
        attackDiv.style.alignItems = 'center';
        attackDiv.setAttribute('class', 'tooltip');
        attackDiv.setAttribute('data-tippy-content', 'Automatyczne atakowanie na 100%');
        scriptInfo.appendChild(attackDiv);
        attackDiv.appendChild(document.createElement('div')).innerHTML = `<div  style='text-align: center;' tips='atak'>Auto Atak 100%</div>`;
        const attackToggle = document.createElement('button');
        attackToggle.textContent = `${getData('attackStripe', 'full') ? 'Włączono' : 'Wyłączono'}`;
        attackToggle.style.background = getData('attackStripe', 'full') ? '#238823' : '#D2222D';
        attackToggle.style.margin = '3px';
        attackToggle.style.borderRadius = '10px';
        attackToggle.style.width = 'fit-content';
        attackToggle.addEventListener('click', async function () {
          const toggle = getData('attackStripe', 'full');
          if (toggle) {
            updateData('attackStripe', 'full', false);
            this.textContent = `Wyłączono`;
            this.style.background = '#D2222D';
          } else {
            updateData('attackStripe', 'full', true);
            this.textContent = `Włączono`;
            this.style.background = '#238823';
          }
        });
        attackDiv.appendChild(attackToggle);
  
        // collect mission settings
        const collectDiv = document.createElement('div');
        collectDiv.style.margin = '3px';
        collectDiv.style.borderRadius = '10px';
        collectDiv.style.width = 'fit-content';
        collectDiv.style.background = '#2e3035';
        collectDiv.style.padding = '5px';
        collectDiv.style.color = '#fff';
        collectDiv.style.fontSize = '12px';
        collectDiv.style.fontWeight = 'bold';
        collectDiv.style.width = '150px';
        collectDiv.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
        collectDiv.style.display = 'flex';
        collectDiv.style.flexDirection = 'column';
        collectDiv.style.alignItems = 'center';
        collectDiv.setAttribute('class', 'tooltip');
        collectDiv.setAttribute('data-tippy-content', 'Automatyczne odbieranie misji');
        collectDiv.appendChild(document.createElement('div')).innerHTML = `<div style='text-align: center;'>Odbierać misje?</div>`;
        scriptInfo.appendChild(collectDiv);
  
        const missionToggle = document.createElement('button');
        missionToggle.textContent = `${getData('mission', 'collect') ? 'Włączono' : 'Wyłączono'}`;
        missionToggle.style.background = getData('mission', 'collect') ? '#238823' : '#D2222D';
        missionToggle.style.margin = '3px';
        missionToggle.style.borderRadius = '10px';
        missionToggle.style.width = 'fit-content';
        missionToggle.addEventListener('click', async function () {
          const toggle = getData('mission', 'collect');
          if (toggle) {
            updateData('mission', 'collect', false);
            this.textContent = `Wyłączono`;
            this.style.background = '#D2222D';
          } else {
            updateData('mission', 'collect', true);
            this.textContent = `Włączono`;
            this.style.background = '#238823';
          }
        });
        collectDiv.appendChild(missionToggle);
  
        // sort business settings
        const businessDiv = document.createElement('div');
        businessDiv.style.margin = '3px';
        businessDiv.style.borderRadius = '10px';
        businessDiv.style.width = 'fit-content';
        businessDiv.style.background = '#2e3035';
        businessDiv.style.padding = '5px';
        businessDiv.style.color = '#fff';
        businessDiv.style.fontSize = '12px';
        businessDiv.style.fontWeight = 'bold';
        businessDiv.style.width = '150px';
        businessDiv.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
        businessDiv.style.display = 'flex';
        businessDiv.style.flexDirection = 'column';
        businessDiv.style.alignItems = 'center';
        businessDiv.setAttribute('class', 'tooltip');
        businessDiv.setAttribute('data-tippy-content', 'Sortowanie biznesów<br>Obliczenia mogą być niedokładne');
        businessDiv.appendChild(document.createElement('div')).innerHTML = `<div style='text-align: center;'>Kalkulator biznesów (beta)</div>`;
        scriptInfo.appendChild(businessDiv);
  
        const businessToggle = document.createElement('button');
        businessToggle.textContent = `${getData('business', 'sort') ? 'Włączono' : 'Wyłączono'}`;
        businessToggle.style.background = getData('business', 'sort') ? '#238823' : '#D2222D';
        businessToggle.style.margin = '3px';
        businessToggle.style.borderRadius = '10px';
        businessToggle.style.width = 'fit-content';
        businessToggle.addEventListener('click', async function () {
          const toggle = getData('business', 'sort');
          if (toggle) {
            updateData('business', 'sort', false);
            this.textContent = `Wyłączono`;
            this.style.background = '#D2222D';
          } else {
            updateData('business', 'sort', true);
            this.textContent = `Włączono`;
            this.style.background = '#238823';
          }
        });
        businessDiv.appendChild(businessToggle);
  
        // sort whores settings
        const whoresDiv = document.createElement('div');
        whoresDiv.style.margin = '3px';
        whoresDiv.style.borderRadius = '10px';
        whoresDiv.style.width = 'fit-content';
        whoresDiv.style.background = '#2e3035';
        whoresDiv.style.padding = '5px';
        whoresDiv.style.color = '#fff';
        whoresDiv.style.fontSize = '12px';
        whoresDiv.style.fontWeight = 'bold';
        whoresDiv.style.width = '150px';
        whoresDiv.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
        whoresDiv.style.display = 'flex';
        whoresDiv.style.flexDirection = 'column';
        whoresDiv.style.alignItems = 'center';
        whoresDiv.setAttribute('class', 'tooltip');
        whoresDiv.setAttribute('data-tippy-content', 'Sortowanie dziwek<br>Obliczenia mogą być niedokładne');
        whoresDiv.appendChild(document.createElement('div')).innerHTML = `<div style='text-align: center;'>Kalkulator dziwek (beta)</div>`;
        scriptInfo.appendChild(whoresDiv);
  
        const whoresToggle = document.createElement('button');
        whoresToggle.textContent = `${getData('business', 'sort') ? 'Włączono' : 'Wyłączono'}`;
        whoresToggle.style.background = getData('business', 'sort') ? '#238823' : '#D2222D';
        whoresToggle.style.margin = '3px';
        whoresToggle.style.borderRadius = '10px';
        whoresToggle.style.width = 'fit-content';
        whoresToggle.addEventListener('click', async function () {
          const toggle = getData('whores', 'sort');
          if (toggle) {
            updateData('whores', 'sort', false);
            this.textContent = `Wyłączono`;
            this.style.background = '#D2222D';
          } else {
            updateData('whores', 'sort', true);
            this.textContent = `Włączono`;
            this.style.background = '#238823';
          }
        });
        whoresDiv.appendChild(whoresToggle);
  
        // autologin settings
        const autologinDiv = document.createElement('div');
        autologinDiv.style.margin = '3px';
        autologinDiv.style.borderRadius = '10px';
        autologinDiv.style.width = 'fit-content';
        autologinDiv.style.background = '#2e3035';
        autologinDiv.style.padding = '5px';
        autologinDiv.style.color = '#fff';
        autologinDiv.style.fontSize = '12px';
        autologinDiv.style.fontWeight = 'bold';
        autologinDiv.style.width = '150px';
        autologinDiv.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
        autologinDiv.style.display = 'flex';
        autologinDiv.style.flexDirection = 'column';
        autologinDiv.style.alignItems = 'center';
        autologinDiv.setAttribute('class', 'tooltip');
        autologinDiv.setAttribute('data-tippy-content', 'Automatyczne logowanie<br>Musisz podać email i hasło w ustawieniach skryptu!');
        autologinDiv.appendChild(document.createElement('div')).innerHTML = `<div style='text-align: center;'>Autologin</div>`;
  
        const autologinToggle = document.createElement('button');
        autologinToggle.textContent = `${getData('autologin', 'enabled') ? 'Włączono' : 'Wyłączono'}`;
        autologinToggle.style.background = getData('autologin', 'enabled') ? '#238823' : '#D2222D';
        autologinToggle.style.margin = '3px';
        autologinToggle.style.borderRadius = '10px';
        autologinToggle.style.width = 'fit-content';
        autologinToggle.addEventListener('click', async function () {
          const toggle = getData('autologin', 'enabled');
          if (toggle) {
            updateData('autologin', 'enabled', false);
            this.textContent = `Wyłączono`;
            this.style.background = '#D2222D';
          } else {
            updateData('autologin', 'enabled', true);
            this.textContent = `Włączono`;
            this.style.background = '#238823';
          }
        });
        autologinDiv.appendChild(autologinToggle);
        scriptInfo.appendChild(autologinDiv);
  
        const leftBottomBox = document.querySelectorAll('.leftBottomBox');
        leftBottomBox.forEach((box) => box.remove());
        const leftTopBox = document.querySelectorAll('.leftTopBox');
        leftTopBox.forEach((box) => box.remove());
        const leftBox = document.querySelectorAll('.leftBox');
        leftBox.forEach((box) => {
          box.style.padding = '10px 5px';
          box.style.margin = '10px';
        });
  
        const rightBottomBox = document.querySelectorAll('.rightBottomBox');
        rightBottomBox.forEach((box) => box.remove());
        const rightTopBox = document.querySelectorAll('.rightTopBox');
        rightTopBox.forEach((box) => box.remove());
        const rightBox = document.querySelectorAll('.rightBox');
        rightBox.forEach((box) => {
          box.style.padding = '10px';
          box.style.margin = '10px';
        });
  
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
      }
  
      // misje
      const collect = async () => {
        const data = await fetch(`?module=missions`);
        const res = await data.text();
        const parser = new DOMParser();
        const document = parser.parseFromString(res, 'text/html');
        const buttonsArr = document.querySelector('#s > div.centerBox').querySelectorAll('input[type=hidden]:nth-child(3)');
        buttonsArr.forEach(async (button) => {
          const isDisabled = button.parentElement.querySelector('form > input.buttonGreen').disabled;
          if (!isDisabled) {
            await fetch('https://g2.gangsters.pl/action.php', {
              headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
                'cache-control': 'max-age=0',
                'content-type': 'application/x-www-form-urlencoded',
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Opera GX";v="102"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                Referer: 'module=missions',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
              },
              body: `module=missions&action=completeTask&taskId=${button.value}`,
              method: 'POST',
            });
            console.log('💸 Odebrano bilety za misje!');
          }
        });
      };
      const autoCollectMission = setInterval(async () => {
        if (getData('mission', 'collect')) {
          const now = new Date().getTime();
          const lastMissionCollect = getData('mission', 'last_collect_timestamp') || 0;
          const diff = now - lastMissionCollect;
          if (diff > 60000) {
            updateData('mission', 'last_collect_timestamp', now);
            updateData('mission', 'last_collect', new Date().toLocaleString());
            collect();
          }
        }
      }, 10000);
  
      // biznes
      if (urlIncludes('module=business&page=')) {
        if (getData('salary', 'biznesBonus') === null || getData('salary', 'salary') === null || !getData('business', 'sort')) return;
        const arr = [];
        const totalPages = document.querySelectorAll('#s > div.centerBox > div > h1:nth-child(3) > a').length;
        document.getElementsByClassName('pageTitle')[1].remove();
        document.getElementsByClassName('pageTitle')[1].remove();
        document.querySelectorAll('#s > div.centerBox > div > div').forEach((box) => {
          const title = box.querySelector('b').innerText;
          if (!title.includes('zł')) box.remove();
        });
        const promises = [];
        for (let i = 1; i <= totalPages; i++) {
          const promise = fetch(`?module=business&page=${i}`)
            .then((response) => response.text())
            .then((html) => {
              const p = new DOMParser();
              const document = p.parseFromString(html, 'text/html');
              const boxes = document.querySelectorAll('#s > div.centerBox > div > div');
              boxes.forEach((box) => {
                let profit = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > div:nth-child(1) > b');
                if (profit) {
                  profit = Number(profit.innerText.replace('zł/h', '').replaceAll(' ', ''));
                  const biznesPrice = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > b').innerText.replace('zł', '').replaceAll(' ', '');
                  const biznesBonus = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > span');
                  let ringBonus = 1;
                  if (biznesBonus) {
                    if (biznesBonus.innerText.includes('25')) ringBonus = 1.25;
                    if (biznesBonus.innerText.includes('10')) ringBonus = 1.1;
                  }
                  const salaryBiznesBonus = getData('salary', 'biznesBonus') || 1;
                  const salary = getData('salary', 'salary') || 1;
                  const profitFormula = (salary * (profit * (1 + 0.01 * salaryBiznesBonus) * ringBonus)) / biznesPrice / 3600;
                  const biznesTitle = box.querySelector('table > tbody > tr > td:nth-child(2) > div > b');
                  const newDiv = document.createElement('div');
                  const buyButton = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(1) > input.button');
                  buyButton.addEventListener('click', async function () {
                    const form = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(1)');
                    form.submit();
                  });
                  const sellButton = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(2) > input.button');
                  sellButton?.addEventListener('click', async function () {
                    const form = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(2)');
                    form.submit();
                  });
                  newDiv.innerText = `Opłacalność: ${profitFormula.toFixed(0)}`;
                  biznesTitle.appendChild(newDiv);
                  arr.push(box);
                }
              });
            });
          promises.push(promise);
        }
        await Promise.all(promises);
        arr.sort((a, b) => Number(b.querySelector('div > b > div').innerText.split(':')[1]) - Number(a.querySelector('div > b > div').innerText.split(':')[1]));
  
        const colors = generateColorGradient(arr.length);
        arr.forEach((box, i) => {
          const firstBox = document.querySelector('#s > div.centerBox');
          box.style.backgroundColor = colors[i];
          firstBox.appendChild(box);
        });
      }
  
      // dziwki
      if (urlIncludes('module=whores&page=')) {
        if (getData('salary', 'dziwkiBonus') === null || getData('salary', 'salary') === null || !getData('whores', 'sort')) return;
        const arr = [];
        const totalPages = document.querySelectorAll('#s > div.centerBox > div > h1:nth-child(3) > a').length;
        document.getElementsByClassName('pageTitle')[1].remove();
        document.getElementsByClassName('pageTitle')[1].remove();
        document.querySelectorAll('#s > div.centerBox > div > div').forEach((box) => {
          const title = box.querySelector('div').innerText;
          if (!title.includes('zł')) box.remove();
        });
        const promises = [];
        for (let i = 1; i <= totalPages; i++) {
          const promise = fetch(`?module=whores&page=${i}`)
            .then((response) => response.text())
            .then((html) => {
              const p = new DOMParser();
              const document = p.parseFromString(html, 'text/html');
              const boxes = document.querySelectorAll('#s > div.centerBox > div > div');
              boxes.forEach((box) => {
                let profit = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > div:nth-child(1) > b');
                if (profit) {
                  profit = Number(profit.innerText.replace('zł/h', '').replaceAll(' ', ''));
                  const whorePrice = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > b').innerText.replace('zł', '').replaceAll(' ', '');
                  const whoreBonus = box.querySelector('table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > span');
                  let ringBonus = 1;
                  if (whoreBonus) {
                    if (whoreBonus.innerText.includes('25')) ringBonus = 1.25;
                    if (whoreBonus.innerText.includes('10')) ringBonus = 1.1;
                  }
                  const salaryWhoreBonus = getData('salary', 'dziwkiBonus') || 1;
                  const salary = getData('salary', 'salary') || 1;
                  const profitFormula = (salary * (profit * (1 + 0.01 * salaryWhoreBonus) * ringBonus)) / whorePrice / 3600;
                  const biznesTitle = box.querySelector('table > tbody > tr > td:nth-child(2) > div > b');
                  const newDiv = document.createElement('div');
                  const buyButton = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(1) > input.button');
                  buyButton.addEventListener('click', async function () {
                    const form = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(1)');
                    form.submit();
                  });
                  const sellButton = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(2) > input.button');
                  sellButton?.addEventListener('click', async function () {
                    const form = box.querySelector('table > tbody > tr > td:nth-child(3) > form:nth-child(2)');
                    form.submit();
                  });
                  newDiv.innerText = `Opłacalność: ${profitFormula.toFixed(0)}`;
                  biznesTitle.appendChild(newDiv);
                  arr.push(box);
                }
              });
            });
          promises.push(promise);
        }
        await Promise.all(promises);
        arr.sort((a, b) => Number(b.querySelector('div > b > div').innerText.split(':')[1]) - Number(a.querySelector('div > b > div').innerText.split(':')[1]));
        const colors = generateColorGradient(arr.length);
        arr.forEach((box, i) => {
          const firstBox = document.querySelector('#s > div.centerBox');
          box.style.backgroundColor = colors[i];
          firstBox.appendChild(box);
        });
      }
  
      // bar
      if (urlIncludes('module=chatroom')) {
        const td = document.querySelector('#s > div.centerBox > div:nth-child(3) > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
        const input = document.querySelector('#\\31 4 > input.text');
  
        if (td && input) {
          const newDiv = document.createElement('div');
          setInterval(() => {
            const clearNumber = input.value.replaceAll(' ', '');
            newDiv.textContent = `⚡${(Number(clearNumber) * 100).toLocaleString()} `;
          }, 100);
          td.appendChild(newDiv);
          const drinkKamikaze = document.querySelector('#\\31 4 > input.buttonSmall');
          const drinkMax = document.createElement('button');
          drinkMax.textContent = `Wypij max 🍸`;
          drinkMax.style.background = '#2e3035';
          drinkMax.style.color = '#fff';
          drinkMax.style.borderRadius = '10px';
          drinkMax.style.margin = '3px';
          drinkMax.style.border = 'none';
          drinkMax.style.cursor = 'pointer';
          drinkMax.style.fontSize = '12px';
          drinkMax.style.fontWeight = 'bold';
          drinkMax.style.textShadow = '0 -1px 0 rgba(0,0,0,.25)';
          drinkMax.style.width = 'fit-content';
          drinkMax.addEventListener('click', async function () {
            const max = parsesStrToNum(document.querySelector('#s > div.centerBox > div:nth-child(3) > table > tbody > tr > td:nth-child(1)').innerText.replaceAll('\n', '').split(':')[1]);
            input.value = max;
            drinkKamikaze.click();
          });
          const form = document.querySelector('#\\31 4');
          form.appendChild(drinkMax);
        }
        const eTicket = document.querySelector('#s > div.centerBox > div.box > span:nth-child(1) > span');
        if (eTicket) {
          const etValue = Number(eTicket.innerText.replaceAll(' ', ''));
          const energy = document.querySelector('#s > div.centerBox > div.box > span:nth-child(3)');
          energy.innerText = `${energy.innerText}\nŁącznie energii⚡${(etValue * 100).toLocaleString()}`;
          const clonedText = energy.cloneNode(true);
          const eTicketPrice = Number(document.querySelector('#passCost').innerText.replaceAll(' ', ''));
          const eTicketPriceField = document.querySelector('#passes > b');
          const money = document.querySelector('#p > div:nth-child(9) > div:nth-child(1) > span:nth-child(2)').getAttribute('data-value');
          clonedText.innerText = `\n(${Math.floor(money / eTicketPrice).toLocaleString()})\n⚡${(Math.floor(money / eTicketPrice) * 100).toLocaleString()}`;
          eTicketPriceField.appendChild(clonedText);
          document.querySelector('#passes > br:nth-child(3)').remove();
        }
      }
  
      // napady
      if (urlIncludes('id=59&option=3')) {
        document.title = 'Napady';
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }
  
      // strzelnica
      if (urlIncludes('module=weapon&action=')) {
        document.title = 'STRZELNICA';
        const name = 'strzelnica';
        const textBox = document.querySelector('#s > div.centerBox > div > div > div:nth-child(2)');
  
        // settings div
        const customBox = document.createElement('div');
        customBox.style.display = 'flex';
        customBox.style.flexDirection = 'column';
        customBox.style.alignItems = 'center';
        customBox.style.justifyContent = 'center';
        customBox.style.margin = '3px';
        customBox.style.borderRadius = '10px';
        customBox.style.padding = '5px';
        customBox.innerHTML += `<b>Ustawienia:</b>`;
  
        // toggle upgrade
        const toggleUpgrade = document.createElement('button');
        const color = getData(name, 'enabled') || false;
        toggleUpgrade.textContent = `Ulepszanie ${color ? 'ON' : 'OFF'}`;
        toggleUpgrade.style.background = !color ? '#D2222D' : '#238823';
        toggleUpgrade.style.margin = '3px';
        toggleUpgrade.style.borderRadius = '10px';
        toggleUpgrade.setAttribute('class', 'tooltip');
        toggleUpgrade.setAttribute('data-tippy-content', 'Ulepszać?');
        toggleUpgrade.addEventListener('click', async function () {
          const value = getData(name, 'enabled') || false;
          if (!value) {
            updateData(name, 'enabled', true);
            toggleUpgrade.style.background = 'green';
            toggleUpgrade.innerText = 'Ulepszanie ON';
          } else {
            updateData(name, 'enabled', false);
            toggleUpgrade.style.background = 'red';
            toggleUpgrade.innerText = 'Ulepszanie OFF';
          }
        });
        customBox.appendChild(toggleUpgrade);
        customBox.appendChild(document.createElement('div')).innerHTML = `Ulepszaj do poziomu:`;
  
        // max upgrade
        const input = document.createElement('input');
        input.type = 'number';
        input.style.borderRadius = '10px';
        input.style.border = 'none';
        input.style.color = '#fff';
        input.style.margin = '3px';
        input.style.background = '#FF681E';
        input.style.textAlign = 'center';
        input.style.maxWidth = '104px';
        input.setAttribute('class', 'tooltip');
        input.setAttribute('data-tippy-content', 'Do którego poziomu ulepszać');
        input.value = getData(name, 'maxUpgrade') || 0;
        input.addEventListener('input', function () {
          const value = Number(input.value);
          updateData(name, 'maxUpgrade', value);
        });
        customBox.appendChild(input);
        const currentLevel = parseInt(document.querySelector('#s > div.centerBox > div > div > div:nth-child(6) > div').innerText);
  
        const eta = customBox.appendChild(document.createElement('div'));
        eta.innerHTML = `ETA: ${new Date((getData(name, 'maxUpgrade') - currentLevel) * 1800000 + Date.now()).toLocaleString()}`;
        eta.setAttribute('class', 'tooltip');
        eta.setAttribute('data-tippy-content', 'Szacowany czas ulepszania (dokładność ~30minut)');
        textBox.appendChild(customBox);
  
        const currLvl = Number(document.querySelector('#s > div.centerBox > div > div > div:nth-child(6) > div').innerText);
        input.min = currLvl;
        const currStorage = getData(name, 'maxUpgrade') || 0;
        if (currStorage < currLvl) updateData(name, 'maxUpgrade', currLvl);
        input.value = getData(name, 'maxUpgrade');
        input.addEventListener('input', function () {
          const value = Number(input.value);
          if (value < currLvl) value = currLvl;
          updateData(name, 'maxUpgrade', value);
        });
  
        const checkLevel = (lvl) => {
          if (lvl > currLvl) return true;
          return false;
        };
        setInterval(() => {
          if (getData(name, 'enabled')) {
            const upgradeButton = document.getElementsByClassName('buttonGreen')[0];
            if (upgradeButton && checkLevel(getData(name, 'maxUpgrade')) && getData(name, 'enabled')) upgradeButton.click();
          }
        }, 1000);
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
      }
  
      // vip
      if (urlIncludes('module=vip')) {
        let button = undefined;
        const boxes = document.querySelectorAll('#s > div.centerBox > div > div');
        boxes.forEach((box, i) => {
          const b = box.querySelector('table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input[type=hidden]:nth-child(3)');
          if (b !== null) button = b;
          if (!box.querySelector('table > tbody > tr > td:nth-child(1) > div:nth-child(2)')) return;
          const name = `vip_${i}`;
          const fBox = box.querySelector('table > tbody > tr > td:nth-child(1)');
  
          // settings div
          const customBox = document.createElement('div');
          customBox.style.display = 'flex';
          customBox.style.flexDirection = 'column';
          customBox.style.alignItems = 'center';
          customBox.style.justifyContent = 'center';
          customBox.style.margin = '3px';
          customBox.style.borderRadius = '10px';
          customBox.style.padding = '5px';
          customBox.innerHTML += `<b>Ustawienia:</b>`;
          fBox.appendChild(customBox);
  
          // toggle upgrade
          const toggleUpgrade = document.createElement('button');
          const color = getData(name, 'enabled') || false;
          if (!getData(name, 'enabled')) {
            updateData(name, 'enabled', false);
          }
          toggleUpgrade.textContent = `Ulepszanie ${color === true ? 'ON' : 'OFF'}`;
          toggleUpgrade.style.background = color === false ? '#D2222D' : '#238823';
          toggleUpgrade.style.margin = '3px';
          toggleUpgrade.style.borderRadius = '10px';
          toggleUpgrade.setAttribute('class', 'tooltip');
          toggleUpgrade.setAttribute('data-tippy-content', 'Ulepszać?');
          toggleUpgrade.addEventListener('click', async function () {
            const value = getData(name, 'enabled') || false;
            if (value) {
              updateData(name, 'enabled', false);
              toggleUpgrade.style.background = 'red';
              toggleUpgrade.innerText = 'Ulepszanie OFF';
            } else {
              updateData(name, 'enabled', true);
              toggleUpgrade.style.background = 'green';
              toggleUpgrade.innerText = 'Ulepszanie ON';
            }
          });
          const currLvl = parseInt(box.querySelector('table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div:nth-child(1) > b').innerHTML);
          const currStorage = getData(name, 'maxUpgrade') || 0;
          if (currStorage < currLvl) updateData(name, 'maxUpgrade', currLvl);
  
          // max upgrade
          const input = document.createElement('input');
          input.style.maxWidth = '100px';
          input.style.minHeight = '23px';
          input.type = 'number';
          input.min = currLvl;
          input.style.borderRadius = '10px';
          input.style.color = '#fff';
          input.style.border = 'none';
          input.style.background = '#FF681E';
          input.style.textAlign = 'center';
          input.setAttribute('class', 'tooltip');
          input.setAttribute('data-tippy-content', 'Do którego poziomu ulepszać');
          input.value = getData(name, 'maxUpgrade') || 0;
          input.addEventListener('input', function () {
            const value = Number(input.value);
            if (value < currLvl) value = currLvl;
            updateData(name, 'maxUpgrade', value);
          });
          customBox.appendChild(toggleUpgrade);
          customBox.appendChild(document.createElement('div')).innerHTML = `Ulepszaj do poziomu:`;
          customBox.appendChild(input);
        });
  
        document.title = 'VIP';
        function checkMoney(p) {
          const selector = document.querySelector(`#s > div.centerBox > div > div:nth-child(${4 + p}) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > div:nth-child(2) > b`);
          const parsePrice = Number(selector.innerText.replace('zł', '').replaceAll(' ', ''));
          const money = Number(document.querySelector('#p > div:nth-child(9) > div:nth-child(1) > span:nth-child(2)').textContent.replace('zł', '').replaceAll(' ', ''));
          if (parsePrice < money) return true;
          selector.style.color = 'red';
          if (!selector.innerHTML.includes('<i class=')) {
            selector.innerHTML += ` <div class='tooltip' data-tippy-content='Brak pieniędzy!'><i class="fa-solid fa-triangle-exclamation fa-shake" style="color: yellow;"></i></div>`;
          }
          return false;
        }
        function checkLevel(lvl, p) {
          const selector = document.querySelector(`#s > div.centerBox > div > div:nth-child(${4 + p}) > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div:nth-child(1) > b`);
          const l = parseInt(selector.innerHTML);
          if (lvl > l) {
            if (p !== 0) {
              const timeNow = new Date().getTime();
              const endTime = timeNow + (lvl - l - 1) * 1800000;
              if (!selector.innerHTML.includes('<i class="fa-solid')) {
                selector.innerHTML += ` <i class="fa-solid fa-cog fa-spin" style="color: #238823;"></i><div class='tooltip' data-tippy-content='Przewidywany czas! (dokładność ~30minut z kontem pro)'> <br>ETA: ${new Date(
                  endTime,
                ).toLocaleString()}</div>`;
              }
            }
            return true;
          }
          if (!selector.innerHTML.includes('✅')) {
            selector.innerHTML += ` <a class='tooltip' data-tippy-content='Ukończono'>✅</a>`;
          }
          return false;
        }
        setInterval(() => {
          const options = {
            budynek_vip: getData('vip_1', 'enabled'),
            prywatna_strzelnica: getData('vip_2', 'enabled'),
            sala_treningowa: getData('vip_3', 'enabled'),
            baza_wojskowa: getData('vip_4', 'enabled'),
            harem: getData('vip_5', 'enabled'),
            klub_nocny: getData('vip_6', 'enabled'),
            rezydencja_alfonsow: getData('vip_7', 'enabled'),
            apartamentowiec_biznesmenow: getData('vip_8', 'enabled'),
            magazyn_broni: getData('vip_9', 'enabled'),
            sklad_opancerzenia: getData('vip_10', 'enabled'),
          };
  
          const budynek_vip = document.querySelector('#s > div.centerBox > div > div:nth-child(4) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_1', 'maxUpgrade'), 0) && checkMoney(0) && budynek_vip && options.budynek_vip) {
            updateData('vip_1', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_1', 'lastUpgrade_timestamp', Date.now());
            budynek_vip.click();
          }
  
          const prywatna_strzelnica = document.querySelector('#s > div.centerBox > div > div:nth-child(6) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_2', 'maxUpgrade'), 2) && checkMoney(2) && prywatna_strzelnica && options.prywatna_strzelnica) {
            updateData('vip_2', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_2', 'lastUpgrade_timestamp', Date.now());
            prywatna_strzelnica.click();
          }
          const sala_treningowa = document.querySelector('#s > div.centerBox > div > div:nth-child(8) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_3', 'maxUpgrade'), 4) && checkMoney(4) && sala_treningowa && options.sala_treningowa) {
            updateData('vip_3', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_3', 'lastUpgrade_timestamp', Date.now());
            sala_treningowa.click();
          }
  
          const baza_wojskowa = document.querySelector('#s > div.centerBox > div > div:nth-child(10) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_4', 'maxUpgrade'), 6) && checkMoney(6) && baza_wojskowa && options.baza_wojskowa) {
            updateData('vip_4', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_4', 'lastUpgrade_timestamp', Date.now());
            baza_wojskowa.click();
          }
  
          const harem = document.querySelector('#s > div.centerBox > div > div:nth-child(12) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_5', 'maxUpgrade'), 8) && checkMoney(8) && harem && options.harem) {
            updateData('vip_5', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_5', 'lastUpgrade_timestamp', Date.now());
            harem.click();
          }
  
          const klub_nocny = document.querySelector('#s > div.centerBox > div > div:nth-child(14) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_6', 'maxUpgrade'), 10) && checkMoney(10) && klub_nocny && options.klub_nocny) {
            updateData('vip_6', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_6', 'lastUpgrade_timestamp', Date.now());
            klub_nocny.click();
          }
  
          const rezydencja_alfonsow = document.querySelector('#s > div.centerBox > div > div:nth-child(16) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_7', 'maxUpgrade'), 12) && checkMoney(12) && rezydencja_alfonsow && options.rezydencja_alfonsow) {
            updateData('vip_7', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_7', 'lastUpgrade_timestamp', Date.now());
            rezydencja_alfonsow.click();
          }
  
          const apartamentowiec_biznesmenow = document.querySelector('#s > div.centerBox > div > div:nth-child(18) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_8', 'maxUpgrade'), 14) && checkMoney(14) && apartamentowiec_biznesmenow && options.apartamentowiec_biznesmenow) {
            updateData('vip_8', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_8', 'lastUpgrade_timestamp', Date.now());
            apartamentowiec_biznesmenow.click();
          }
  
          const magazyn_broni = document.querySelector('#s > div.centerBox > div > div:nth-child(20) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_9', 'maxUpgrade'), 16) && checkMoney(16) && magazyn_broni && options.magazyn_broni) {
            updateData('vip_9', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_9', 'lastUpgrade_timestamp', Date.now());
            magazyn_broni.click();
          }
  
          const sklad_opancerzenia = document.querySelector('#s > div.centerBox > div > div:nth-child(22) > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > form > input.buttonGreen');
          if (checkLevel(getData('vip_10', 'maxUpgrade'), 18) && checkMoney(18) && sklad_opancerzenia && options.sklad_opancerzenia) {
            updateData('vip_10', 'lastUpgrade', new Date().toLocaleString());
            updateData('vip_10', 'lastUpgrade_timestamp', Date.now());
            sklad_opancerzenia.click();
          }
        }, 1000);
        setTimeout(
          () => {
            window.location.reload();
          },
          1000 * 600 * 30,
        );
        setTimeout(() => {
          tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
        }, 1000);
      }
  
      // kasyno
      if (urlIncludes('module=casino')) {
        const field = document.querySelector('#s > div.centerBox > div:nth-child(1) > div.box > div');
        if (!field) return;
  
        // toggle button
        const toggleButton = document.createElement('button');
        const auto_play = getData('kasyno', 'auto_play') || false;
        toggleButton.textContent = `Autoplay ${auto_play ? 'ON' : 'OFF'}`;
        toggleButton.style.background = auto_play ? '#238823' : '#D2222D';
        toggleButton.style.margin = '5px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.setAttribute('class', 'tooltip');
        toggleButton.setAttribute('data-tippy-content', 'Automatyczna gra na ruletce poprzez fetch() za 100% możliwej stawki;');
        toggleButton.addEventListener('click', () => {
          const isEnabled = getData('kasyno', 'auto_play') || false;
          if (isEnabled) {
            updateData('kasyno', 'auto_play', false);
            toggleButton.textContent = `Autoplay OFF`;
            toggleButton.style.background = '#D2222D';
          }
          if (!isEnabled) {
            updateData('kasyno', 'auto_play', true);
            toggleButton.textContent = `Autoplay ON`;
            toggleButton.style.background = '#238823';
          }
          window.location.reload();
        });
        field.appendChild(toggleButton);
  
        field.appendChild(document.createElement('br'));
        // max points
        const maxPoints = document.createElement('input');
        maxPoints.type = 'number';
        maxPoints.style.borderRadius = '10px';
        maxPoints.style.border = 'none';
        maxPoints.style.color = '#fff';
        maxPoints.style.margin = '3px';
        maxPoints.style.background = '#13921f';
        maxPoints.style.textAlign = 'center';
        maxPoints.style.maxWidth = '104px';
        maxPoints.setAttribute('class', 'tooltip');
        maxPoints.setAttribute('data-tippy-content', 'Maksymalna ilość punktów?');
        maxPoints.value = getData('kasyno', 'max_points') || 0;
        maxPoints.addEventListener('input', function () {
          const value = Number(maxPoints.value);
          if (value < 0) value = 0;
          updateData('kasyno', 'max_points', value);
        });
        field.appendChild(maxPoints);
  
        // min points
        const minPoints = document.createElement('input');
        minPoints.type = 'number';
        minPoints.style.borderRadius = '10px';
        minPoints.style.border = 'none';
        minPoints.style.color = '#fff';
        minPoints.style.margin = '3px';
        minPoints.style.background = '#c30020';
        minPoints.style.textAlign = 'center';
        minPoints.style.maxWidth = '104px';
        minPoints.setAttribute('class', 'tooltip');
        minPoints.setAttribute('data-tippy-content', 'Minimalna ilość punktów?');
        minPoints.value = getData('kasyno', 'min_points') || -5;
        minPoints.addEventListener('input', function () {
          const value = Number(minPoints.value);
          updateData('kasyno', 'min_points', value);
        });
        field.appendChild(minPoints);
  
        if (urlIncludes('action=showRoulette') && getData('kasyno', 'auto_play')) {
          const maxPoints = getData('kasyno', 'max_points') || 0;
          const minPoints = getData('kasyno', 'min_points') || -5;
          async function fetchData() {
            await wait(700);
            const html = await fetch(`https://g2.gangsters.pl/?module=casino&action=showRoulette#game`).then((response) => response.text());
            const p = new DOMParser();
            const document = p.parseFromString(html, 'text/html');
            const btn = document.querySelector('#playRoulette > div > div > table > tbody > tr:nth-child(13) > td > input');
            if (btn) {
              const maxBet = document.querySelector('#s > div.centerBox > div:nth-child(1) > div.box > div > div:nth-child(1) > div:nth-child(2) > b').innerText.replace('zł', '').replaceAll(' ', '');
              const points = document.querySelector('#rankInfoContainer > div:nth-child(1) > div:nth-child(3) > b').innerText;
  
              const request = await fetch('https://g2.gangsters.pl/?module=casino', {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                body: `action=playRoulette&_1=${maxBet}`,
                method: 'POST',
              });
              if (!request.url.includes('showCaptcha')) {
                const newBox1 = document.querySelector('#rankInfoContainer > div:nth-child(1)');
                const newBox2 = document.querySelector('#rankInfoContainer > div:nth-child(2)');
                window.document.querySelector('#rankInfoContainer > div:nth-child(1)').remove();
                window.document.querySelector('#rankInfoContainer > div:nth-child(1)').remove();
                window.document.querySelector('#rankInfoContainer').appendChild(newBox1);
                window.document.querySelector('#rankInfoContainer').appendChild(newBox2);
                window.document.querySelector('#rankInfoContainer > div:nth-child(1) > div:nth-child(3) > b').innerText = `${points} \n(${new Date().toLocaleString()})`;
                if (parseInt(points) >= maxPoints) return;
                if (parseInt(points) <= minPoints) return;
                return fetchData();
              } else {
                document.querySelector('#playRoulette > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > input').value = maxBet;
                return window.document.querySelector('#playRoulette > div > div > table > tbody > tr:nth-child(13) > td > input').click();
              }
            }
          }
          fetchData();
        }
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
      }
  
      // ring
      if (urlIncludes('module=ring')) {
        const name = 'ring';
        const textBox = document.querySelector('#s > div.centerBox > div.centerBlock > div');
  
        // settings div
        const customBox = document.createElement('div');
        customBox.style.display = 'flex';
        customBox.style.alignItems = 'center';
        customBox.style.flexDirection = 'column';
        customBox.style.justifyContent = 'center';
        customBox.innerHTML = `<br><b>Ustawienia:</b>`;
        textBox.appendChild(customBox);
  
        // toggle button
        const toggleButton = document.createElement('button');
        const auto_play = getData(name, 'enabled') || false;
        toggleButton.textContent = `Autoplay ${auto_play === true ? 'ON' : 'OFF'}`;
        toggleButton.style.background = auto_play === false ? '#D2222D' : '#238823';
        toggleButton.style.margin = '5px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.setAttribute('class', 'tooltip');
        toggleButton.setAttribute('data-tippy-content', 'Automatyczna gra');
        toggleButton.addEventListener('click', () => {
          const isEnabled = getData(name, 'enabled') || false;
          if (isEnabled === true) {
            updateData(name, 'enabled', false);
            toggleButton.textContent = `Autoplay OFF`;
            toggleButton.style.background = '#D2222D';
          }
          if (isEnabled === false) {
            updateData(name, 'enabled', true);
            toggleButton.textContent = `Autoplay ON`;
            toggleButton.style.background = '#238823';
          }
        });
        customBox.appendChild(toggleButton);
        const info = document.createElement('div');
        info.innerHTML = `Limit walk:`;
        customBox.appendChild(info);
  
        // max points
        const input = document.createElement('input');
        input.innerText = '123';
        input.type = 'number';
        input.min = 0;
        input.style.borderRadius = '10px';
        input.style.border = 'none';
        input.style.color = '#fff';
        input.style.margin = '3px';
        input.style.background = '#FF681E';
        input.style.textAlign = 'center';
        input.style.maxWidth = '104px';
        input.setAttribute('class', 'tooltip');
        input.setAttribute('data-tippy-content', 'Do tylu walk skrypt bedzie grać. Jeżeli w topce nie bedzie twojego nicku, skrypt będzie walczył aż pojawisz sie w topce i lub osiągniesz limit.');
        input.value = getData(name, 'maxPoints') || '0';
        input.addEventListener('input', function () {
          const value = Number(input.value);
          if (value < 0) value = 0;
          updateData(name, 'maxPoints', value);
        });
        customBox.appendChild(input);
  
        // status
        const status = document.createElement('div');
        status.id = 'status';
        customBox.appendChild(status);
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
  
        if (getData('ring', 'enabled') && !urlIncludes('action=')) {
          window.document.title = 'RING';
          setTimeout(() => {
            window.document.querySelector('#leftMenuIconRing').click();
          }, 7000);
  
          const isFight = window.document.querySelector('#s > div.centerBox > div:nth-child(4) > div:nth-child(3) > div:nth-child(1)');
          if (isFight) return;
          const html = await fetch(`https://g2.gangsters.pl/?module=ring&action=showRingRank`).then((response) => response.text());
          const p = new DOMParser();
          const document = p.parseFromString(html, 'text/html');
          let currPoints = 0;
          const table = document.querySelectorAll('#s > div.centerBox > div:nth-child(4) > div:nth-child(5) > table > tbody > tr');
          const username = document.querySelector('#p > div:nth-child(2) > div:nth-child(2)').innerText.split(' ')[1];
          table.forEach((row) => {
            const name = row.querySelector('td:nth-child(2) > a')?.innerText || '';
            if (username.includes(name)) {
              currPoints = Number(row.querySelector('td:nth-child(3)')?.innerText) || 0;
            }
          });
          const limit = getData(name, 'maxPoints');
          // const tableArr = [
          //   {
          //     Target: limit,
          //     Left: limit - currPoints,
          //     Current: currPoints,
          //   },
          // ];
          if (currPoints < limit) {
            const startFight = window.document.querySelector('#s > div.centerBox > div:nth-child(4) > div:nth-child(3) > form > input.button');
            if (startFight.value === 'Walcz') {
              startFight.click();
            }
          }
        }
      }
  
      // miasto
      if (urlIncludes('module=arena')) {
        document.title = 'MIASTO';
        const textBox = document.querySelector('#s > div.centerBox > div > div.centerBlock > div:nth-child(2)');
  
        // settings div
        const newDiv = document.createElement('div');
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';
        newDiv.style.flexDirection = 'column';
        newDiv.style.justifyContent = 'center';
        newDiv.innerHTML = `<br><b>Ustawienia:</b>`;
        textBox.appendChild(newDiv);
  
        // toggle button
        const toggleButton = document.createElement('button');
        const auto_play = getData('miasto', 'enabled') || false;
        toggleButton.textContent = `Autoplay ${auto_play === true ? 'ON' : 'OFF'}`;
        toggleButton.style.background = auto_play === false ? '#D2222D' : '#238823';
        toggleButton.style.margin = '5px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.setAttribute('class', 'tooltip');
        toggleButton.setAttribute('data-tippy-content', 'Automatyczna gra');
        toggleButton.addEventListener('click', () => {
          const isEnabled = getData('miasto', 'enabled') || false;
          console.log(isEnabled);
          if (isEnabled === true) {
            updateData('miasto', 'enabled', false);
            toggleButton.textContent = `Autoplay OFF`;
            toggleButton.style.background = '#D2222D';
          }
          if (isEnabled === false) {
            updateData('miasto', 'enabled', true);
            toggleButton.textContent = `Autoplay ON`;
            toggleButton.style.background = '#238823';
          }
        });
        newDiv.appendChild(toggleButton);
        setInterval(() => {
          if (getData('miasto', 'enabled')) {
            document.querySelector('[type="image"]')?.click();
            document.querySelector('[value="Zakończ pojedynek"]')?.click();
          }
        }, 250);
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
      }
  
      // tournament
      if (urlIncludes('module=tournament')) {
        function reload() {
          document.querySelector('#leftMenuIconTournament').click();
        }
        function deleteCookie(cookieName) {
          document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
          localStorage.removeItem('_grecaptcha');
        }
        document.title = 'TOURNAMENT';
        const textBox = document.querySelector('#s > div.centerBox > div:nth-child(3) > div');
  
        // settings div
        const newDiv = document.createElement('div');
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';
        newDiv.style.flexDirection = 'column';
        newDiv.style.justifyContent = 'center';
        newDiv.innerHTML = `<br><b>Ustawienia:</b>`;
        textBox.appendChild(newDiv);
  
        // toggle button
        const toggleButton = document.createElement('button');
        const auto_play = getData('tournament', 'enabled') || false;
        toggleButton.textContent = `Autoplay ${auto_play === true ? 'ON' : 'OFF'}`;
        toggleButton.style.background = auto_play === false ? '#D2222D' : '#238823';
        toggleButton.style.margin = '5px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.setAttribute('class', 'tooltip');
        toggleButton.setAttribute('data-tippy-content', 'Automatyczna gra');
        toggleButton.addEventListener('click', () => {
          const isEnabled = getData('tournament', 'enabled') || false;
          if (isEnabled === true) {
            updateData('tournament', 'enabled', false);
            toggleButton.textContent = `Autoplay OFF`;
            toggleButton.style.background = '#D2222D';
          }
          if (isEnabled === false) {
            updateData('tournament', 'enabled', true);
            toggleButton.textContent = `Autoplay ON`;
            toggleButton.style.background = '#238823';
          }
        });
        newDiv.appendChild(toggleButton);
  
        const attacks = ['Strzał z dystansu', 'Podwójny strzał', 'Walka wręcz', 'Ogień ciągły', 'Strzał z ukrycia'];
        setInterval(() => {
          if (getData('tournament', 'enabled')) {
            const myAttacks = document.querySelectorAll('#s > div.centerBox > div:nth-child(4) > div:nth-child(6) > div > img');
            if (!myAttacks) return;
            const eAttacks = document.querySelectorAll('#s > div.centerBox > div:nth-child(4) > div:nth-child(7) > div > img');
            const attacked = document.querySelector('#s > div.centerBox > div:nth-child(4) > div:nth-child(3) > div > div > div:nth-child(1)');
  
            const at_0_me = Object.values(myAttacks).filter((e) => e.src.includes('0.png'));
            const at_0 = Object.values(eAttacks).filter((e) => e.src.includes('0.png'));
            const at_1 = Object.values(eAttacks).filter((e) => e.src.includes('1.png'));
            const at_2 = Object.values(eAttacks).filter((e) => e.src.includes('2.png'));
            const at_3 = Object.values(eAttacks).filter((e) => e.src.includes('3.png'));
            const at_4 = Object.values(eAttacks).filter((e) => e.src.includes('4.png'));
            const at_5 = Object.values(eAttacks).filter((e) => e.src.includes('5.png'));
            let i = Math.floor(Math.random() * 5) + 1;
  
            if (at_0.length >= 4) {
              eAttacks.forEach((a) => {
                if (a.src.includes('0.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: Walkower ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
            if (at_1.length >= 4) {
              i = 5;
              eAttacks.forEach((a) => {
                if (a.src.includes('1.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: ${attacks[0]} ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
            if (at_2.length >= 4) {
              i = 1;
              eAttacks.forEach((a) => {
                if (a.src.includes('2.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: ${attacks[1]} ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
            if (at_3.length >= 4) {
              i = 2;
              eAttacks.forEach((a) => {
                if (a.src.includes('3.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: ${attacks[2]} ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
            if (at_4.length >= 4) {
              i = 3;
              eAttacks.forEach((a) => {
                if (a.src.includes('4.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: ${attacks[3]} ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
            if (at_5.length >= 4) {
              i = 4;
              eAttacks.forEach((a) => {
                if (a.src.includes('5.png')) {
                  a.style.border = '3px solid orange';
                  a.style.borderRadius = '50%';
                }
              });
              // console.info(`✅ Ostatnie 4 ataki przeciwnika: ${attacks[4]} ➡️ Wybieram atak ${attacks[i - 1]}`);
            }
  
            document.querySelector(`#attackType${i}`)?.click();
            const last = document.querySelector('#s > div.centerBox > div:nth-child(4) > div:nth-child(6) > div > img:nth-child(1)');
            setTimeout(() => {
              if (!attacked.innerText.includes('Wybrany')) console.info(`Sprawdzam walkowery... => ${at_0_me.length}`);
              if (last?.src.includes('0.png') && attacked && !attacked.innerText.includes('Wybrany')) {
                console.info('Czyszczę ciasteczka...');
                deleteCookie('PHPSESSID');
              }
              if (at_0.length >= 5 && attacked && !attacked.innerText.includes('Wybrany')) {
                console.info('Przechodze na google.com');
                window.location.href = 'https://www.google.com';
              }
            }, 10000);
            document.querySelector("[value='Dołącz!']")?.click();
          }
        }, 1000);
        tippy('[class="tooltip"]', { followCursor: true, placement: 'bottom', allowHTML: true, duration: 0 });
        setTimeout(reload, 15000);
      }
    } catch (error) {
      console.error(error);
      function dumpError(err) {
        let line = `<a style='color:red;'>`;
        if (typeof err === 'object') {
          if (err.message) {
            line += `<b style='color:red;'>Error: ${err.message}</b>`;
          }
          if (err.stack) {
            line += `<br>Stacktrace:`;
            line += `<br>====================`;
            line += `<br>${err.stack}`;
          }
        } else {
          line += `dumpError :: argument is not an object`;
        }
        line += `</a>`;
        return line;
      }
      Notifier.notifyByMsg('warning', `${dumpError(error)}`);
    }
  })();
  
  