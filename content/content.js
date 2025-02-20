if (window.location.href.includes("activeTask=true")) {
  const randomNumber = Math.floor(Math.random() * 301) + 0x1f4;
  setTimeout(() => {
    smoothScrollToBottom();
  }, randomNumber);
  getFirstPost();
}

if (window.location.href.startsWith("https://fetlife.com")) {
  const extLicenseKey = localStorage.getItem("extLicenseKey");
  localStorage.setItem("extLicenseKey", extLicenseKey);
}

if (window.location.href.includes("handlePost=true")) {
  const randomNumber = Math.floor(Math.random() * 301) + 0x1f4;
  setTimeout(() => {
    smoothScrollToBottom();
  }, randomNumber);
  handlePost();
}

if (window.location.href.startsWith("https://fetlife.com/users/") && !window.location.href.includes("activeTask=true")) {
  chrome.storage.local.set({ 'currentUrl': window.location.href });
  handleNext();
}

function handlePost() {
  chrome.storage.local.get(["links", "activeLike", "activeFollow"], function ({
    links: links,
    activeLike: activeLike,
    activeFollow: activeFollow
  }) {
    if (activeLike) {
      likeThePost();
    } else if (activeFollow) {
      followThePost();
    }
  });
}

function likeThePost() {
  chrome.storage.local.get(["delayLike"], function ({
    delayLike: delayLike
  }) {
    delayLike = parseInt(delayLike);
    setTimeout(() => {
      const footer = document.querySelector("footer a");
      if (!footer.title.includes("Loved")) {
        footer.click();
      }
      updateLikeStatus();
      chrome.storage.local.get(["activeFollow"], function ({
        activeFollow: activeFollow
      }) {
        if (activeFollow) {
          followThePost();
        } else {
          handleNext();
        }
      });
    }, delayLike * 0x3e8);
  });
}

function followThePost() {
  chrome.storage.local.get(["delayFollow"], function ({
    delayFollow: delayFollow
  }) {
    delayFollow = parseInt(delayFollow);
    setTimeout(() => {
      const headerButton = document.querySelector("main header button");
      updateFollowStatus();
      if (!headerButton) {
        return handleNext();
      }
      if (!headerButton.getAttribute("class").includes("bg-transparent")) {
        headerButton.click();
      }
      handleNext();
    }, delayFollow * 0x3e8);
  });
}

function isLiked(_0x343996, _0x128822) {
  const _0x1019ad = _0x343996.find(_0x3123b3 => _0x3123b3.url === _0x128822);
  return _0x1019ad ? _0x1019ad.like : false;
}

function isFollowed(_0x52daf1, _0x369534) {
  const _0x2e4028 = _0x52daf1.find(_0x9bee4f => _0x9bee4f.url === _0x369534);
  return _0x2e4028 ? _0x2e4028.follow : false;
}

function handleNext() {
  chrome.storage.local.get(['links', "delayNext", "activeLike", "activeFollow", "currentUrl"], function ({
    links: links,
    delayNext: delayNext,
    activeLike: activeLike,
    activeFollow: activeFollow,
    currentUrl: currentUrl
  }) {
    delayNext = parseInt(delayNext);
    setTimeout(() => {
      const filteredUrls = filterUrls(links, activeLike, activeFollow, currentUrl);
      let nextUrl = filteredUrls[0x0];
      if (nextUrl) {
        chrome.storage.local.set({ 'currentUrl': nextUrl.url });
        window.location.replace(nextUrl.url + "/pictures?activeTask=true");
      } else {
        alert("Задача завершена!");
      }
    }, delayNext * 0x3e8);
  });
}


if (window.location.href.startsWith("https://fetlife.com/") && window.location.href.includes("/pictures/") && !window.location.href.includes("handlePost=true") && !window.location.href.includes("activeTask=true") && window.location.href.length < 0x26) {
  сonsole.log("Обработка поста");
  const list = document.querySelectorAll("li a");
  let noProfile = false;
  list.forEach(_0x577fec => {
    if (_0x577fec.href.includes("pictures")) {
      noProfile = true;
    }
  });
  if (!noProfile) {
    chrome.storage.local.get(["links", "activeLike", "activeFollow", "currentUrl"], function ({
      links: _0x115fe7,
      activeLike: _0x3f0d0d,
      activeFollow: _0x6948d2,
      currentUrl: currentUrl
    }) {
      let _0x2e34b6 = [];
      const _0x19750f = window.location.href;
      _0x115fe7.forEach(_0x3f151c => {
        if (_0x3f151c.url && _0x3f151c.url !== _0x19750f) {
          _0x2e34b6.push(_0x3f151c);
        }
      });
      chrome.storage.local.set({
        'links': _0x2e34b6
      }, function () {
        const _0x2a259f = filterUrls(_0x2e34b6, _0x3f0d0d, _0x6948d2, currentUrl);
        const _0x3a4713 = _0x2a259f[0x0];
        if (_0x3a4713) {
          window.location.replace(_0x3a4713.url + "/pictures?activeTask=true");
        } else {
          alert("Задача выполнена!");
        }
      });
    });
  }
}

function updateLikeStatus() {
  chrome.storage.local.get(['currentUrl'], function (result) {
    const currentUrl = result.currentUrl; 

    if (currentUrl) {
      chrome.storage.local.get(['links'], function ({ links }) {
        const updatedLinks = links.map(link => {
          if (link.url === currentUrl) {
            return {
              ...link,
              like: true
            };
          }
          return link;
        });

        chrome.storage.local.set({
          'links': updatedLinks
        });
      });
    } else {
      console.error('currentUrl not found in storage');
    }
  });
}


function updateFollowStatus() {
    chrome.storage.local.get(['currentUrl'], function (result) {
    const currentUrl = result.currentUrl;

    if (currentUrl) {
      chrome.storage.local.get(["links"], function ({ links }) {
        const updatedLinks = links.map(link => {
          if (link.url === currentUrl) {
            return {
              ...link,
              follow: true
            };
          }
          return link;
        });

        chrome.storage.local.set({
          'links': updatedLinks
        });
      });
    } else {
      console.error('currentUrl not found in storage');
    }
  });
}


function getFirstPost() {
  const _0x23bff9 = document.querySelectorAll("a.aspect-square");
  if (!_0x23bff9[0x0]) {
    chrome.storage.local.get(["links"], function ({
      links: _0x1d2a44
    }) {
      const _0x1b7548 = window.location.href.split("/pictures")[0x0];
      let _0x5301a0 = [];
      _0x1d2a44.forEach(_0xaff10 => {
        if (_0xaff10.url !== _0x1b7548) {
          _0x5301a0.push(_0xaff10);
        }
      });
      chrome.storage.local.set({
        'links': _0x5301a0
      }, function () {
        handleNext();
      });
    });
    return;
  }
  const _0x264a4f = Math.floor(Math.random() * 2001) + 0xbb8;
  setTimeout(() => {
    _0x23bff9[0x0].href = _0x23bff9[0x0].href + '?handlePost=true';
    _0x23bff9[0x0].click();
  }, _0x264a4f);
}

function getRandomSpeed(_0x2365d6, _0x5c5f0c) {
  return Math.random() * (_0x5c5f0c - _0x2365d6) + _0x2365d6;
}

function smoothScrollToBottom() {
  let _0x22e535 = 0x0;
  const _0xad9a31 = document.documentElement.scrollHeight;
  function _0x14f1c4() {
    const _0x3c78d5 = Math.random() * 500 + 0xc8;
    _0x22e535 += 0xa;
    window.scrollTo({
      'top': _0x22e535,
      'behavior': "smooth"
    });
    if (_0x22e535 < _0xad9a31) {
      setTimeout(_0x14f1c4, _0x3c78d5);
    }
  }
  _0x14f1c4();
}

function filterUrls(links, activeLike, activeFollow, currentUrl) {
  return links.filter(link => {
    if (link.url === currentUrl) {
      return false;
    }

    if (activeFollow && activeLike) {
      return !link.like && !link.follow;
    }
    
    if (activeFollow) {
      return !link.follow;
    }
    
    if (activeLike) {
      return !link.like;
    }
    
    return true;
  });
}


let userIndex = 0x0;
let checkAllBtn = 0x0;

if (window.location.href.includes("collectUsersMode")) {
  handleCollectUsers();
}

function handleCollectUsers() {
  createOverlay();
  const _0x134e88 = document.querySelectorAll("aside a");
  let _0x1848a9;
  _0x134e88.forEach(_0x48adc6 => {
    if (_0x48adc6.textContent.includes("view all")) {
      _0x1848a9 = _0x48adc6;
    }
  });
  if (!_0x1848a9 && checkAllBtn !== 0x5) {
    setTimeout(() => {
      handleCollectUsers();
    }, 0x3e8);
    checkAllBtn++;
    return;
  }
  if (_0x1848a9) {
    _0x1848a9.click();
  }
  setTimeout(() => {
    handleDataCollection();
  }, 0x7d0);
}

function handleDataCollection() {
  const randomDelay = Math.floor(Math.random() * 7001) + 0x1388;
  let urls = [];
  const links = document.querySelectorAll("aside a.link.block");
  links.forEach(link => {
    urls.push(link.href);
  });
  const currentUser = urls[userIndex];
  if (!currentUser) {
    return alert("Сбор пользователей завершен!");
  }
  userIndex++;
  document.getElementById("updateMessage").textContent = userIndex;
  fetch(currentUser, {
    'method': "GET",
    'headers': {
      'Accept': 'application/json',
      'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    }
  }).then(_0x474a6f => _0x474a6f.json()).then(_0x3291ef => {
    chrome.storage.local.get(['collects'], function ({
      collects: _0x4bf552
    }) {
      const _0x39e60e = _0x3291ef.core.genders[0x0].name;
      let _0x444b6c = [];
      if (_0x4bf552.length > 0x1) {
        _0x4bf552.forEach(_0x43da3f => {
          _0x444b6c.push(_0x43da3f.username);
        });
      }
      const _0x169bf7 = _0x3291ef.core.showBadge;
      const _0x469108 = JSON.stringify(_0x3291ef?.["currentUserRelation"]?.['location']).includes("United States");
      const _0x14aad1 = _0x39e60e === "Male" || _0x39e60e === "Man" || _0x39e60e === "boy";
      if (!_0x444b6c.includes(currentUser)) {
        if (_0x14aad1) {
          if (_0x169bf7) {
            _0x4bf552.push({
              'username': currentUser,
              'vip': true,
              'usa': _0x469108
            });
          } else {
            _0x4bf552.push({
              'username': currentUser,
              'vip': false,
              'usa': _0x469108
            });
          }
          chrome.storage.local.set({
            'collects': _0x4bf552
          }, function () {
            console.log("New user collected", currentUser);
          });
        }
      }
    });
    setTimeout(() => {
      handleDataCollection();
    }, randomDelay);
  })["catch"](_0xd7a38a => {
    setTimeout(() => {
      handleDataCollection();
    }, randomDelay);
  });
}

function createOverlay() {
  if (document.querySelector('.custom-overlay')) {
    return;
  }
  const customOverlay = document.createElement('div');
  customOverlay.classList.add("custom-overlay");
  const customBox = document.createElement("div");
  customBox.classList.add("custom-box");
  const boxTitle = document.createElement('h2');
  boxTitle.textContent = "FetLife Bot (фикс от Хербала 🌿) | t.me/look_im_model";
  boxTitle.classList.add('box-title');
  customBox.appendChild(boxTitle);
  const boxContent = document.createElement('p');
  boxContent.textContent = "Сбор юзеров... Ожидайте!";
  boxContent.classList.add("box-content");
  customBox.appendChild(boxContent);
  const processText = document.createElement("div");
  chrome.storage.local.get(['quantity'], function ({
    quantity: quantity
  }) {
    processText.innerHTML = "<p style='font-size:1.3rem'>Обработка... <span style=\" color: #00b894; font-weight: bold; \"><span id='updateMessage'>0</span></span></p>";
  });
  customBox.appendChild(processText);
  customOverlay.appendChild(customBox);
  document.body.appendChild(customOverlay);
}