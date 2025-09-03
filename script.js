// Substitua a função de formulário inteira no seu script.js por esta versão atualizada

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

        // --- LÓGICA DE ENVIO PARA MÚLTIPLOS WEBHOOKS ---

        // ATUALIZADO: Defina os URLs dos seus dois webhooks aqui
        const webhookUrls = [
            'https://n8nwebhook.arck1pro.shop/webhook/ebook-rdmkt', // Webhook 1 (RD Marketing)
            'https://n8nwebhook.arck1pro.shop/webhook/ebook-rdcrm'   // Webhook 2 (RD CRM)
        ];

        try {
            // Cria uma lista de promessas de envio, uma para cada URL
            const requests = webhookUrls.map(url =>
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            );

            // Envia para todos os webhooks simultaneamente e espera a conclusão de todos
            const results = await Promise.allSettled(requests);

            // Verifica se pelo menos um dos envios foi bem-sucedido
            const isSuccess = results.some(result => result.status === 'fulfilled' && result.value.ok);

            if (isSuccess) {
                formMessage.textContent = 'Sucesso! Seus dados foram enviados.';
                formMessage.style.color = '#22c55e';
                heroForm.reset();
            } else {
                // Se todos falharam, joga um erro
                throw new Error('Falha no envio para todos os webhooks.');
            }

            // Opcional: Loga no console os resultados de cada envio para depuração
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
