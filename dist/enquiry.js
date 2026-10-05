const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
const interest = document.querySelector('#interest');

if (interest) {
  const requestedInterest = new URLSearchParams(window.location.search).get('interest');
  if (requestedInterest) {
    const option = Array.from(interest.options).find((item) => item.text.toLowerCase() === requestedInterest.toLowerCase());
    if (option) interest.value = option.value;
  }
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const lines = [
    'MRDI enquiry from the ISAC Systems website',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone')}`,
    `Interested in: ${data.get('interest')}`,
    `Academic background: ${data.get('academics') || 'Not provided'}`,
    `Heard about MRDI from: ${data.get('referral') || 'Not provided'}`,
    `Question: ${data.get('message') || 'Not provided'}`,
  ];
  const url = `https://wa.me/918905636766?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  if (status) status.textContent = 'WhatsApp opened with your enquiry ready to review and send.';
});
