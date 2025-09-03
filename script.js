// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- DEFINIÇÃO DAS VARIÁVEIS PRINCIPAIS ---
    // Esta parte é crucial. Ela "cria" as variáveis que o resto do script vai usar.
    const heroForm = document.getElementById('hero-form');
    const phoneInput = document.getElementById('phone');
    const formMessage = document.getElementById('form-message');

    // --- LÓGICA DE VALIDAÇÃO DO TELEFONE ---
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); 
            if (value.startsWith('55')) value = value.substring(2);
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = value;
        });
    }

    // --- LÓGICA DE ENVIO DO FORMULÁRIO ---
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

            if (phone.length < 9 || phone.length > 11) {
                formMessage.textContent = 'Telefone inválido. Insira 9 a 11 dígitos.';
                formMessage.style.color = '#ef4444';
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            const payload = { name, email, phone: `+55${phone}` };

            const webhookUrls = [
                'https://n8nwebhook.arck1pro.shop/webhook/ebook-rdmkt',
                'https://n8nwebhook.arck1pro.shop/webhook/ebook-rdcrm'
            ];

            try {
                const requests = webhookUrls.map(url =>
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    })
                );

                const results = await Promise.allSettled(requests);
                const isSuccess = results.some(result => result.status === 'fulfilled' && result.value.ok);

                if (isSuccess) {
                    formMessage.textContent = 'Sucesso! Seus dados foram enviados.';
                    formMessage.style.color = '#22c55e';
                    heroForm.reset();
                } else {
                    throw new Error('Falha no envio para todos os webhooks.');
                }

                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        console.log(`Webhook ${index + 1} (${webhookUrls[index]}): Sucesso, status ${result.value.status}`);
                    } else {
                        console.error(`Webhook ${index + 1} (${webhookUrls[index]}): Falha`, result.reason);
                    }
                });

            } catch (error) {
                formMessage.textContent = 'Erro ao enviar. Tente novamente.';
                formMessage.style.color = '#ef4444';
                console.error('Erro geral no envio dos webhooks:', error);
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

}); // Fim do document.addEventListener
