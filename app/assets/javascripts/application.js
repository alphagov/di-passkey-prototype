//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
// 


async function createPasskey() {
  const pubKeyCredParamsResponse = await fetch('/start-passkey-registration', {
    method: 'POST',
  });
  const pubKeyCredParams = await pubKeyCredParamsResponse.json();
  
  // some bits of data need to be in ArrayBuffer type
  pubKeyCredParams.publicKey.challenge = new Uint8Array(pubKeyCredParams.publicKey.challenge.data).buffer;
  pubKeyCredParams.publicKey.user.id = new Uint8Array(pubKeyCredParams.publicKey.user.id.data).buffer;
  
  const result = await navigator.credentials.create(pubKeyCredParams);
  console.log(result);

  await fetch('/complete-passkey-registration', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(result),
  })

  window.location = '/account-created';
}

function initCreatePasskey() {
  var createPasskeyButton = document.querySelector(".createPasskey");

  if (createPasskeyButton) {
    // TODO: browser compatibility check
    createPasskeyButton.addEventListener("click", () => createPasskey());
  }
}

async function signInWithPasskey() {
  const pubKeyCredParamsResponse = await fetch('/start-passkey-signin', {
    method: 'POST',
  });
  const pubKeyCredParams = await pubKeyCredParamsResponse.json();
  
  // some bits of data need to be in ArrayBuffer type
  pubKeyCredParams.publicKey.challenge = new Uint8Array(pubKeyCredParams.publicKey.challenge.data).buffer;
  
  const result = await navigator.credentials.get(pubKeyCredParams);
  console.log(result);

  await fetch('/complete-passkey-signin', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(result),
  })

  window.location = '/request-a-dbs-check';
}

function initSignInWithPasskey() {
  var signInWithPasskeyButton = document.querySelector(".signInWithPasskey");

  if (signInWithPasskeyButton) {
    // TODO: browser compatibility check
    signInWithPasskeyButton.addEventListener("click", () => signInWithPasskey());
  }
}

window.GOVUKPrototypeKit.documentReady(() => {
  initCreatePasskey();
  initSignInWithPasskey();
})
