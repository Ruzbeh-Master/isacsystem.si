const feedbackForm = document.querySelector('#feedback-form');
const feedbackStatus = document.querySelector('#feedback-status');

feedbackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!feedbackForm.reportValidity()) return;

  const data = new FormData(feedbackForm);
  const message = [
    'Feedback from the ISAC Systems website',
    `Role: ${data.get('role')}`,
    `Product: ${data.get('product')}`,
    `Feedback: ${data.get('feedback')}`,
    `Name: ${data.get('name') || 'Not provided'}`,
    `Email: ${data.get('email') || 'Not provided'}`,
  ].join('\n');
  window.open(`https://wa.me/918905636766?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  if (feedbackStatus) feedbackStatus.textContent = 'WhatsApp opened with your feedback ready to review and send.';
});
