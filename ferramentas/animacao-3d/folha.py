import os, sys
PASTA=os.path.dirname(os.path.abspath(__file__))
from PIL import Image, ImageDraw
import glob,sys
nomes=sys.argv[2:]; rows=[]
for nm in nomes:
    fs=sorted(glob.glob(os.path.join(PASTA,'quadros',f'q-prof-{nm}-*.webp'))); sel=[fs[round(i*(len(fs)-1)/7)] for i in range(8)]
    ims=[Image.open(f).convert('RGBA') for f in sel]; w=ims[0].width; r=Image.new('RGBA',(8*w,480),(205,236,255,255))
    for k,i in enumerate(ims): r.alpha_composite(i,(k*w,0))
    ImageDraw.Draw(r).text((8,8),nm,fill=(200,0,0,255)); rows.append(r)
c=Image.new('RGB',(rows[0].width,len(rows)*480),'white')
for k,r in enumerate(rows): c.paste(r.convert('RGB'),(0,k*480))
c.thumbnail((1600,1600)); c.save(sys.argv[1])
