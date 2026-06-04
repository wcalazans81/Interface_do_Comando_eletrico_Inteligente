// auth.js - Proteção simples e definitiva
(function() {
    // Pega a página atual
    const paginaAtual = window.location.pathname;
    
    // Lista de páginas protegidas (agora inclui admin_email.html)
    const paginasProtegidas = ['/config.html', '/email.html', '/emails.html', '/admin_email.html'];
    
    // Lista de páginas públicas
    const paginasPublicas = ['/', '/index.html', '/login.html', '/logs.html', '/recuperar.html'];
    
    // Se for página pública, NÃO FAZ NADA
    if (paginasPublicas.includes(paginaAtual)) {
        console.log('Página pública:', paginaAtual);
        return;
    }
    
    // Se for página protegida
    if (paginasProtegidas.includes(paginaAtual)) {
        console.log('Verificando acesso para:', paginaAtual);
        
        // Verifica se TEM o token de login
        const logado = sessionStorage.getItem('auth_logado') === 'true';
        
        if (!logado) {
            console.log('🔴 NÃO LOGADO! Redirecionando...');
            // Salva a página que tentou acessar
            sessionStorage.setItem('auth_origem', paginaAtual);
            // Vai para o login
            window.location.href = '/login.html';
        } else {
            console.log('✅ ACESSO PERMITIDO');
        }
    }
})();

// Função de logout
window.logout = function() {
    sessionStorage.clear();
    window.location.href = '/';
};

// Função de logout (alias)
window.sair = window.logout;

// Adiciona botão de logout nas páginas protegidas
document.addEventListener('DOMContentLoaded', function() {
    const paginaAtual = window.location.pathname;
    const paginasComBotao = ['/config.html', '/email.html', '/emails.html', '/admin_email.html'];
    
    if (paginasComBotao.includes(paginaAtual) && sessionStorage.getItem('auth_logado') === 'true') {
        
        setTimeout(() => {
            const header = document.querySelector('header');
            if (header && !document.getElementById('btn-logout')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'btn-logout';
                logoutBtn.innerHTML = '🚪 Sair';
                logoutBtn.style.cssText = `
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: 15px;
                    font-size: 14px;
                    transition: opacity 0.3s;
                `;
                logoutBtn.onmouseover = function() { this.style.opacity = '0.9'; };
                logoutBtn.onmouseout = function() { this.style.opacity = '1'; };
                logoutBtn.onclick = window.logout;
                
                const statusBar = header.querySelector('.status-bar');
                if (statusBar) {
                    statusBar.appendChild(logoutBtn);
                } else {
                    header.appendChild(logoutBtn);
                }
                console.log('🔘 Botão de logout adicionado');
            }
        }, 200);
    }
});