var bookmarks = document.getElementById ('bookmarks');
var bookmarkName = document.getElementById ('bookmarkName');
var bookmarkURL = document.getElementById ('bookmarkURL');
var addBookMark = document.getElementById ('addBookMark');
var closeBookmarksFormBtn = document.querySelector ('.close-btn');
var closeBookmarksFormPath = document.querySelector ('.path');
var openBookmarksFormBtn = document.querySelector ('.open-btn');
var downloadBookmarksBtn = document.querySelector ('.downoladbookmarks');
var formContainer = document.getElementById ('formContainer');
var itemsContainer = document.getElementById ('itemsContainer');
var bookmarkForm = document.getElementById ('bookmarkForm');
var linkProtocolInput = document.getElementById ('bookmarkURLProtocol');
var imgUserTest = document.getElementById ('imgUserTest');
var indicator = document.getElementById ('indicatorSpin');
var errInfo = document.getElementById ('errorInfo');
var bookmarksFile = document.getElementById ('bookmarksFile');
var formBasicPart = document.getElementById ('formBasicPart');
var protocols = ['https://', 'http://'];
var linkRegex = /^(www\.|ww1\.|ww2\.|ww3\.){1,1}[a-zA-Z0-9-\.]{1,25}\./;
var typingTimer;
var bookmarkls = 'bookmarkls';
var visitsTime = 'visitsTime';
var doneTypingInterval = 5000;
var bookmarkNames = [];
var bookmarksArr = [];
var fileInUpload = false;
var uploadedobjs;

function catchError (error) {
  if (error != '') {
    errInfo.classList.replace ('d-none', 'd-block');
    errInfo.classList.add ('error');
    errInfo.innerText = error;
  } else {
    errInfo.classList.replace ('d-block', 'd-none');
  }
  setTimeout (() => {
    errInfo.classList.remove ('error');
  }, 100);
}

function validateURL () {
  return linkRegex.test (bookmarkURL.value);
}

function checkLinkProtocol () {
  switch (linkProtocolInput.value) {
    case protocols[0]:
      return true;
    case protocols[1]:
      return true;
    default:
      return false;
  }
}

function addBookmarkButtonTapped () {
  if (fileInUpload) {
    bookmarksArr = uploadedobjs;
    reloadBookmarks ();
    hideFormContainer ();
    bookmarksFile.value = '';
    fileInUpload = false
    isFileInUpload();
  } else {
    if (!isNameUnique (bookmarkName.value.trim ())) {
      bookmarkName.classList.add ('error');
      bookmarkName.focus ();
      catchError ('Bookmark Name Should Be Unique');
    } else if (!checkLinkProtocol ()) {
      linkProtocolInput.classList.add ('error');
      linkProtocolInput.focus ();
      catchError ('protocol should be http:// or https://');
    } else if (bookmarkName.value.trim () == '') {
      bookmarkName.classList.add ('error');
      catchError ('bookmark name is required');
    } else if (validateURL ()) {
      catchError ('');
      checkIfImageExists (
        `https://logo.clearbit.com/ ${linkProtocolInput.value}${bookmarkURL.value}`,
        exists => {
          if (exists) {
            var bookmark = {
              name: bookmarkName.value,
              url: `${linkProtocolInput.value}${bookmarkURL.value}`,
              image: `https://logo.clearbit.com/${linkProtocolInput.value}${bookmarkURL.value}`,
            };
            addBookmarksToarray (bookmark);
            clearInputs ();
            hideFormContainer ();
          } else {
            var bookmark = {
              name: bookmarkName.value,
              url: `${linkProtocolInput.value}${bookmarkURL.value}`,
              image: `assets/img-placeholder.jpeg`,
            };
            addBookmarksToarray (bookmark);
            clearInputs ();
            hideFormContainer ();
          }
        }
      );
    } else {
      catchError ('bookmark url maxmum char is 25 and no spaces between');
      bookmarkURL.classList.add ('error');
      bookmarkURL.focus ();
    }
    setTimeout (() => {
      bookmarkURL.classList.remove ('error');
      bookmarkName.classList.remove ('error');
      linkProtocolInput.classList.remove ('error');
    }, 100);
  }
}

function addBookmarksToarray (obj) {
  bookmarksArr.push (obj);
  reloadBookmarks ();
}
function reloadBookmarks () {
  localStorage.setItem (bookmarkls, JSON.stringify (bookmarksArr));
  displayBookmarks ();
}

function getBookmarksFromLSToArray () {
  var ls = localStorage.getItem(bookmarkls);
  if (ls != null) {
    bookmarksArr = JSON.parse (ls);
    displayBookmarks ();
  }
}

function clearInputs () {
  bookmarkName.value = '';
  bookmarkURL.value = '';
  console.log ('done');
}

(function () {
  getBookmarksFromLSToArray ();
  addBookMark.addEventListener ('click', function () {
    addBookmarkButtonTapped ();
  });
  bookmarkName.addEventListener ('input', function () {
    if (bookmarkName.value != '') {
      var upperChar = bookmarkName.value.toUpperCase ();
      bookmarkName.value = upperChar;
    } else {
      clearInputs ();
    }
  });
  bookmarksFile.addEventListener ('change', function (event) {
    if (event.target.files[0] != undefined) {
      console.log (event.target.files[0]);
      fileOnChange (event);
    } else {
      catchError ('');
      fileInUpload = false;
      isFileInUpload ();
      bookmarksFile.value = '';
    }
  });
  bookmarkURL.addEventListener ('input', function () {
    clearTimeout (typingTimer);
    if (bookmarkURL.value) {
      typingTimer = setTimeout (doneTypingUrl, doneTypingInterval);
    }
  });
  bookmarkName.addEventListener ('input', function () {
    bookmarkURL.value = `www.${bookmarkName.value.toLowerCase ()}.com`;
    doneTypingUrl ();
  });

  closeBookmarksFormBtn.addEventListener ('click', function () {
    hideFormContainer ();
  });
  closeBookmarksFormPath.addEventListener ('click', function () {
    hideFormContainer ();
  });
  openBookmarksFormBtn.addEventListener ('click', function () {
    appearFormContainer ();
  });
  downloadBookmarksBtn.addEventListener ('click', function () {
    downloadBookmarks ();
  });
  formContainer.addEventListener ('keydown', function (event) {
    if (event.code == 'Enter') {
      event.preventDefault ();
      addBookmarkButtonTapped ();
    }
  });
  firstTimeVisit ();
  var lastTwoKeys = {key1: '', key2: '', lastModified: ''};

  window.addEventListener ('keyup', function (event) {
    if (event.code == 'Escape') {
      hideFormContainer ();
    } else {
      switch (event.code) {
        case 'MetaLeft':
          break;
        case 'AltLeft':
          break;
        case 'ControlLeft':
          event.preventDefault ();
          break;
        case 'ShiftLeft':
          event.preventDefault ();
          break;
        case 'MetaRight':
          break;
        case 'AltRight':
          event.preventDefault ();
          break;
        case 'ShiftRight':
          event.preventDefault ();
          break;
        case 'F12':
          event.preventDefault ();
          break;
        default:
          break;
      }
    }

    // if (lastTwoKeys.key1 == '' || lastTwoKeys.lastModified != 'key1') {
    //   lastTwoKeys.key1 = event.code;
    //   lastTwoKeys.lastModified = 'key1';
    // } else if (lastTwoKeys.key2 == '' || lastTwoKeys.lastModified != 'key2') {
    //   lastTwoKeys.key2 = event.code;
    //   lastTwoKeys.lastModified = 'key2';
    // } else if (lastModified == '') {
    //   lastTwoKeys.lastModified = 'key2';
    // } else if (lastModified == 'key2') {
    //   lastTwoKeys.key1 = event.code;
    //   lastTwoKeys.lastModified = 'key1';
    // } else if (lastModified == 'key1') {
    //   lastTwoKeys.key2 = event.code;
    //   lastTwoKeys.lastModified = 'key2';
    // }

    // if (lastTwoKeys.key1 != 'AltLeft') {
    //   lastTwoKeys.lastModified = 'key2';
    // } else {
    //   event.preventDefault ();
    //   if (
    //     lastTwoKeys.key1 == 'AltLeft' &&
    //     lastTwoKeys.key2 == 'KeyA' &&
    //     lastTwoKeys.lastModified == 'key2'
    //   ) {

    //   } else {
    //   }
    // }
  });

  document.addEventListener ('contextmenu', function (event) {
    event.preventDefault ();
  });
  checkBookmark ();
}) ();

function doneTypingUrl () {
  indicator.classList.add ('spinner-border');
  checkIfImageExists (
    `https://logo.clearbit.com/${bookmarkURL.value}`,
    exists => {
      if (exists) {
        imgUserTest.setAttribute (
          'src',
          `https://logo.clearbit.com/${bookmarkURL.value}`
        );
        indicator.classList.remove ('spinner-border');
      } else {
        indicator.classList.remove ('spinner-border');
        imgUserTest.setAttribute ('src', `assets/img-placeholder.jpeg`);
      }
    }
  );
}

function checkBookmark () {
  if (bookmarksArr.length > 0) {
    hideFormContainer ();
  } else {
    appearFormContainer ();
    bookmarks.innerHTML = `
      <div id="bookmarks" class="row py-3">
      <div class="col text-center text-white display-4">blank !!</div>
      </div>
    `;
  }
}

function hideFormContainer () {
  if (bookmarksArr.length <= 0) {
    bookmarkForm.classList.add ('error');
    bookmarkName.focus ();
  } else {
    formContainer.classList.replace ('d-flex', 'd-none');
    itemsContainer.classList.replace ('d-none', 'd-flex');
    document.body.style.overflow = 'auto';
  }
  setTimeout (() => {
    bookmarkForm.classList.remove ('error');
  }, 100);
}

function appearFormContainer () {
  formContainer.classList.replace ('d-none', 'd-flex');
  itemsContainer.classList.replace ('d-flex', 'd-none');
  bookmarkName.focus ();
  document.body.style.overflow = 'hidden';
}

function displayBookmarks () {
  cartona = ``;
  for (let i = 0; i < bookmarksArr.length; i++) {
    cartona += `
          <div class="col-md-3 col-lg-2">
            <div class="item link-container h-100 p-2">
              <div class="inner-item bg-white p-1 position-relative d-flex flex-column justify-content-center align-items-center">
                  <a onclick="appearLinkMenu(${i})" href="#" class="h-100 w-100 text-center d-flex justify-content-around align-items-center flex-column">
                        <div class="img-formContainer d-flex justify-content-center align-items-center">
                          <img class="img-fluid" src="${bookmarksArr[i].image}" alt="">
                        </div>
                        <div class="title">
                          <h6 class="text-muted">${bookmarksArr[i].name}</h6>
                        </div>
                        <div id="linkList${i}" class="list-group rounded-4 d-none position-absolute top-50 translate-middle-y">
                          <a href="${bookmarksArr[i].url}" target="_blank" class=" bg-dark text-warning list-group-item list-group-item-action">new tab</a>
                          <a href="${bookmarksArr[i].url}" class=" bg-dark text-warning list-group-item list-group-item-action">current tab</a>
                        </div>
                  </a>
                  <button  onclick=deleteBookmarkItem(${i}) class="close-item btn btn-danger position-absolute">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
          </div>
          </div>
          `;
  }
  bookmarks.innerHTML = cartona;
}

function appearLinkMenu (index) {
  var allLinks = document.querySelectorAll ('.list-group');
  for (let i = 0; i < allLinks.length; i++) {
    allLinks[i].classList.replace ('d-block', 'd-none');
  }
  var linkList = document.getElementById (`linkList${index}`);
  linkList.classList.replace ('d-none', 'd-block');
  addMoveOverToLinkContainer (allLinks);
}

function addMoveOverToLinkContainer (allLinks) {
  var linkcontainer = document.querySelectorAll ('.link-container');
  for (let i = 0; i < linkcontainer.length; i++) {
    linkcontainer[i].addEventListener ('mouseleave', function (event) {
      for (let i = 0; i < allLinks.length; i++) {
        allLinks[i].classList.replace ('d-block', 'd-none');
      }
    });
  }
}

function deleteBookmarkItem (index) {
  bookmarksArr.splice (index, 1);
  reloadBookmarks ();
  checkBookmark ();
}

function checkIfImageExists (url, callback) {
  const img = new Image ();
  img.src = url;

  if (img.complete) {
    callback (true);
  } else {
    img.onload = () => {
      callback (true);
    };

    img.onerror = () => {
      callback (false);
    };
  }
}

function firstTimeVisit () {
  if (bookmarksArr.length > 0) {
    var introCloseButton = document.getElementById ('introCloseButton');
    introCloseButton.addEventListener ('click', function () {
      intro.classList.replace ('d-block', 'd-none');
    });
    ls = localStorage.getItem (visitsTime);
    var intro = document.querySelector ('.intro');

    if (ls == null) {
      localStorage.setItem (visitsTime, 1);
    } else {
      localStorage.setItem (visitsTime, parseInt (ls) + 1);
    }
    if (parseInt (ls) >= 3) {
      intro.classList.replace ('d-block', 'd-none');
    } else {
      intro.classList.replace ('d-none', 'd-block');
    }
  }
}
function getbookmarksNames () {
  for (let i = 0; i < bookmarksArr.length; i++) {
    bookmarkNames.push (bookmarksArr[i].name);
  }
}

function isNameUnique (name) {
  getbookmarksNames ();
  for (let i = 0; i < bookmarkNames.length; i++) {
    if (name.toUpperCase () == bookmarkNames[i]) {
      return false;
    }
  }
  return true;
}

function downloadBookmarks () {
  var bookmarkSting = JSON.stringify (bookmarksArr);
  const blob = new Blob ([bookmarkSting], {type: 'application/json'});
  const url = window.URL.createObjectURL (blob);
  const a = document.createElement ('a');
  a.href = url;
  a.download = 'bookmark';
  a.click ();
  a.remove ();

  document.addEventListener ('focus', w => {
    window.URL.revokeObjectURL (blob);
  });
}

function fileOnChange (event) {
  var reader = new FileReader ();
  reader.onload = onReaderLoad;
  reader.readAsText (event.target.files[0]);
}

function onReaderLoad (event) {
  if (isJson (event.target.result)) {
    var obj = JSON.parse (event.target.result);
    uploadedobjs = obj;
    catchError ('');
    clearInputs ();
    fileInUpload = true;
  } else {
    fileInUpload = false;
    catchError (
      'enter a valid bookmark data make sure is json and has 3 prop name url image '
    );
    bookmarksFile.classList.add ('error');
    setTimeout (() => {
      bookmarksFile.classList.remove ('error');
    }, 100);
  }
  isFileInUpload ();
}

function isJson (str) {
  try {
    JSON.parse (str);
  } catch (e) {
    return false;
  }
  return true;
}

function isFileInUpload () {
  var textUpperUpload = document.getElementById ('fileUploadUpperText');
  if (fileInUpload) {
    formBasicPart.classList.replace ('d-block', 'd-none');
    textUpperUpload.innerText = 'we are happy to back up your old bookmarks';
    imgUserTest.classList.replace ('d-block', 'd-none');
    addBookMark.innerText = 'upload bookmarks';
  } else {
    formBasicPart.classList.replace ('d-none', 'd-block');
    textUpperUpload.innerText = 'or add with exist file';
    imgUserTest.classList.replace ('d-none', 'd-block');
    addBookMark.innerText = 'add bookmark';
  }
}

// shortcuts
var map = {};
(function() {
  onkeydown = onkeyup = function(e){
    map[e.code] = e.type == 'keydown';
    if(map['AltLeft'] && map['KeyA']) {
      if (formContainer.classList.contains ('d-none')) {
        appearFormContainer ();
      } else {
        hideFormContainer ();
        clearInputs ();
      }
    }
  }
})()