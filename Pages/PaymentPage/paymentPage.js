document.getElementById('expiryDate').addEventListener('input', function(event) {
    let input = event.target.value;
    input = input.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length > 8) {
        input = input.slice(0, 8);
    }
    if (input.length >= 7) {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4, 8)}`;
    } else if (input.length >= 5) {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4, 6)}`;
    } else if (input.length >= 3) {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
    } else if (input.length >= 2) {
        input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    event.target.value = input;
});

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // Nome Completo validation
    const name = document.getElementById('name').value;
    if (name.length < 3) {
        isValid = false;
        document.getElementById('nameError').textContent = 'Nome deve ter pelo menos 3 caracteres.';
    }

    // Email validation
    const email = document.getElementById('email').value;
    if (!email.includes('@')) {
        isValid = false;
        document.getElementById('emailError').textContent = 'Por favor, insira um email válido.';
    }

    // Número do Cartão validation
    const cardNumber = document.getElementById('cardNumber').value;
    if (!/^\d{16}$/.test(cardNumber)) {
        isValid = false;
        document.getElementById('cardNumberError').textContent = 'Número do cartão deve ter 16 dígitos.';
    }

    // Data de Validade validation
    const expiryDate = document.getElementById('expiryDate').value;
    if (!/^\d{2}\/\d{2}\/(\d{2}|\d{4})$/.test(expiryDate)) {
        isValid = false;
        document.getElementById('expiryDateError').textContent = 'Data de validade deve estar no formato MM/AA/AA ou MM/AA/AAAA.';
    }

    // CVV validation
    const cvv = document.getElementById('cvv').value;
    if (!/^\d{3}$/.test(cvv)) {
        isValid = false;
        document.getElementById('cvvError').textContent = 'CVV deve ter 3 dígitos.';
    }

    if (isValid) {
        alert('Pagamento realizado com sucesso!');
        // Aqui você pode adicionar o código para processar o pagamento
    }
});