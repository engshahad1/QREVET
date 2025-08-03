const form = document.getElementById('animalForm');
const qrCodeDiv = document.getElementById('qrcode');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageFile = document.getElementById('image')?.files[0];
  let imageUrl = "";

  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const uploadRes = await fetch('/api/animals/upload', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (uploadData.success) {
      imageUrl = uploadData.imageUrl;
    }
  }

  const data = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    owner: document.getElementById('owner').value,
    ownerId: document.getElementById('ownerId').value,
    phone: document.getElementById('phone').value,
    result: "قيد الإجراء",
    notes: "-",
    imageUrl: imageUrl
  };

  const res = await fetch('/api/animals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const response = await res.json();
  const id = response.animal.id;

  // إعداد الرابط الذي سيتم تخزينه في QR
  const base64 = btoa(JSON.stringify({ ...data, id }));
  const qrURL = `${location.origin}/animal.html?data=${encodeURIComponent(base64)}`;

  qrCodeDiv.innerHTML = "";
  QRCode.toCanvas(document.createElement('canvas'), qrURL, function (err, canvas) {
    if (!err) qrCodeDiv.appendChild(canvas);
  });

  form.reset();
});
