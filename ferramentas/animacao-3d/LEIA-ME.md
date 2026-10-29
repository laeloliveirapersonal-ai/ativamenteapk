# Animação 3D do Mexe o Corpo (guardado para o futuro)

Ferramentas que transformam um personagem animado do Mixamo em quadros WebP
para o jogo **Mexe o Corpo**. O jogo continua no app, mas **fora do menu**
(`oculto: true` em `index.html`).

Esta pasta **não entra no app**: o `scripts/build-www.js` só copia os arquivos
da pasta principal.

## O que precisa
- Python 3 com `numpy`, `scipy` e `Pillow`
- Arquivos do Mixamo em `modelos/` (guardados à parte em `modelos-mixamo.zip`):
  `Air_Squat.fbx`, `Jump.fbx`, `Jumping_Jacks.fbx`
- Ao baixar do Mixamo: **FBX Binary · With Skin · 30 FPS · In Place**

## Como gerar
Movimentos que vêm prontos do Mixamo (captura de movimento real):

    python3 gerar.py agachar Air_Squat
    python3 gerar.py polichinelo Jumping_Jacks
    python3 gerar.py pular Jump

Movimentos feitos dobrando as articulações por programação (usa o personagem
do `Air_Squat.fbx`): palmas, bracos, equilibrio, marchar, girar, tocar, aviao,
socos, inclinar, correr

    python3 movs.py palmas bracos marchar

Os quadros saem em `quadros/` como `q-prof-<movimento>-NN.webp`
(480 px de altura, 15 quadros por segundo, em loop).

Para conferir: `python3 folha.py folha.png agachar palmas` monta uma folha
com 8 quadros de cada movimento.

## Arquivos
- `fbxread.py`: lê FBX binário
- `anim.py`: esqueleto, curvas de animação e deformação da malha
- `render.py`: desenha a malha com textura e luz (sem manchas na bermuda)
- `poses.py`: dobra as articulações por programação
- `movs.py`: os 10 movimentos feitos à mão
- `gerar.py`: gera os quadros de um arquivo do Mixamo
- `folha.py`: folha de conferência

## Situação (29/10/2026)
Pausado por decisão do autor: o resultado ainda não ficou bom o bastante.
