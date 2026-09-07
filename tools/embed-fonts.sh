#!/bin/sh
# Пересобирает блок <style id="gilroy"> в index.html из assets/fonts/*.woff2.
# Нужен только если шрифты обновились — прототип остаётся одним самодостаточным файлом.
set -e
cd "$(dirname "$0")/.."
{
  printf '<style id="gilroy">/* Gilroy — фирменный шрифт Promminer, woff2 с прода, вшит в файл */\n'
  for w in 400:Regular 500:Medium 600:SemiBold 700:Bold 800:ExtraBold; do
    n=${w#*:}; k=${w%%:*}
    printf "@font-face{font-family:'Gilroy';font-style:normal;font-display:swap;font-weight:%s;src:local('Gilroy %s'),url(assets/fonts/Gilroy-%s.woff2) format('woff2'),url(data:font/woff2;base64," "$k" "$n" "$n"
    base64 < "assets/fonts/Gilroy-$n.woff2" | tr -d '\n'
    printf ") format('woff2')}\n"
  done
  printf '</style>\n'
} > /tmp/gilroy-block.html
python3 - <<'PY'
import re,io
html=open('index.html',encoding='utf-8').read()
block=open('/tmp/gilroy-block.html',encoding='utf-8').read()
html=re.sub(r'<style id="gilroy">.*?</style>\n?', '', html, flags=re.S)
html=html.replace('</body>', block+'</body>')
open('index.html','w',encoding='utf-8').write(html)
PY
echo "gilroy block embedded: $(wc -c < index.html) bytes"
