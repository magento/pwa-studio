function urlBase64ToUnit8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
  .replace(/\-/g, '+')
  .replace(/_/g, '/');

  const rowData = window.atob(base64);
  const outputArray = new Uint8Array(rowData.length);

  for(let i=0; i < rowData.length; i++) {
    outputArray[i] = rowData.charCodeAt(i);
  }
  return outputArray;
}

function determineAppServerKey() {
  var vapidPublicKey = "BKPiCScwtjE_fhIsgciiFF7_RfNungJgpX9EQYTsufBL6Hkue6NJsfxx6ZhqOebUdNZgXlRw-Wh5x5hdbg8q3Qw"
  return urlBase64ToUnit8Array(vapidPublicKey);
}

// privateKey = "nhIWEuAD_cE4yaT-5kPRpTsepCY9Z5F_1zXK4OD4NBk"