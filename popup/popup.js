const userAgent = navigator.userAgent;
const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/\d+/);
const osMatch = userAgent.match(/(Windows NT|Mac OS X|Linux)/);
let architecture = userAgent.match(/(Win64|x64|WOW64)/) ? "win64" : "unknown";
let osName = "unknown";
if (osMatch) {
  switch (osMatch[0x1]) {
    case "Windows NT":
      osName = "Windows";
      break;
    case "Mac OS X":
      osName = "Mac OS";
      break;
    case "Linux":
      osName = 'Linux';
      break;
  }
}
if (osMatch && osMatch[0x1] === "Windows NT") {
  if (userAgent.includes("Windows NT 10.0")) {
    osName += " 10";
  } else {
    if (userAgent.includes("Windows NT 6.3")) {
      osName += " 8.1";
    } else {
      if (userAgent.includes("Windows NT 6.2")) {
        osName += " 8";
      } else if (userAgent.includes("Windows NT 6.1")) {
        osName += " 7";
      }
    }
  }
}
const outputUserAgent = (browserMatch ? browserMatch[0x0].split('/')[0x0] : "Unknown Browser") + " " + osName + " " + architecture;
document.addEventListener("DOMContentLoaded", () => {
  updateAnalytics();
  const _0x1a0765 = document.getElementById('csvFileInput');
  const _0x1c6dae = document.getElementById("delayLike");
  const _0x2d1e82 = document.getElementById('delayFollow');
  const _0x26546c = document.getElementById("delayNext");
  const _0x1a31c6 = document.getElementById('saveButton');
  const _0x2919fb = document.getElementById('startTask');
  const _0x57a228 = document.getElementById("activeBtn");
  const _0xba44cf = document.getElementById("keyInput");
  const _0x2c3661 = document.getElementById("dashboard");

  _0x2c3661.style.display = "flex";

  chrome.storage.local.get(['delayLike', "delayFollow", 'delayNext'], _0x26c685 => {
    if (_0x26c685.delayLike !== undefined) {
      _0x1c6dae.value = _0x26c685.delayLike;
    }
    if (_0x26c685.delayFollow !== undefined) {
      _0x2d1e82.value = _0x26c685.delayFollow;
    }
    if (_0x26c685.delayNext !== undefined) {
      _0x26546c.value = _0x26c685.delayNext;
    }
  });
  _0x1a31c6.addEventListener('click', () => {
    const _0x28be8e = _0x1c6dae.value;
    const _0x5c22d9 = _0x2d1e82.value;
    const _0x17dc31 = _0x26546c.value;
    const _0x729106 = _0x1a0765.files[0x0];
    if (_0x729106) {
      const _0x5b2a09 = new FileReader();
      _0x5b2a09.onload = _0x14bc17 => {
        const _0x5ac25f = _0x14bc17.target.result;
        const _0x4e3a58 = _0x5ac25f.split("\n").map(_0x456a4e => _0x456a4e.split(','));
        let _0x114efd = [];
        if (_0x4e3a58.length > 0x0) {
          _0x4e3a58.forEach(_0x3eae48 => {
            if (!_0x3eae48[0x0]) {
              return;
            }
            if (_0x3eae48) {
              function _0x598488(_0x553f92) {
                const _0x34dd52 = /https?:\/\/[^\s"']+/g;
                const _0x5a0efd = _0x553f92.match(_0x34dd52);
                return _0x5a0efd ? _0x5a0efd.join(" ") : '';
              }
              _0x114efd.push({
                'url': _0x598488(_0x3eae48[0x0])
              });
            }
          });
        }
        chrome.storage.local.set({
          'links': _0x114efd,
          'delayLike': _0x28be8e,
          'delayFollow': _0x5c22d9,
          'delayNext': _0x17dc31
        }, () => {
          updateAnalytics();
          alert("Данные сохранены!");
        });
      };
      _0x5b2a09.readAsText(_0x729106);
    } else {
      chrome.storage.local.set({
        'delayLike': _0x28be8e,
        'delayFollow': _0x5c22d9,
        'delayNext': _0x17dc31
      }, () => {
        alert("Задержки сохранены!");
      });
    }
  });
  _0x2919fb.addEventListener("click", () => {
    chrome.storage.local.get(["links", 'activeFollow', "activeLike"], function ({
      links: _0x34ebfe,
      activeFollow: _0x180706,
      activeLike: _0x2beec0
    }) {
      if (_0x180706 || _0x2beec0) {
        const _0x335ca6 = filterUrls(_0x34ebfe, _0x2beec0, _0x180706);
        if (!_0x335ca6 || _0x335ca6?.['length'] === 0x0) {
          return alert("Не найдены ссылки!");
        }
        chrome.storage.local.set({ 'currentUrl': _0x335ca6[0x0].url });
        window.open(_0x335ca6[0x0].url + "/pictures?activeTask=true");
      } else {
        alert("Нужно выбрать как минимум одно действие!");
      }
    });
  });
  fetch('https://sites.google.com/view/fet-bot/notification')
    .then(response => response.text())
    .then(data => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, 'text/html');

      let spans = doc.querySelectorAll('span');
      let targetSpan = Array.from(spans).find(span => span.textContent.startsWith('xkfreoiufdfgnmcnvirtuhgidfhjjgkdjqprhugerilg:'));

      if (targetSpan) {
        let notificationText = targetSpan.textContent.replace('xkfreoiufdfgnmcnvirtuhgidfhjjgkdjqprhugerilg:', '').trim();
        
        document.getElementById('notification').innerHTML = notificationText;
      }
    })
    .catch(error => console.error('Error:', error));

});
function updateAnalytics() {
  chrome.storage.local.get(["links", "activeLike", "activeFollow"], function ({
    links: _0x4c4b28,
    activeFollow: _0x51c7a2,
    activeLike: _0x8069ae
  }) {
    const _0x2ed98e = filterUrls(_0x4c4b28, _0x8069ae, _0x51c7a2);
    document.getElementById("totalLinks").textContent = _0x4c4b28?.["length"] || 0x0;
    document.getElementById("actionList").textContent = _0x2ed98e?.["length"] || 0x0;
    let _0x33f5c9 = 0x0;
    let _0x2040de = 0x0;
    _0x4c4b28.forEach(_0x3b78d6 => {
      if (_0x3b78d6.like) {
        _0x33f5c9++;
      }
      if (_0x3b78d6.follow) {
        _0x2040de++;
      }
    });
    document.getElementById("totalLiked").textContent = _0x33f5c9;
    document.getElementById("totalFollowed").textContent = _0x2040de;
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const _0x37b13f = document.getElementById('activeLike');
  const _0x58b4ed = document.getElementById("activeFollow");
  document.getElementById('clearDb').addEventListener("click", () => {
    const _0x2bcb29 = window.confirm("Are you sure you want to clear the database? ");
    if (_0x2bcb29) {
      chrome.storage.local.set({
        'links': []
      }, function () {
        updateAnalytics();
      });
    }
  });
  chrome.storage.local.get(["activeLike", "activeFollow"], function (_0x25714c) {
    _0x37b13f.checked = _0x25714c.activeLike || false;
    _0x58b4ed.checked = _0x25714c.activeFollow || false;
  });
  _0x37b13f.addEventListener("change", function () {
    chrome.storage.local.set({
      'activeLike': _0x37b13f.checked
    }, function () {
      updateAnalytics();
    });
  });
  _0x58b4ed.addEventListener('change', function () {
    chrome.storage.local.set({
      'activeFollow': _0x58b4ed.checked
    }, function () {
      updateAnalytics();
    });
  });
});
function filterUrls(_0x551849, _0x29470c, _0x18905a) {
  return _0x551849.filter(_0x4f2f99 => {
    if (_0x18905a && _0x29470c) {
      return !_0x4f2f99.like && !_0x4f2f99.follow;
    } else {
      if (_0x18905a) {
        return !_0x4f2f99.follow;
      } else {
        if (_0x29470c) {
          return !_0x4f2f99.like;
        }
      }
    }
    return false;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("exportDelete").addEventListener("click", () => {
    const _0x2f898e = window.confirm("Are you sure you want to delete all?");
    if (_0x2f898e) {
      chrome.storage.local.set({
        'collects': []
      }, function () {
        document.getElementById("normalUsers").textContent = 0x0;
        document.getElementById("vipUsers").textContent = 0x0;
        document.getElementById("usaUsers").textContent = 0x0;
      });
    }
  });
  chrome.storage.local.get(["collects"], function ({
    collects: _0x37d382
  }) {
    const _0x44bb87 = [];
    const _0x2ddf88 = [];
    const _0x187b41 = [];
    if (_0x37d382.length > 0x0) {
      _0x37d382.forEach(_0x3ac000 => {
        if (_0x3ac000.vip) {
          _0x2ddf88.push(_0x3ac000.username);
        } else {
          _0x44bb87.push(_0x3ac000.username);
        }
        if (_0x3ac000.usa) {
          _0x187b41.push(_0x3ac000.username);
        }
      });
    }
    document.getElementById("exportNormal").addEventListener("click", () => {
      if (_0x44bb87.length === 0x0) {
        return alert("Нечего экспортировать!");
      }
      let _0x11bddd = [];
      _0x44bb87.forEach(_0x48c74e => _0x11bddd.push({
        'url': _0x48c74e
      }));
      chrome.storage.local.set({
        'links': _0x11bddd
      }, function () {
        updateAnalytics();
      });
      return;
      const _0x52e106 = arrayToCSV(_0x44bb87);
      downloadCSV(_0x52e106, 'normal-users.csv');
    });
    document.getElementById('exportVIP').addEventListener("click", () => {
      if (_0x2ddf88.length === 0x0) {
        return alert("Нечего экспортировать!");
      }
      let _0x49f60a = [];
      _0x2ddf88.forEach(_0x4c8ddf => _0x49f60a.push({
        'url': _0x4c8ddf
      }));
      chrome.storage.local.set({
        'links': _0x49f60a
      }, function () {
        updateAnalytics();
      });
      return;
      const _0x1c3800 = arrayToCSV(_0x2ddf88);
      downloadCSV(_0x1c3800, 'vip-users.csv');
    });
    document.getElementById('exportUSA').addEventListener("click", () => {
      if (_0x187b41.length === 0x0) {
        return alert("Нечего экспортировать!");
      }
      let _0x2117ab = [];
      _0x187b41.forEach(_0x1dd4a3 => _0x2117ab.push({
        'url': _0x1dd4a3
      }));
      chrome.storage.local.set({
        'links': _0x2117ab
      }, function () {
        updateAnalytics();
      });
      return;
      const _0x38959a = arrayToCSV(_0x187b41);
      downloadCSV(_0x38959a, "usa-users.csv");
    });
    document.getElementById("normalUsers").textContent = _0x44bb87.length;
    document.getElementById('vipUsers').textContent = _0x2ddf88.length;
    document.getElementById('usaUsers').textContent = _0x187b41.length;
  });
  const _0x240dc5 = document.getElementById("contentUrl");
  const _0x40ce68 = document.getElementById("collectUsers");
  _0x40ce68.addEventListener('click', () => {
    if (!_0x240dc5.value?.startsWith("https://fetlife.com/") || !_0x240dc5.value.includes("/pictures/") && !_0x240dc5.value.includes("/videos/") && !_0x240dc5.value.includes("/posts/")) {
      return alert("Введите верную ссылку на контент!");
    }
    window.open(_0x240dc5.value.split('?')[0x0] + "?collectUsersMode=true");
  });
});
function arrayToCSV(_0x1272ce) {
  return _0x1272ce.map(_0x55c430 => "\"" + _0x55c430 + "\"").join("\n");
}
function downloadCSV(_0x565e65, _0x30c2d1) {
  const _0x56a5bb = new Blob([_0x565e65], {
    'type': "text/csv"
  });
  const _0x5e4dc8 = URL.createObjectURL(_0x56a5bb);
  const _0x3fa79e = document.createElement('a');
  _0x3fa79e.setAttribute("href", _0x5e4dc8);
  _0x3fa79e.setAttribute("download", _0x30c2d1);
  _0x3fa79e.click();
  URL.revokeObjectURL(_0x5e4dc8);
}

var modal = document.getElementById("modal");
var btn = document.getElementById("openModal");
var span = document.getElementById("closeModal");

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

