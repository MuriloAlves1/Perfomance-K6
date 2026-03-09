function construirTela(dadosJson, url, usuarios, tempo, perfil, slaUsuario, metodo) {
    // Extração de métricas do JSON do k6
    const p95 = dadosJson.metrics.http_req_duration ? dadosJson.metrics.http_req_duration.values['p(95)'].toFixed(2) : 0;
    const med = dadosJson.metrics.http_req_duration ? dadosJson.metrics.http_req_duration.values.avg.toFixed(2) : 0;
    const totalReqs = dadosJson.metrics.http_reqs ? dadosJson.metrics.http_reqs.values.count : 0;
    const falhas = dadosJson.metrics.http_req_failed ? dadosJson.metrics.http_req_failed.values.passes : 0;
    
    const sla = parseInt(slaUsuario);
    
    // Lógica de Status
    let statusCor = 'status-verde', txtCor = 'texto-verde', icone = '✅', statusTitulo = "SISTEMA SAUDÁVEL";
    let diagnostico = `O sistema respondeu dentro do esperado para o limite de ${sla}ms. A infraestrutura suportou a carga sem degradação perceptível.`;

    if (p95 > sla) {
        statusCor = 'status-vermelho'; txtCor = 'texto-vermelho'; icone = '🚫'; statusTitulo = "SLA VIOLADO";
        diagnostico = `O tempo de resposta de 95% dos usuários (${p95}ms) ultrapassou o limite definido de ${sla}ms. É necessário investigar gargalos no código ou banco de dados.`;
    } else if (p95 > sla * 0.8) {
        statusCor = 'status-amarelo'; txtCor = 'texto-amarelo'; icone = '⚠️'; statusTitulo = "LIMITE PRÓXIMO";
        diagnostico = `O sistema está estável, mas operando muito próximo do limite de ${sla}ms. Picos maiores de tráfego podem causar lentidão crítica.`;
    }

    if (falhas > 0) {
        statusCor = 'status-vermelho'; statusTitulo = "ERROS DETECTADOS";
        diagnostico = `Foram detectadas ${falhas} falhas nas requisições. O servidor não apenas ficou lento, como também parou de responder a alguns chamados.`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Dashboard de Performance - K6</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <div class="card ${statusCor}">
                <div class="header-resultado">
                    <h2 class="${txtCor}" style="margin:0;">${icone} ${statusTitulo}</h2>
                    <small style="color: #a78bfa;">Relatório gerado via K6 Engine</small>
                </div>

                <div style="text-align: left; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>🎯 Alvo:</strong> <code style="color:var(--accent);">${url}</code></p>
                    <p style="margin: 5px 0;"><strong>⚙️ Cenário:</strong> ${usuarios} VUs | ${(perfil || 'Não Definido').toUpperCase()} | ${metodo || 'GET'}</p>
                </div>

                <div class="grid-resultados">
                    <div class="card-metrica">
                        <span>P95 (ms)</span>
                        <b class="${txtCor}">${p95}</b>
                    </div>
                    <div class="card-metrica">
                        <span>Média (ms)</span>
                        <b>${med}</b>
                    </div>
                    <div class="card-metrica">
                        <span>Requisições</span>
                        <b>${totalReqs}</b>
                    </div>
                </div>

                <div class="diagnostico-box">
                    <h4 style="margin: 0 0 10px 0; color: var(--accent);">🔬 Diagnóstico de Engenharia</h4>
                    <p style="margin: 0; font-size: 0.95em; line-height: 1.5; color: #cbd5e1;">${diagnostico}</p>
                </div>

                <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8em; color: var(--text-muted);">SLA Definido: ${sla}ms</span>
                    <button class="btn-voltar" onclick="window.location.href='/'">Realizar Novo Teste</button>
                </div>
            </div>
            
            <p style="font-size: 0.8em; color: #4c1d95; text-align: center;">K6 Academy Pro - Dashboard v2.0</p>
        </div>
    </body>
    </html>`;
}

module.exports = construirTela;