// Estado da aplicação
let appState = {
    bomba1On: false,
    bomba2On: false,
    boiaAlta: false,
    boiaBaixa: false,
    tipo: "ÁGUA",
    modo: "AUTO",
    wifiConnected: true,
    alertaAtivo: false,
    hora: "--:--",
    data: "--/--/----"
};

// Atualiza a cada 2 segundos
setInterval(updateStatus, 2000);

// Primeira atualização
updateStatus();

function updateStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            appState = data;
            updateUI();
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('wifi-status').className = 'status offline';
            document.getElementById('wifi-status').innerHTML = '📶 Desconectado';
        });
}

function updateUI() {
    // WiFi
    const wifiEl = document.getElementById('wifi-status');
    if (appState.wifiConnected) {
        wifiEl.className = 'status online';
        wifiEl.innerHTML = '📶 WiFi';
    } else {
        wifiEl.className = 'status offline';
        wifiEl.innerHTML = '📶 Desconectado';
    }
    
    // Alerta
    const alertaEl = document.getElementById('alerta-status');
    if (appState.alertaAtivo) {
        alertaEl.className = 'status alerta';
        alertaEl.innerHTML = '⚠️ Alerta';
    } else {
        alertaEl.className = 'status ok';
        alertaEl.innerHTML = '✅ Normal';
    }
    
    // Bombas
    updateBombaUI(1, appState.bomba1On);
    updateBombaUI(2, appState.bomba2On);
    
    // Boias
    document.getElementById('boia-alta').innerHTML = 
        appState.boiaAlta ? '🔴 ATIVA' : '⚪ INATIVA';
    document.getElementById('boia-baixa').innerHTML = 
        appState.boiaBaixa ? '🔴 ATIVA' : '⚪ INATIVA';
    
    // Sistema
    document.getElementById('tipo-sistema').innerHTML = appState.tipoSistema || 'ÁGUA';
    document.getElementById('modo').innerHTML = appState.modo;
    document.getElementById('hora').innerHTML = appState.hora;
    document.getElementById('data').innerHTML = appState.data;
}

function updateBombaUI(num, status) {
    const el = document.getElementById(`bomba${num}-status`);
    if (status) {
        el.className = 'pump-status on';
        el.innerHTML = `🔴 BOMBA ${num} LIGADA`;
    } else {
        el.className = 'pump-status off';
        el.innerHTML = `⚪ BOMBA ${num} DESLIGADA`;
    }
}

function toggleBomba(num) {
    const data = {};
    data[`bomba${num}`] = !appState[`bomba${num}On`];
    
    fetch('/api/command', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log(`Comando bomba ${num} enviado`);
            updateStatus();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar comando');
    });
}