import http from 'k6/http';
import { check, sleep } from 'k6';

// Lendo as novas variáveis do ambiente
const vus = parseInt(__ENV.VUS || '1');
const url = __ENV.TARGET_URL;
const tempo = __ENV.TEMPO || '10s';
const perfil = __ENV.PERFIL || 'constante';
const token = __ENV.TOKEN || '';
const tempoSleep = parseFloat(__ENV.SLEEP || '1');

export const options = {
    // Lógica para mudar o perfil de carga baseado na escolha do usuário
    stages: (perfil === 'stress') ? [
        { duration: '10s', target: vus / 2 }, 
        { duration: '20s', target: vus },    
        { duration: '10s', target: 0 },
    ] : (perfil === 'pico') ? [
        { duration: '2s', target: vus },     
        { duration: '30s', target: vus },
        { duration: '2s', target: 0 },
    ] : [
        { duration: tempo, target: vus },    // Constante
    ],
};

export default function () {
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    // Se o usuário digitou um token, adicionamos no Header
    if (token) {
        params.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const res = http.get(url, params);

    check(res, {
        'Status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
    });

    if (tempoSleep > 0) {
        sleep(tempoSleep);
    }
}

export function handleSummary(data) {
    return { "resultado.json": JSON.stringify(data) };
}