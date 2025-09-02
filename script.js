// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO FORMULÁRIO ---
    const heroForm = document.getElementById('hero-form');
    const phoneInput = document.getElementById('phone');
    const formMessage = document.getElementById('form-message');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); 
            if (value.startsWith('55')) value = value.substring(2);
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = value;
        });
    }

    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const submitButton = heroForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formMessage.textContent = '';
            const formData = new FormData(heroForm);
            const name = formData.get('fullName');
            const email = formData.get('email');
            const phone = formData.get('phone');

            if (phone.length < 7 || phone.length > 11) {
                formMessage.textContent = 'Telefone inválido. Insira 10 a 11 dígitos com DDD.';
                formMessage.style.color = '#ef4444';
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            const payload = { name, email, phone: `+55${phone}` };

            try {
                const response = await fetch('https://n8nwebhook.arck1pro.shop/webhook/ebook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    formMessage.textContent = 'Sucesso! acomapanhe seu e-mail, que logo chegará o seu Ebook.';
                    formMessage.style.color = '#22c55e';
                    heroForm.reset();
                } else { throw new Error('Falha na resposta do servidor.'); }
            } catch (error) {
                formMessage.textContent = 'Erro ao enviar. Tente novamente.';
                formMessage.style.color = '#ef4444';
                console.error('Erro no Webhook:', error);
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, 4000);
            }
        });
    }

    // --- LÓGICA DE ROLAGEM DOS BOTÕES ---
    const scrollButtons = document.querySelectorAll('.btn-cta');
    scrollButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});