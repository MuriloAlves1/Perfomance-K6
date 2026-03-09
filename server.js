const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const construirTela = require('./geradorResultado'); 

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rodar-teste', (req, res) => {
    const d = req.query;
    const nivel = d.nivel_ativo;

    let vus, tempo, perfil, metodo, sleep, sla, token;

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
        vus = d.usuarios_ini || 5;
        tempo = '10s';
        perfil = 'constante';
        metodo = 'GET';
        sleep = '1';
        sla = '1000';
        token = '';
    }

    // --- AJUSTE PARA O RENDER ---
    // Se existir a variável RENDER, ele usa o k6 da pasta local (./k6), 
    // senão usa o k6 instalado no seu sistema (PC).
    const k6Path = process.env.RENDER ? './k6' : 'k6';

    const comando = `${k6Path} run -e VUS=${vus} -e TARGET_URL="${d.url}" -e TEMPO=${tempo} -e PERFIL=${perfil} -e METODO=${metodo} -e TOKEN="${token}" -e SLEEP=${sleep} teste.js`;
    
    console.log(`🚀 [${nivel.toUpperCase()}] Rodando via: ${k6Path} | Alvo: ${d.url}`);

    exec(comando, (erro) => {
        if (erro) {
            console.error(erro);
            return res.send("<h1>Erro no k6. Verifique o terminal ou o log do Render.</h1>");
        }

        try {
            const resultadoJson = JSON.parse(fs.readFileSync('resultado.json'));
            res.send(construirTela(resultadoJson, d.url, vus, tempo, perfil, sla, metodo));
        } catch (err) {
            res.send("<h1>Erro ao processar resultados do teste.</h1>");
        }
    });
});

const PORT = process.env.PORT || 3000; // O Render exige que usemos a porta deles
app.listen(PORT, () => console.log(`🚀 Servidor Online na porta ${PORT}`));