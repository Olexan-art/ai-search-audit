[English](README.md) · Українська

# AI Search Audit Lite

AI Search Audit Lite **2.102** — навичка (Agent Skill) від [GetLoopLoop](https://www.getlooploop.com) для claude.ai і застосунку Claude для комп’ютера, Claude Code, Codex, opencode, Hermes Agent та інших агентів, які завантажують навички у форматі `SKILL.md`. Версії рахуються в тисячних (2.101, 2.102, …), тож перша цифра змінюється лише тоді, коли щось ламається несумісно.

Перш ніж Google, Bing чи ШІ-асистент покажуть або процитують сторінку, краулер має отримати дозвіл, сторінка має сказати, що вона таке, а текст має пережити машинне читання. `ai-search-audit` перевіряє одну публічну сторінку за стандартними опублікованими правилами для всіх трьох, додає три прочитання, які може зробити лише ШІ (запитання, які ставлять люди, як власна модель агента описує бренд і що вона знає про його відгуки), і показує результат одним звітом: шість плиток стану, мапа сторінки, побудована з її справжнього документа, де кожну проблему позначено на її місці, найбільші проблеми, боти в robots.txt, чекліст Google і Bing, мовні версії і шлях тексту до ШІ-ретривера.

Lite — це картина проблем: кожна має коротку назву, серйозність і місце. Вона не описує проблем і не каже, як їх виправити. Повна версія з поясненнями — у [GetLoopLoop](https://www.getlooploop.com).

![AI Search Audit Lite: плитки й мапа сторінки Vectorscope](docs/ai-search-audit-light-1280.png)

## Що перевіряється

Скрипти не викликають жодної моделі чи API ембедингів. Кожна знахідка має свій шар: **виміряно** (порахував скрипт), **обчислено** (стала формула над виміряним) або **судження агента** (написав агент, що запускає навичку, у JSON-файл, який скрипти перевіряють; у звіті воно позначене назвою моделі агента).

- **Доступ та індексація:** HTTP-статус, ланцюжок переадресацій, HTTPS і HSTS; robots.txt для Googlebot, Bingbot і ШІ-краулерів (зіставлення RFC 9309 з Vectorscope); noindex у meta robots і `X-Robots-Tag`; керування сніпетами (`nosnippet`, `max-snippet:0`, `data-nosnippet` над основним текстом: Google вимагає, щоб сторінка була «indexed and eligible to be shown in Google Search with a snippet», аби потрапити в ШІ-функції); чи є сторінка в sitemap; llms.txt із приміткою, що Google не документує його використання; Markdown-копія сторінки; `ai-catalog.json`; файл ключа IndexNow, якщо ключ оголошено.
- **Чекліст Google і Bing (35 клітинок):** довжина title та опису, один h1, порядок заголовків, canonical, внутрішні посилання, неробочі посилання (перші 30 перевірено, решту пораховано), зображення (alt, width і height, lazy нижче першого екрана й не на першому зображенні, сучасні формати, розмір за HEAD до 20 зображень, srcset), viewport, html lang, теги Open Graph і Twitter, favicon, назва сайту WebSite, змішаний вміст, soft 404 (один шлях, якого не може бути), варіанти адреси з http, www і кінцевим слешем, вага сторінки, зручна адреса, пари hreflang, розмітка FAQ і ланцюжка, а також сигнали довіри (автор у статтях, посилання «Про нас» і «Контакти», назва, логотип і sameAs організації, видима дата, що збігається з розміткою, конфіденційність і умови), текст посилань, що нічого не називає («тут», «детальніше»), посилання # без цілі, nofollow на внутрішніх посиланнях, посилання-зображення без назви й однаковий alt на багатьох зображеннях, хибний html lang, дати lastmod у sitemap і рядок Sitemap у robots.txt, зображення для прев’ю, а також стиснення, Cache-Control і заголовки безпеки у відповіді HTML.
- **Структуровані дані:** розбір JSON-LD, обов’язкові й рекомендовані властивості, як їх перелічують сторінки Google, для FAQPage, Product, SoftwareApplication, BreadcrumbList, Event, JobPosting, LocalBusiness, VideoObject, QAPage, WebSite, ProductGroup, Offer, Review, AggregateRating, Article, Organization і Person; розширені результати, які Google прибрав, позначено як інформаційні з датою [запису Google](https://developers.google.com/search/updates) (FAQ, How-to, course info, ClaimReview, special announcement, estimated salary, vehicle listing, practice problem, поле пошуку в sitelinks).
- **Читання ШІ:** ядро [Vectorscope](https://www.getlooploop.com/uk/vectorscope) (уривки, ліміт 26 уривків, куди дівається текст), а також вступ, утрачений разом із видаленим `<header>`, заголовки в прихованих панелях, написи завантаження, злиплі слова в h1, навігація всередині тексту, тонкі розділи, обрізані анонси й повторені твердження. Порожню оболонку односторінкового застосунку навичка розпізнає й сама рендерить у локальному Chrome, а розділи, що з’являються лише після JavaScript, малює на мапі пунктиром.
- **ШІ цитує правильно:** розмітка FAQ проти видимого тексту; **запитання, які ставлять люди** (8–12 розмовних запитань, які агент пише за чотирма осями Voicescope; кожне оцінено як повна, часткова чи відсутня відповідь в одному уривку з дослівною цитатою, яку перевіряє скрипт); **шаблони письма** (детерміновані детектори PatternScope: шаблонні звороти, повторені форми речень, однакові початки, твердження без фактів, з позиціями й щільністю на 1 000 слів; це сигнали, а не детектор ШІ); **цільова ключова фраза** (`--keyword` або взята з h1: немає в title і h1, написана двома способами, лише в одному розділі, більшість тексту без неї, обіцянка без числа).
- **ШІ правильно описує бренд:** модель агента відповідає на п’ять запитань покупця з Brandscope з власних знань (без пошуку; «не знаю» — допустима відповідь), а скрипт порівнює їх зі сторінкою: ціна чи кількість, які сторінка називає інакше, факт, якого на сторінці немає, бренд, якого модель не знає. Для відгуків модель називає рейтинг бренду, який вважає правильним, на 12 платформах Reviewscope і на одній вигаданій контрольній; рейтинг для контрольної — це галюцинація, а рейтинг без джерела на сторінці позначено; оцінки на сторінці без розмітки виміряно. Це погляд однієї моделі: вебверсії [Brandscope](https://www.getlooploop.com/brandscope) і [Reviewscope](https://www.getlooploop.com/reviewscope) питають трьох асистентів.
- **Мови:** набір hreflang (посилання на себе, x-default, коректні коди), кожну мовну версію завантажено, щоб перевірити зворотне посилання, title та описи порівняно між версіями, html lang — з hreflang, і **ті самі факти**: числа в кожному розділі h2 порівняно між версіями, вирівняними за порядком розділів.

Той самий звіт українською, з увімкненою темною темою й на вузькому екрані:

![AI Search Audit Lite українською](docs/ai-search-audit-light-uk-1280.png)

![AI Search Audit Lite, темна тема](docs/ai-search-audit-dark-1280.png)

Посібник MDN про HTTP-кешування заповнює всі 26 уривків; його останні розділи на мапі злито в одну зону, а посилання понад ліміт перевірки пораховано. Цей запуск без файлів суджень, тож плитка бренду показує *не перевірено*:

![AI Search Audit Lite на посібнику MDN про HTTP-кешування](docs/ai-search-audit-mdn-1280.png)

## Приклади

Справжні запуски в [`examples/`](examples) (17 жовтня 2026), кожен як HTML, Markdown і JSON; файли суджень — у [`examples/ai-search-audit-judgement/`](examples/ai-search-audit-judgement), їх написав Claude Code з моделлю Claude Opus 5.5, яка не знала GetLoopLoop з власних знань і так і сказала. Звіти відкриваються англійською; додайте `#lang=uk` до адреси або натисніть UK угорі.

| Сторінка | Проблеми | Блокувальні · високі · середні · низькі | Серед них |
|---|---|---|---|
| [getlooploop.com/vectorscope](examples/ai-search-audit-getlooploop-vectorscope.html) | 18 | 0 · 0 · 7 · 11 | два посилання на сторінки 404, два запитання без відповіді в жодному уривку, бренд, якого модель не знає, розмітка How-to без розширеного результату |
| [getlooploop.com/uk/vectorscope](examples/ai-search-audit-getlooploop-vectorscope-uk.html) | 20 | 0 · 0 · 9 · 11 | те саме українською; ключова фраза з h1 трапляється у 2 з 15 розділів; ті самі факти в усіх трьох версіях |
| [getlooploop.com/es/vectorscope](examples/ai-search-audit-getlooploop-vectorscope-es.html) | 17 | 0 · 0 · 7 · 10 | те саме іспанською |
| [MDN: HTTP caching](examples/ai-search-audit-mdn-http-caching.html) | 10 | 0 · 0 · 3 · 7 | 6 уривків починаються з середини речення, зображення без width і height, немає розмітки Organization (без файлів суджень) |
| [example.com](examples/ai-search-audit-example-com.html) | 22 | 0 · 0 · 6 · 16 | немає h1; варіанти з http і www без переадресації; три запитання без відповіді; RFC 2606 та IANA, які модель знає, а сторінка не каже |

## Встановлення

Навичці потрібен Node 20.18 або новіший (цього вимагає cheerio) і **не потрібен `npm install`**: `dist/read.mjs` і `dist/audit.mjs` — це скрипти, зібрані разом з усім потрібним, зокрема з кодом Vectorscope і [cheerio](https://cheerio.js.org/), тож їх запускає звичайний `node`, зокрема в пісочницях, де встановлювати пакети заборонено. Читабельний код лежить у `scripts/`; `dist/` збирається з нього (див. *Робота над навичкою*).

### Однією командою (Claude Code, Codex, opencode та інші агенти)

```
npx skills add Olexan-art/ai-search-audit --skill ai-search-audit
```

[Програма skills](https://skills.sh) запитає, для яких агентів встановити навичку (додайте `-g`, щоб вона працювала в усіх проєктах, або `-a claude-code`, щоб вибрати одного агента). Далі попросіть агента: «зроби аудит для ШІ-пошуку сторінки <адреса>».

### claude.ai і застосунок Claude для комп’ютера

1. Завантажте **`ai-search-audit.zip`** з розділу [Releases](https://github.com/Olexan-art/ai-search-audit/releases) цього репозиторію. Не розпаковуйте його: завантажується сам zip, у якому на верхньому рівні лежить тека `ai-search-audit`.
2. Увімкніть виконання коду: **Settings > Capabilities > Code execution and file creation**. Без нього навички не працюють. У планах Team і Enterprise цим керує власник організації в Organization settings > Capabilities.
3. Завантажте навичку: **Customize > Skills**, кнопка **+**, **Create skill**, **Upload a skill**, далі виберіть `ai-search-audit.zip`. Увімкніть навичку в списку. У застосунку для комп’ютера це та сама сторінка Customize > Skills.
4. Дозвольте пісочниці доступ до сайту, який треба перевірити. Запуск завантажує сторінку, її `robots.txt`, sitemap і ще кілька адрес на тому самому сайті (див. *Мережа* нижче), а виконання коду бачить лише те, що дозволяє його мережеве налаштування. У планах Free, Pro і Max це **Allow network egress** у Settings > Capabilities. У планах Team і Enterprise власник вибирає в Organization settings > Capabilities: вимкнено, лише менеджери пакетів (за замовчуванням), менеджери пакетів і вказані домени або всі домени. Якщо вибрано вказані домени, додайте домен сайту. Якщо налаштування вашого плану не дозволяє цей сайт, запуск зупиниться з `REFUSED unreachable` і скаже про це; для такої сторінки скористайтеся Claude Code чи іншим агентом на своєму комп’ютері.
5. У чаті попросіть: **«зроби аудит для ШІ-пошуку сторінки https://example.com/page»**. Claude запустить скрипти в пісочниці й віддасть `report.html` файлом, який можна завантажити й відкрити в браузері, а в чаті напише коротке резюме.

**Вставити посилання на цей репозиторій у чат — не те саме, що встановити навичку.** Claude слушно не завантажує й не запускає код за посиланням, яке хтось вставив, тож щонайбільше відтворить кроки вручну, а такі знахідки — не результат інструмента. Завантажте zip, як описано вище.

Джерела: [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude) · [Create custom skills](https://claude.com/docs/skills/how-to) (структура zip, правила для назви й опису) · [Create and edit files with Claude](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude) (виконання коду й мережевий доступ) · [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) (мережевий доступ на різних платформах). Перевірено 16.10.2026.

## Використання з вашим агентом

Навичка — це одна тека, `skills/ai-search-audit`, з файлом `SKILL.md` і скриптами на Node. Агенти з підтримкою Agent Skills завантажують її зі своєї теки навичок; будь-який інший агент може виконувати `SKILL.md` як інструкцію. В обох випадках агент запускає ті самі скрипти з теки навички, а файли суджень пише модель самого агента. Нічого встановлювати не треба: агент запускає `node dist/read.mjs` і `node dist/audit.mjs` як є.

```
git clone https://github.com/Olexan-art/ai-search-audit.git
```

**Claude Code** завантажує особисті навички з `~/.claude/skills/`, а навички проєкту — з `.claude/skills/`.

```
mkdir -p ~/.claude/skills && cp -r ai-search-audit/skills/ai-search-audit ~/.claude/skills/ai-search-audit   # особисто
mkdir -p .claude/skills && cp -r ai-search-audit/skills/ai-search-audit .claude/skills/ai-search-audit       # або: лише цей проєкт
```

```powershell
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse ai-search-audit\skills\ai-search-audit "$HOME\.claude\skills\ai-search-audit"
```

**OpenAI Codex (CLI, розширення для IDE, застосунок)** переглядає `$HOME/.agents/skills` (рівень користувача) і `.agents/skills` у кожній теці від місця запуску до кореня репозиторію (рівень репозиторію).

```
mkdir -p ~/.agents/skills && cp -r ai-search-audit/skills/ai-search-audit ~/.agents/skills/ai-search-audit
```

```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
Copy-Item -Recurse ai-search-audit\skills\ai-search-audit "$HOME\.agents\skills\ai-search-audit"
```

**opencode** завантажує глобальні навички з `~/.config/opencode/skills/`, `~/.claude/skills/` або `~/.agents/skills/`, а навички проєкту — з `.opencode/skills/`, `.claude/skills/` або `.agents/skills/` (піднімаючись до кореня git). Копію, зроблену вище для Claude Code чи Codex, він теж підхопить; інакше:

```
mkdir -p ~/.config/opencode/skills && cp -r ai-search-audit/skills/ai-search-audit ~/.config/opencode/skills/ai-search-audit
```

**Hermes Agent (Nous Research)** тримає навички в `~/.hermes/skills/`. Він також читає `<проєкт>/.hermes/skills/` і `<проєкт>/.agents/skills/`, щойно ви позначите репозиторій довіреним командою `hermes skills trust`, і будь-яку теку зі списку `skills.external_dirs` у `~/.hermes/config.yaml` (наприклад, `~/.agents/skills`).

```
mkdir -p ~/.hermes/skills && cp -r ai-search-audit/skills/ai-search-audit ~/.hermes/skills/ai-search-audit
```

**GLM** (Zhipu / Z.ai) — це сімейство моделей, а не агент. GLM Coding Plan від Z.ai використовують усередині агентів для програмування; серед них його документація називає Claude Code, Codex і OpenCode. Встановіть навичку для того агента, у якому працює GLM, як описано вище: тоді навичка виконується за правилами цього агента, а файли суджень пише GLM.

**Будь-який інший агент:** вкажіть на навичку у файлі його інструкцій (наприклад, `AGENTS.md`), щоб він прочитав кроки, перш ніж почати:

```
For an SEO or AI search audit of a web page, follow skills/ai-search-audit/SKILL.md and run its scripts from that folder.
```

Джерела: [навички Claude Code](https://code.claude.com/docs/en/skills) · [навички Codex](https://learn.chatgpt.com/docs/build-skills) (сюди тепер переспрямовує developers.openai.com/codex/skills) · [навички opencode](https://opencode.ai/docs/skills) · [навички Hermes Agent](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) · [GLM Coding Plan від Z.ai](https://docs.z.ai/devpack/overview). Перевірено 16.10.2026; теки навичок змінюються між версіями, тож якщо шлях не спрацював, звірте з актуальною документацією свого агента.

## Запуск коротко

```
node dist/read.mjs https://example.com/page --out reading.json
# агент пише questions.json, brand.json і reviews.json (схеми в SKILL.md)
node dist/audit.mjs reading.json --questions questions.json --brand brand.json --reviews reviews.json --check
node dist/audit.mjs reading.json --questions questions.json --brand brand.json --reviews reviews.json --html report.html --md report.md --json export.json
```

**Мережа:** сторінка, `/robots.txt` її сайту, її sitemap (до 5 дочірніх sitemap), `/llms.txt`, до 10 мовних версій hreflang, запит HEAD (або GET без тіла) до 30 посилань і до 20 зображень, а також по одному запиту для favicon, шляху, якого не існує, до 3 варіантів адреси, Markdown-копії, `ai-catalog.json` і оголошеного ключа IndexNow; кожен ліміт звіт називає, нічого не обрізано мовчки. **Результати:** самодостатній `report.html` (EN | UK, світла тема за замовчуванням і темна на перемикачі, без мережевих запитів, кожен шматок тексту сторінки екрановано), `report.md` і `export.json` (`getlooploop/ai-search-audit@1`) з кожною знахідкою, її шаром, доказами й правилами, на які вона спирається.

### Власні пороги навички

Там, де опубліковане правило не дає числа: title від 10 до 60 символів; опис від 70 до 160; ланцюжок переадресацій — від 2 кроків; важка сторінка — понад 500 КБ HTML або 30 скриптів; незручна адреса — понад 115 символів, понад 2 параметри запиту або ідентифікатор сесії; приховані заголовки — висока серйозність від 200 прихованих символів; зображення понад 200 КБ, а srcset потрібен понад 100 КБ або від 800 px; перший екран — це hero і два перші зображення в ньому; `data-nosnippet` понад половину видимого тексту; оболонка застосунку — менше 150 слів; шаблонні звороти — середня серйозність від 2,0 на 1 000 слів; ключова фраза, якої немає в половині тексту уривків або яка трапляється в третині розділів чи менше. Кожен поріг — іменована константа в `skills/ai-search-audit/scripts/lib/` з причиною.

## Чого навичка не бачить

- **Даних реальних користувачів та індексу.** Core Web Vitals і «в індексі Google» завжди *не виміряно*: для них потрібні дані реальних відвідувачів і Search Console, яких у скрипта на одній сторінці немає.
- **Того, що асистенти відповідають сьогодні.** Прочитання бренду й відгуків — це знання однієї моделі на момент її навчання. Це не вимірювання жодного асистента, і воно нічого не каже про те, що зараз відповідають ChatGPT, Gemini чи Perplexity.
- **Сторінок за входом.** Одна публічна адреса на аудит, без cookies і без входу. Захист відмовляє для localhost, приватних і link-local адрес, імен хостів без крапки, нестандартних портів і всього, що не http(s), на кожному кроці переадресації (щонайбільше 5).
- **Мови, яку сайт вибирає за місцем.** Заголовок Accept-Language не надсилається, тож сайт, що вибирає мову за тим, звідки прийшов запит, може відповісти іншою мовою.
- **JavaScript, якщо його не просили.** Читання бере HTML таким, яким його віддав сервер. `--render` або порожня оболонка застосунку додатково запускають сторінку в локальному Chrome, Chromium чи Edge; якщо браузера немає, звіт каже, що рендер не виконано.
- **Усього, що за лімітом.** Перевіряється 30 посилань і 20 зображень, читається 10 мовних версій, відкривається 5 дочірніх sitemap; 12 секунд на запит (8 для посилання, зображення чи перевірки сайту), 3 000 000 символів HTML. Кожен ліміт звіт називає, жоден не застосовано мовчки.
- **Як це виправити.** Lite перелічує проблеми, але не пояснює їх і не пропонує виправлень.

## Робота над навичкою

`scripts/` — це вихідний код; `dist/` збирається з нього за допомогою [esbuild](https://esbuild.github.io/) (лише залежність для розробки) і лежить у репозиторії, тож навичка працює без встановлення.

```
cd skills/ai-search-audit
npm install          # cheerio і esbuild для збирання
npm run build        # scripts/ → dist/read.mjs, dist/audit.mjs (без мініфікації, читабельно)
npm test             # серед іншого перевіряє, що dist/ збігається зі свіжим збиранням, тож dist не розходиться зі scripts/
npm run zip          # dist-release/ai-search-audit.zip — файл, який додають до релізу для claude.ai
```

Змінили `scripts/` — запустіть `npm run build` і закомітьте обидва.

Читання, правила robots.txt, перевірки уривків і визначення мови — це код навички Vectorscope, перенесений без змін у [`skills/ai-search-audit/scripts/vendor/vectorscope/`](skills/ai-search-audit/scripts/vendor/vectorscope/VENDORED.md); там записано коміт і версію, з яких його скопійовано. Щоб оновити його, змініть код у getlooploop-skills, а тоді скопіюйте знову з локальної копії: `node tools/sync-vectorscope.mjs <шлях до getlooploop-skills>`, потім `npm run build && npm test`.

## Пов’язане

- [getlooploop-skills](https://github.com/Olexan-art/getlooploop-skills): навичка Vectorscope, яка показує, як ШІ-ретривер читає сторінку уривок за уривком, і порівнює від 2 до 5 сторінок. Читання ШІ в цій навичці — це її код.
- [GetLoopLoop](https://www.getlooploop.com) і вебверсія [Vectorscope](https://www.getlooploop.com/uk/vectorscope).

## Ліцензія

Вільно використовуйте, змінюйте й поширюйте за ліцензією MIT, див. [LICENSE](LICENSE). Якщо публікуєте щось, зроблене з її допомогою, будемо вдячні за посилання на [getlooploop.com](https://www.getlooploop.com).
