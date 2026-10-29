import os, sys
PASTA=os.path.dirname(os.path.abspath(__file__))
import sys,time; sys.path.insert(0,PASTA); from anim import *; from render import render
import numpy as np
from PIL import Image
nm,arq=sys.argv[1],sys.argv[2]
c=Cena(os.path.join(PASTA,'modelos',arq+'.fbx'))
caixa=(-0.8,0.8,-0.06,2.22)                    # mesma caixa e escala para todos os movimentos
n=max(12,round(c.dur*15))                       # ~15 quadros por segundo
t0=time.time()
for k in range(n):
    t=c.dur*k/n                                  # o último quadro não repete o primeiro (loop)
    im=render(c.pose(t),c.F,c.FU,c.tex,caixa,H=1200)
    im=im.resize((round(im.width*480/im.height),480),Image.LANCZOS)
    im.save(os.path.join(PASTA,'quadros',f'q-prof-{nm}-{k+1:02d}.webp'),'WEBP',quality=82,method=5)
print(nm,n,'quadros em',round(time.time()-t0),'s', im.size)
