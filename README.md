# madk1d — «Перестань» (lyric video, 1080×1920 @ 60 fps)

Кадровый рендер на Remotion: каждое слово появляется ровно на своём кадре.

## Пайплайн

| шаг | команда | что делает |
|---|---|---|
| 1. тайминг | `python scripts/align.py` | Demucs вытаскивает вокал → MMS_FA (CTC) выравнивает `input/lyrics.txt` по словам → stable-ts для перекрёстной проверки. Пишет `timings.json`, `audio.json` (BPM, громкость по кадрам), `build/suspicious.txt`. |
| 2. рендер | `npm run render` | `timings.json` + `config.json` → `output/perestan_silent.mp4`, `output/perestan_preview.mp4`, `output/START_TIME.txt` |
| 3. проверка | `npm run stills` | по кадру из середины каждой строки → `output/contact_sheet.png` |
| превью в браузере | `npm run studio` | Remotion Studio, покадровая перемотка |

Шаг 1 нужен только при смене аудио или текста. Правка тайминга — это **только шаг 2**.

## Поправить тайминг

* Одно слово: в `timings.json` поменять `start` (секунды трека). `end` почти ни на что не влияет.
* Всё сразу: `"offset_ms"` в `config.json`. `-40` — слова появляются на 40 мс раньше, `+40` — позже.
* Затем `npm run render`.

## Поменять стиль слова / сцену строки

`config.json`:

```json
"style_overrides": { "12": "glitch", "28": "outline" },
"scene_overrides": { "0": "chat", "4": "wallet" }
```

* ключ стиля — номер слова (`#` в `build/suspicious.txt` и порядок в `timings.json`, с 0);
  стили: `solid outline underline glitch speed typewriter accent wall`;
* ключ сцены — номер строки с 0; сцены: `voice family map contact game clear chat wallet`.

Либо разметка прямо в `input/lyrics.txt` (`*акцент*`, `#стена`, `слово_слово`) → тогда заново шаг 1.

## Установка на Windows (PowerShell)

```powershell
winget install OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg
# новый терминал, в папке проекта:
npm install
py -3.12 -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/align.py      # только если менялись аудио/текст
npm run render
```

Remotion при первом запуске сам скачает Chrome Headless Shell.
