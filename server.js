const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const construirTela = require('./geradorResultado'); 

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rodar-teste', (req, res) => {
    const d = req.query;
    const nivel = d.nivel_ativo; // Aqui estava certo

    // Criamos as variáveis que vamos usar no comando final
    let vus, tempo, perfil, metodo, sleep, sla, token;

    // Ajustei os nomes para baterem com o que o k6 e a tela esperam
    if (nivel === 'avancado') {
        vus = d.usuarios_adv || 50;
        tempo = d.tempo_adv || '1m';
        perfil = d.perfil_adv || 'pico'; 
        metodo = 'GET'; 
        sleep = d.sleep_adv || '0.1';
        sla = d.sla_adv || '200';
        token = d.token_adv || '';
    } else if (nivel === 'intermediario') {
        vus = d.usuarios_int || 20;
        tempo = d.tempo_int || '30s';
        perfil = d.perfil_int || 'stress';
        metodo = d.metodo_int || 'GET';
        sleep = '1';
        sla = '500';
        token = '';
    } else {
        // Padrão Iniciante
        vus = d.usuarios_ini || 5;
        tempo = '10s';
        perfil = 'constante';
        metodo = 'GET';
        sleep = '1';
        sla = '1000';
        token = '';
    }

    // O comando k6 agora usa as variáveis que acabamos de preencher
    const comando = `k6 run -e VUS=${vus} -e TARGET_URL="${d.url}" -e TEMPO=${tempo} -e PERFIL=${perfil} -e METODO=${metodo} -e TOKEN="${token}" -e SLEEP=${sleep} teste.js`;
    
    console.log(`🚀 Rodando modo ${nivel}: ${vus} VUs no alvo ${d.url}`);

    exec(comando, (erro) => {
        if (erro) {
            console.error(erro);
            return res.send("<h1>Erro no k6. Verifique o terminal.</h1>");
        }

        try {
            const resultadoJson = JSON.parse(fs.readFileSync('resultado.json'));
            // Enviamos exatamente as variáveis que definimos no IF acima
            res.send(construirTela(resultadoJson, d.url, vus, tempo, perfil, sla, metodo));
        } catch (err) {
            res.send("<h1>Erro ao processar resultados do teste.</h1>");
        }
    });
});

app.listen(3000, () => console.log("🚀 Servidor Online em http://localhost:3000"));