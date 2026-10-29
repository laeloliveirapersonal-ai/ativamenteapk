import os, sys
PASTA=os.path.dirname(os.path.abspath(__file__))
import sys, numpy as np
sys.path.insert(0,PASTA); from poses import *; from render import render
from PIL import Image
pi=np.pi
def onda(t): return 0.5-0.5*np.cos(2*pi*t)          # 0 → 1 → 0 suave
def suave(x): x=np.clip(x,0,1); return x*x*(3-2*x)
def palmas(t):
    a=0.5+0.5*np.cos(4*pi*t)                          # 1 aberto, 0 batendo (2 palmas por ciclo)
    phi=-6+50*a
    return dict(giros={'LeftArm':[(X,-78),(Y,phi)],'RightArm':[(X,-78),(Y,-phi)],
                       'LeftForeArm':[(Y,-10*(1-a))],'RightForeArm':[(Y,10*(1-a))]})
def bracos(t):
    th=165*onda(t); return dict(giros={'LeftArm':[(Z,th)],'RightArm':[(Z,-th)]})
def equilibrio(t):
    w=np.sin(2*pi*t)
    return dict(giros={'LeftUpLeg':[(X,-78)],'LeftLeg':[(X,88)],'LeftFoot':[(X,10)],
                       'Spine':[(Z,2.5*w)],'Spine1':[(Z,2*w)],
                       'LeftArm':[(Z,82+7*w)],'RightArm':[(Z,-82+7*w)]})
def marchar(t):
    s=np.sin(2*pi*t); l=max(0,s); r=max(0,-s); l,r=suave(l*1.15),suave(r*1.15)
    return dict(giros={'LeftUpLeg':[(X,-70*l)],'LeftLeg':[(X,80*l)],'RightUpLeg':[(X,-70*r)],'RightLeg':[(X,80*r)],
                       'LeftArm':[(X,32*s)],'RightArm':[(X,-32*s)],'LeftForeArm':[(X,-25)],'RightForeArm':[(X,-25)]},
                quadril=(0,0.012*abs(s),0))
def girar(t):
    return dict(giros={'LeftArm':[(Z,78)],'RightArm':[(Z,-78)]},giro_corpo=rot(Y,360*t))
def tocar(t):
    b=suave(onda(t)*1.25)                              # pausa curta embaixo
    return dict(giros={'Spine':[(X,38*b)],'Spine1':[(X,32*b)],'Spine2':[(X,26*b)],'Neck':[(X,-10*b)],
                       'LeftArm':[(Z,165*(1-b)),(X,-60*b)],'RightArm':[(Z,-165*(1-b)),(X,-60*b)]})
def aviao(t):
    w=np.sin(2*pi*t)
    return dict(giros={'Spine':[(Z,7*w)],'Spine1':[(Z,7*w)],'Spine2':[(Z,6*w)],
                       'LeftArm':[(Z,86)],'RightArm':[(Z,-86)]})
def socos(t):
    s=np.sin(2*pi*t); pl=suave(max(0,s)*1.3); pr=suave(max(0,-s)*1.3)
    g={}
    for lado,p,sg in [('Left',pl,1),('Right',pr,-1)]:
        g[lado+'Arm']=[(X,-62-100*p),(Y,-sg*12*(1-p))]
        g[lado+'ForeArm']=[(X,-105*(1-p))]
    return dict(giros=g)
def inclinar(t):
    w=np.sin(2*pi*t)
    return dict(giros={'Spine':[(Z,9*w)],'Spine1':[(Z,9*w)],'Spine2':[(Z,8*w)],
                       'LeftArm':[(Z,165)],'RightArm':[(Z,-165)]})
def correr(t):
    s=np.sin(4*pi*t); l=suave(max(0,s)*1.2); r=suave(max(0,-s)*1.2)   # 2 passadas por ciclo de cada perna
    return dict(giros={'Spine':[(X,5)],
                       'LeftUpLeg':[(X,-62*l+10*r)],'LeftLeg':[(X,95*l+15*r)],'RightUpLeg':[(X,-62*r+10*l)],'RightLeg':[(X,95*r+15*l)],
                       'LeftArm':[(X,40*s)],'RightArm':[(X,-40*s)],'LeftForeArm':[(X,-85)],'RightForeArm':[(X,-85)]},
                quadril=(0,0.03*abs(s),0))
MOVS={'palmas':(palmas,1.6),'bracos':(bracos,2.0),'equilibrio':(equilibrio,2.0),'marchar':(marchar,1.2),'girar':(girar,2.4),
      'tocar':(tocar,3.0),'aviao':(aviao,2.4),'socos':(socos,1.4),'inclinar':(inclinar,2.4),'correr':(correr,1.4)}
if __name__=='__main__':
    import time
    b=Boneco(); caixa=(-0.8,0.8,-0.06,2.22)
    for nm in sys.argv[1:]:
        f,dur=MOVS[nm]; n=round(dur*15); t0=time.time()
        for k in range(n):
            P=b.pose(**f(k/n)); im=render(P,b.c.F,b.c.FU,b.c.tex,caixa,H=1200)
            im=im.resize((round(im.width*480/im.height),480),Image.LANCZOS)
            im.save(os.path.join(PASTA,'quadros',f'q-prof-{nm}-{k+1:02d}.webp'),'WEBP',quality=82,method=5)
        print(nm,n,'quadros',round(time.time()-t0),'s')
