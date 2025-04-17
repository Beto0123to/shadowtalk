// TESTE ULTIMATE
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = 'BOTÃO TESTE';
    btn.style = `
        position: fixed; 
        top: 10px; 
        left: 10px; 
        z-index: 9999; 
        padding: 20px;
        background: red;
        color: white;
    `;
    btn.onclick = () => {
        document.body.innerHTML += `
            <div style="color: lime; font-size: 24px;">
                ✅ FUNCIONOU!
            </div>
        `;
    };
    document.body.appendChild(btn);
});
