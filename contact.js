// 소개·문의 페이지: 제휴 문의 양식 전송
const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
const contactSubmit = document.querySelector('#contact-submit');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  contactSubmit.disabled = true;
  contactSubmit.textContent = '보내는 중…';
  contactStatus.className = '';
  contactStatus.textContent = '';
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      contactForm.reset();
      contactStatus.className = 'ok';
      contactStatus.textContent = '문의가 접수되었습니다. 확인 후 이메일로 연락드릴게요.';
    } else {
      const data = await response.json().catch(() => ({}));
      const detail = data.errors?.map((e) => e.message).join(', ');
      throw new Error(detail || '전송에 실패했습니다.');
    }
  } catch (error) {
    contactStatus.className = 'err';
    const message = error instanceof TypeError ? '네트워크 오류로 전송하지 못했습니다.' : error.message;
    contactStatus.textContent = `${message} 잠시 후 다시 시도해 주세요.`;
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.textContent = '문의 보내기';
  }
});
