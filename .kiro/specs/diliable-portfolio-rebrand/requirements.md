# Requirements Document

## Introduction

Данная спецификация описывает ребрендинг и адаптацию существующего портфолио-сайта (React 19 + Vite 7, домен `https://xayrusha.uz`, персоналия Raxmonberganov Xayrullo / Xayrusha) под нового владельца — **Dilshodbek Karribayev (бренд DiliAble)**, Full Stack Technology Engineer из Узбекистана. Задача — полностью заменить персональный контент (имя, био, скиллы, проекты, соцсети, SEO-метаданные, ассеты, копирайт-строки), сохранив при этом текущую дизайн-систему, структуру секций, роутинг, анимации и технологический стек. Ребрендинг не подразумевает редизайна визуальной системы или добавления новых крупных фич — это в первую очередь замена данных, копий, ассетов и метаданных.

Сайт остаётся одностраничным (Home) с отдельным списком проектов (`/work`) и динамическими страницами кейсов (`/work/:projectId`). Работа затрагивает `src/data/siteData.js`, `src/data/projectsData.js`, `index.html`, `public/robots.txt`, `public/sitemap.xml`, ассеты `src/assets/Me`, `public/assets/demo`, `public/brand`, `public/favicon.svg`, а также захардкоженные бренд-строки в компонентах `HeaderNav`, `HeroSection`, `AboutSection`, `TopCardsSection`, `BehindCurtains`, `FooterSection`, `BlogsSection`, `ScrollRevealStatement`, `MarqueeRibbon`, `App.jsx` и в тестах `HeroSection.test.jsx`, `siteData.test.js`.

## Clarifications / Assumptions

Открытые вопросы, зафиксированные до имплементации. По каждому пункту указано принятое допущение по умолчанию — при отсутствии уточнений от владельца применяется именно оно.

- **Домен и канонические URL.** Новый домен от владельца не получен. Допущение по умолчанию: использовать placeholder `https://diliable.uz` во всех местах (`index.html`, `App.jsx` константа `SITE_URL`, `robots.txt`, `sitemap.xml`, `og:url`, `schema.org`). Если реальный домен отличается — заменить одной глобальной подстановкой перед деплоем.
- **Язык раздела About.** По умолчанию: английский (текст владельца предоставлен на английском и используется дословно). Русская локализация — вне scope этого спека.
- **Локация в Hero/Header.** Владельцем указано «Узбекистан», конкретный город не подтверждён. Допущение: `Uzbekistan` без города (в `HeroSection` вместо «Based in Urgench, Uzbekistan» — «Based in Uzbekistan»).
- **Основной GitHub-аккаунт.** Указаны два: `DiliAble` и `DilshodbekKarribayev`. Допущение: primary = `DiliAble` (используется в `VITE_GITHUB_USERNAME`, шапке, футере, виджете последнего пуша, `sameAs`). Второй аккаунт `DilshodbekKarribayev` не показывается, чтобы не дублировать точки контакта.
- **LinkedIn.** Не предоставлен. Допущение: LinkedIn-ссылка удаляется из UI (иконки LinkedIn в About/Footer/TopCards скрываются), поле `socialLinks.linkedin` удаляется, из `schema.org sameAs` LinkedIn-URL исключается. Twitter/X также остаётся `#` и скрывается по тому же правилу.
- **Телефон.** Указан номер `773160155`. Код страны не подтверждён; допущение — Узбекистан, итог `+998 77 316 01 55`. Телефон отображается как `tel:` ссылка в футере (колонка Contact) и в контактной форме под email. WhatsApp/звонки как отдельная кнопка не добавляются, если владелец явно не запросит.
- **Аккаунты `Karribayev004` и `Diliable2306`.** Платформа не идентифицирована; в UI не добавляются до подтверждения владельцем.
- **Скиллы: формат отображения.** Владелец предоставил 11 категорий с emoji-заголовками и списками технологий. Допущение по умолчанию: `SkillsSection` переработать под группировку по категориям (emoji + название категории + горизонтальный набор `SkillChip` внутри группы). Плоский список сохранять нельзя, потому что теряется семантика категорий.
- **Проекты без скриншотов.** Владелец дал 3 web-URL и 4 Instagram-URL для hardware-проектов, но не предоставил ни описаний, ни скриншотов, ни meta. Допущение по умолчанию:
  - Web-проекты обязательны и остаются полноценными кейсами с детальной страницей `/work/:projectId`. Скриншоты формируются автоматической генерацией (например, через сторонний скриншот-сервис) как web-превью для устройств mobile/tablet/desktop, либо, до появления реальных скриншотов, показывается `DevicePlaceholder` (уже существующий компонент) с текстом. Тексты (`tagline`, `description`, `features`, `responsibilities`) заполняются владельцем позднее; до этого используются короткие placeholder-строки, помеченные в исходнике комментарием `TODO: filled by owner`.
  - Hardware-проекты рендерятся как отдельная категория «Hardware / Embedded» и НЕ имеют детальной страницы `/work/:projectId`. Каждый hardware-проект — карточка, где кнопка CTA открывает соответствующий Instagram-пост в новой вкладке (`target="_blank"`, `rel="noopener noreferrer"`). Скриншоты не требуются; на карточке — Instagram-иконка + короткое название + Instagram-ссылка.
- **Blogs/Testimonials секции.** `TestimonialsSection` рендерит `null` при пустом массиве — оставляем как есть, массив пустой. `BlogsSection` (id `experience`) содержит захардкоженный timeline опыта Xayrusha — контент требует замены на опыт нового владельца; если у владельца нет данных об опыте, секция целиком удаляется из `App.jsx` и `BlogsSection.jsx` (по умолчанию: удалить, потому что данных нет).
- **BehindCurtains: музыкальный виджет.** Виджет с треком `8-milya.mp3` (Miyagi & Endshpil) не связан с Xayrusha и является общей «фишкой» сайта — по умолчанию оставляем как есть (файл, название трека, атрибуцию). Если владелец захочет заменить/убрать — это отдельный запрос.
- **ProfileCard `handle`.** В `AboutSection` захардкоден `handle="xayrusha"` и `name="Xayrusha"`. Допущение по умолчанию: `handle="diliable"`, `name="DiliAble"` (бренд-алиас; полное имя показывается в другом месте).
- **Дата копирайта в футере.** Сейчас `© 2026 XAYRUSHA`. Допущение: `© {currentYear} DILIABLE` (2026 → используется реальный текущий год либо оставить статичное 2026 до конца года).
- **Favicon.** `public/favicon.svg` универсальный SVG, не привязан к персоне — оставляем без изменений, если владелец не предоставит новый.

## Glossary

- **Portfolio_Site**: React-приложение, собираемое Vite, обслуживаемое как SPA по каноническому домену.
- **Site_Data_Module**: файл `src/data/siteData.js`, единая точка для nav, skills, about, footer, socials.
- **Projects_Data_Module**: файл `src/data/projectsData.js`, единая точка для каталога кейсов.
- **Hero_Section**: компонент `src/components/sections/HeroSection.jsx` — первый экран с крупным именем и CTA.
- **Header_Nav**: компонент `src/components/layout/HeaderNav.jsx` — плавающая шапка с логотипом и навигацией.
- **Footer_Section**: компонент `src/components/sections/FooterSection.jsx` — контактная секция + подвал.
- **About_Section**: компонент `src/components/sections/AboutSection.jsx` — блок «О себе» с фото и социалами.
- **Skills_Section**: компонент `src/components/sections/SkillsSection.jsx` — сетка технологий.
- **Projects_Section**: компонент `src/components/sections/ProjectsSection.jsx` — список кейсов на `/work`.
- **Work_Detail_Page**: компонент `src/components/pages/WorkDetailPage.jsx` — детальная страница кейса `/work/:projectId`.
- **Blogs_Section**: компонент `src/components/sections/BlogsSection.jsx` — секция опыта (id=`experience`).
- **Testimonials_Section**: компонент `src/components/sections/TestimonialsSection.jsx` — отзывы (сейчас пусто, рендерит `null`).
- **BehindCurtains_Section**: компонент `src/components/sections/BehindCurtains.jsx` — виджет GitHub + music + focus.
- **Marquee_Ribbon**: компонент `src/components/sections/MarqueeRibbon.jsx` — бегущая строка по `marqueeWords`.
- **ScrollReveal_Statement**: компонент `src/components/sections/ScrollRevealStatement.jsx` — большая цитата с pop-in анимацией.
- **TopCards_Section**: компонент `src/components/sections/TopCardsSection.jsx` — набор карточек под Hero.
- **SEO_Bundle**: набор SEO-артефактов: `index.html`, meta-теги в `App.jsx`, `public/robots.txt`, `public/sitemap.xml`, JSON-LD Person/WebSite.
- **Brand_Assets**: файлы `public/brand/xayrusha-lockup.svg`, `public/brand/xayrusha-mark.svg`, `public/assets/demo/xayrusha-avatar.svg`, `public/assets/demo/xayrusha-photo.jpg`, `src/assets/Me/image.webp`, `public/favicon.svg`.
- **Skill_Group**: объект `{ category: string, emoji: string, items: Array<{ name: string, icon?: LucideIcon, color?: string }> }`, отображаемый как заголовок + горизонтальный набор `SkillChip`.
- **Web_Project**: проект типа `web`, имеет `liveUrl`, `deviceScreens`, страницу `/work/:projectId`.
- **Hardware_Project**: проект типа `hardware`, имеет только `instagramUrl`, страницы `/work/:projectId` не имеет, CTA открывает Instagram-пост в новой вкладке.
- **Contact_Channel**: любой из `{ email, telegram, phone, instagram, github }`, отображаемый в Footer_Section и/или в TopCards_Section.
- **Canonical_Domain**: строка вида `https://<host>` без хвостового слеша, используемая во всех абсолютных URL. Значение по умолчанию: `https://diliable.uz`.

## Requirements

### Requirement 1: Замена персональных строк и брендинга

**User Story:** Как владелец нового портфолио (Dilshodbek Karribayev / DiliAble), я хочу, чтобы все упоминания имени и бренда Xayrusha были заменены на моё имя и бренд, чтобы сайт представлял именно меня.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display the string `DiliAble` as the brand short name and `Dilshodbek Karribayev` as the full personal name in every user-visible location where the strings `Xayrusha` and `Raxmonberganov Xayrullo` currently appear.
2. THE Hero_Section SHALL render the visible headline `DiliAble` in place of the current `Xayrusha` headline in `src/components/sections/HeroSection.jsx`.
3. THE Header_Nav SHALL render the visible brand label `DiliAble` in place of the current `Xayrusha` label next to the logo image.
4. THE TopCards_Section SHALL render the visible heading `DiliAble` and the subtitle `FULL STACK TECHNOLOGY ENGINEER` in the identity card that currently displays `Xayrusha` / `FULL STACK DEVELOPER`.
5. THE Footer_Section SHALL render the brand heading `DILIABLE` in place of the current `XAYRUSHA` heading and the copyright line `© 2026 DILIABLE. ALL RIGHTS RESERVED.` in place of the current `© 2026 XAYRUSHA. ALL RIGHTS RESERVED.` line.
6. THE About_Section SHALL render the ProfileCard with `name="DiliAble"` and `handle="diliable"` in place of the current `name="Xayrusha"` and `handle="xayrusha"` values, and SHALL render the caption `DILIABLE` with subtitle `Full Stack Technology Engineer` in place of the current `XAYRUSHA` / `Full Stack Development` caption block.
7. WHEN the codebase is searched case-insensitively for the substring `xayrusha`, THE Portfolio_Site SHALL contain zero occurrences of that substring in user-visible strings, `alt` attributes, JSDoc comments referring to the persona, or JSON-LD `sameAs` entries, except for filename references that are being renamed as part of Requirement 8.
8. WHEN the codebase is searched case-insensitively for the substring `Raxmonberganov` or `Xayrullo`, THE Portfolio_Site SHALL contain zero occurrences of those substrings anywhere in `src/`, `public/`, or `index.html`.

### Requirement 2: Обновление роли и hero-подзаголовка

**User Story:** Как владелец, я хочу, чтобы моя роль отражала мою специализацию — Full Stack Technology Engineer, а hero-подпись перечисляла ключевые области, чтобы посетитель сразу понимал широту компетенций.

#### Acceptance Criteria

1. THE Hero_Section SHALL render the eyebrow line `Data • Hardware • Embedded • Design • Web • Innovation` (with U+2022 bullets) in place of the current `I DESIGN AND BUILD WEB PRODUCTS THAT` line above the CTA buttons.
2. THE Hero_Section SHALL render the bottom-right label `FULL STACK TECHNOLOGY ENGINEER` in place of the current `FULL STACK DEV, FRONTEND FOCUSED` two-line label.
3. THE Hero_Section SHALL render the bottom-left location label as `Based in Uzbekistan` on a single line, replacing the current two-line `Based in Urgench, Uzbekistan` label, unless a specific city is provided by the owner.
4. WHERE a specific city has been provided by the owner via the Clarifications resolution, THE Hero_Section SHALL render `Based in {City},` on the first line and `Uzbekistan` on the second line following the current visual pattern.
5. THE index.html `<title>` element SHALL contain the exact string `Dilshodbek Karribayev (DiliAble) | Full Stack Technology Engineer` in place of the current title.
6. THE index.html `<meta name="author">` tag SHALL contain the value `Dilshodbek Karribayev (DiliAble)` in place of the current author value.

### Requirement 3: Замена текста «О себе»

**User Story:** Как владелец, я хочу, чтобы блок About описывал меня как мультидисциплинарного инженера с уклоном в hardware, data и design, чтобы посетитель точно понимал, чем я занимаюсь.

#### Acceptance Criteria

1. THE Site_Data_Module SHALL export `aboutText.heading` equal to the exact string `Full Stack Technology Engineer` in place of the current `Full-Stack Developer` value.
2. THE Site_Data_Module SHALL export `aboutText.headingHighlight` equal to the exact string `multidisciplinary approach` in place of the current `frontend-first approach` value.
3. THE Site_Data_Module SHALL export `aboutText.paragraphs` as an ordered array of exactly five strings, matching the owner-supplied bio, in the following order and content:
   1. `Building innovative products through engineering, data, and design.`
   2. `I am a multidisciplinary engineer passionate about transforming ideas into real-world products. My expertise spans hardware development, embedded systems, data analytics, telecommunications, and digital design, allowing me to manage projects from concept to deployment.`
   3. `With hands-on experience in SQL, Power BI, Arduino, web development, and creative design tools, I focus on building solutions that are practical, efficient, and visually refined. I enjoy solving complex technical challenges by combining engineering principles with modern technologies.`
   4. `Beyond engineering, I actively participate in startup projects, prototype new ideas, and continuously expand my knowledge across multiple technology fields. My goal is not only to build functional systems but also to create products that deliver real value.`
   5. `If I had to describe my work in one sentence: I transform ideas into intelligent products by combining engineering, data, software, and creative design.`
4. THE About_Section SHALL render the paragraphs from `aboutText.paragraphs` in the same array order as defined by the Site_Data_Module.
5. WHEN a paragraph from `aboutText.paragraphs` is longer than the current `max-w-[64ch]` container width, THE About_Section SHALL wrap the paragraph across multiple visual lines without truncation or ellipsis.

### Requirement 4: Скиллы, сгруппированные по категориям

**User Story:** Как владелец, я хочу, чтобы мои скиллы отображались по категориям (Data Analytics, Web, Embedded, CAD, Design, Video, 3D, Office, Collaboration, OS, VCS) с emoji-заголовками, чтобы структура компетенций была наглядной.

#### Acceptance Criteria

1. THE Site_Data_Module SHALL export the identifier `skillGroups` as an ordered array of Skill_Group objects, replacing the current flat `skillset` array.
2. THE Site_Data_Module `skillGroups` array SHALL contain exactly the following 11 groups, in the specified order, each with the specified emoji, category name, and items (verbatim item names):
   1. emoji=`💻`, category=`Data Analytics`, items=[`SQL`, `Microsoft SQL Server`, `MySQL`, `PostgreSQL`, `Power BI`, `Microsoft Excel`, `Google Sheets`]
   2. emoji=`🌐`, category=`Web Development`, items=[`HTML5`, `CSS3`, `Bootstrap`, `GitHub`]
   3. emoji=`🤖`, category=`Embedded Systems & Electronics`, items=[`Arduino IDE`, `ESP-IDF`, `Tinkercad Circuits`]
   4. emoji=`⚙️`, category=`CAD / Engineering`, items=[`AutoCAD`]
   5. emoji=`🎨`, category=`Graphic Design`, items=[`CorelDRAW`, `Adobe Photoshop`, `Adobe Illustrator`, `Canva`]
   6. emoji=`🎬`, category=`Video Editing`, items=[`Adobe Premiere Pro`, `DaVinci Resolve`, `CapCut`]
   7. emoji=`📷`, category=`3D & Visualization`, items=[`Tinkercad`]
   8. emoji=`📄`, category=`Office`, items=[`Microsoft Word`, `Microsoft PowerPoint`, `Microsoft Excel`, `Microsoft Access`]
   9. emoji=`☁️`, category=`Collaboration`, items=[`Microsoft Teams`, `Zoom`, `Google Meet`]
   10. emoji=`💻`, category=`Operating Systems`, items=[`Windows`, `macOS`, `Linux (Ubuntu)`]
   11. emoji=`🛠️`, category=`Version Control`, items=[`GitHub`]
3. THE Skills_Section SHALL render each Skill_Group as a labelled block containing the emoji, the category name, and a horizontal wrapping row of `SkillChip` components — one chip per item in that group.
4. THE Skills_Section SHALL render Skill_Group blocks in the order defined by `skillGroups` in the Site_Data_Module.
5. WHERE a `SkillChip` item does not have an explicit Lucide icon and colour, THE Skills_Section SHALL fall back to a neutral default icon and colour (`Layers3` icon, colour `#a1a1aa`) so no chip is rendered without a visual marker.
6. THE Site_Data_Module SHALL either remove the legacy `skillset` export or re-export it as a flattened `skillGroups.flatMap((g) => g.items)` compatibility alias, so no other module breaks at import time.
7. WHEN the Skills_Section is rendered on a viewport of width `< 640px`, THE Skills_Section SHALL stack Skill_Group blocks vertically without horizontal overflow of the section container.

### Requirement 5: Каталог проектов — web-проекты как полноценные кейсы

**User Story:** Как владелец, я хочу, чтобы мои три web-проекта присутствовали в каталоге как обычные кейсы с детальной страницей, чтобы посетитель мог их изучить.

#### Acceptance Criteria

1. THE Projects_Data_Module SHALL export the identifier `projects` as an ordered array containing exactly three Web_Project entries with the following `id`, `name` and `liveUrl` values:
   1. `id="exam-morse"`, `name="Exam Morse"`, `liveUrl="https://exammorse.netlify.app/"`
   2. `id="teacher-urdu"`, `name="Teacher Urdu"`, `liveUrl="http://teacherurdu.netlify.app/"`
   3. `id="catelnium"`, `name="Catelnium"`, `liveUrl="https://catelnium.unusual.uz/"`
2. THE Projects_Data_Module SHALL define, for each Web_Project, the following required fields with valid, non-empty values: `id`, `name`, `href` matching the pattern `/work/{id}`, `cta` (default `View live site`), `tagline`, `description`, `role`, `tags` (non-empty array of strings), `features` (non-empty array of strings), `deviceScreens.desktop`, `deviceScreens.tablet`, `deviceScreens.mobile`, `gallery` (array of at least one `{ key, title, src }` entry).
3. WHERE the owner has not yet provided real screenshots for a Web_Project, THE Projects_Data_Module SHALL set `deviceScreens.desktop`, `deviceScreens.tablet`, `deviceScreens.mobile` and every `gallery[i].src` to `null` so that the existing `DevicePlaceholder` component renders in place of an image.
4. WHERE the owner has not yet provided a detailed description for a Web_Project, THE Projects_Data_Module SHALL set `tagline`, `description`, `features` (single-element array), `role`, and `tags` to short placeholder strings marked in the source with a `// TODO: filled by owner` inline comment on the object.
5. THE Work_Detail_Page SHALL render for every Web_Project id defined in `projects` and SHALL NOT redirect that id to the NotFoundPage route.
6. THE Work_Detail_Page SHALL render a `Visit live site` link with the value of `liveUrl` for every Web_Project that has a non-null `liveUrl`, opening the target URL in a new tab with `rel="noopener noreferrer"`.
7. THE App.jsx SEO block SHALL treat every Web_Project id as a known path when generating `document.title` and canonical metadata, so a route like `/work/exam-morse` SHALL NOT be marked `noindex, nofollow`.

### Requirement 6: Каталог проектов — hardware-проекты как внешние ссылки

**User Story:** Как владелец, я хочу, чтобы мои hardware-проекты, у которых есть только Instagram-посты, показывались в отдельной категории и вели напрямую в Instagram, чтобы посетитель мог увидеть реальные фото и видео.

#### Acceptance Criteria

1. THE Projects_Data_Module SHALL export the identifier `hardwareProjects` as an ordered array of Hardware_Project entries, each with the following required fields and constraints: `id` (non-empty string, unique across both the `hardwareProjects` array and the Web_Project `projects` array), `name` (non-empty string), `instagramUrl` (non-empty string that starts with the prefix `https://www.instagram.com/p/`), `tagline` (non-empty string), and `tags` (array containing at least one non-empty string).
2. THE Projects_Data_Module `hardwareProjects` array SHALL contain exactly four Hardware_Project entries whose `instagramUrl` values are, in this order:
   1. `https://www.instagram.com/p/DYr8nKmKM8N/`
   2. `https://www.instagram.com/p/DZnXR9uOVUf/`
   3. `https://www.instagram.com/p/DXo0FIQikGr/`
   4. `https://www.instagram.com/p/DQUUKfjirvV/`
3. THE Projects_Section SHALL render Hardware_Project entries as a separate group that is (a) preceded by a dedicated heading element whose visible text equals exactly `Hardware & Embedded`, and (b) placed after all Web_Project cards in the DOM order of the Projects_Section container.
4. WHEN a user activates the CTA of a Hardware_Project card by primary mouse click, by pressing the `Enter` key while the CTA has keyboard focus, or by pressing the `Space` key while the CTA has keyboard focus, THE Projects_Section SHALL open the corresponding `instagramUrl` in a new browser tab using an `<a>` element that has `target="_blank"` and `rel="noopener noreferrer"` attributes.
5. IF a visitor navigates to a URL matching `/work/{id}` where `{id}` equals the `id` of any Hardware_Project entry, THEN THE Work_Detail_Page SHALL render the NotFoundPage content and SHALL NOT render any project detail layout for that `{id}`.
6. WHERE a Hardware_Project entry has no owner-supplied description text and no owner-supplied preview image, THE Projects_Section SHALL render the corresponding hardware card with (a) the project `name` as the visible title, (b) the visible tagline text `View on Instagram`, (c) an Instagram icon glyph, and (d) a CTA button whose visible label equals exactly `Open on Instagram`.
7. IF the current pathname matches `/work/{id}` and `{id}` equals the `id` of any Hardware_Project entry, THEN THE App.jsx SEO block SHALL set the `<meta name="robots">` content attribute to `noindex, nofollow` and SHALL set the document title to the NotFoundPage title, so that search engines do not index Hardware_Project paths.

### Requirement 7: Обновление списка проектов в футере и сайтмапе

**User Story:** Как владелец, я хочу, чтобы навигация по проектам в футере и сайтмап отражали только реальные страницы кейсов, чтобы избежать битых ссылок.

#### Acceptance Criteria

1. THE Site_Data_Module `footerColumns` entry with `title="Projects"` SHALL contain exactly one link per Web_Project defined by the Projects_Data_Module, using `label = project.name` and `href = project.href`, in the same order as `projects`.
2. THE Site_Data_Module `footerColumns` entry with `title="Projects"` SHALL NOT contain links whose `href` points to a Web_Project id that is not defined in the Projects_Data_Module.
3. THE public/sitemap.xml file SHALL contain a `<url><loc>` entry for `{Canonical_Domain}/`, `{Canonical_Domain}/work`, and one entry per Web_Project of the form `{Canonical_Domain}/work/{projectId}`, and SHALL NOT contain entries for any legacy Xayrusha project ids (`filmzone`, `dream-go`, `finance`, `mchs`, `temp-monitoring`).
4. THE public/sitemap.xml file SHALL NOT contain `<url>` entries for Hardware_Project ids.
5. THE App.jsx `/work` route SEO description SHALL list the names of the current Web_Project entries (comma-separated) in place of the current hard-coded `FilmZone Pro, Dream Go, Finance Empire, MISM MCHS, and IoT Monitoring Platform` list.

### Requirement 8: Замена бренд-ассетов и удаление устаревших файлов

**User Story:** Как владелец, я хочу, чтобы графические ассеты (логотип, аватар, фото) больше не содержали изображения Xayrusha, чтобы сайт визуально принадлежал мне.

#### Acceptance Criteria

1. THE Brand_Assets set SHALL, upon completion of the rebrand, contain a mark file at `public/brand/diliable-mark.svg` and a lockup file at `public/brand/diliable-lockup.svg` that the site references in place of the current `xayrusha-mark.svg` and `xayrusha-lockup.svg` files.
2. WHERE the owner has not yet supplied final brand vector files, THE Brand_Assets set SHALL contain placeholder SVG files at `public/brand/diliable-mark.svg` and `public/brand/diliable-lockup.svg` whose content SHALL be a simple monogram of the letters `DA` on a transparent background, so that the site does not display a broken image icon.
3. THE Header_Nav `<img>` tag SHALL reference the path `/brand/diliable-mark.svg` and SHALL use `alt=""` (decorative image) so no screen reader announces the placeholder.
4. THE TopCards_Section identity card `<img>` tag SHALL reference the path `/brand/diliable-mark.svg` and SHALL use `alt="DiliAble logo"`.
5. WHERE the owner has provided a real personal photo, THE About_Section SHALL reference that photo through the import currently resolving to `src/assets/Me/image.webp`, and the file at `src/assets/Me/image.webp` SHALL be replaced with the owner-supplied photo.
6. WHERE the owner has not provided a personal photo, THE About_Section SHALL either fall back to the `avatarUrl` prop pointing at `public/brand/diliable-mark.svg`, or SHALL render the ProfileCard with `avatarUrl={undefined}` so the existing initials fallback in `ProfileCard` is shown.
7. THE public/assets/demo folder SHALL either not contain the files `xayrusha-avatar.svg` and `xayrusha-photo.jpg`, or SHALL contain them only as unreferenced files pending physical deletion in a follow-up cleanup task.
8. THE Portfolio_Site SHALL NOT contain any active import or `<img src>` reference to a file whose path contains the substring `xayrusha` after the rebrand is completed.
9. THE public/favicon.svg file SHALL remain unchanged if the owner has not provided a replacement, and the `<link rel="icon">` tag in `index.html` SHALL continue to reference `/favicon.svg`.

### Requirement 9: SEO, canonical и schema.org

**User Story:** Как владелец, я хочу, чтобы поисковые системы индексировали сайт под моим именем и брендом, чтобы люди находили меня.

#### Acceptance Criteria

1. THE index.html `<meta name="description">` tag SHALL contain a description referencing `Dilshodbek Karribayev (DiliAble)`, the role `Full Stack Technology Engineer`, and the domain areas `data, hardware, embedded, web, and design`, and SHALL NOT contain the strings `Xayrusha`, `Raxmonberganov`, `React, Vite, Tailwind CSS, Express, and PostgreSQL`.
2. THE index.html `<link rel="canonical">` tag SHALL use `href="{Canonical_Domain}/"` where `Canonical_Domain` is `https://diliable.uz` (default) or the owner-confirmed domain.
3. THE index.html Open Graph and Twitter tags (`og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:title`, `twitter:description`, `twitter:image`) SHALL be updated to reflect the DiliAble brand, the new title, description, and `Canonical_Domain` values, and the `og:image` and `twitter:image` SHALL point at a path under `{Canonical_Domain}/brand/diliable-mark.svg` (default) until an OG photo is supplied.
4. THE index.html JSON-LD `WebSite` node SHALL set `@id`, `url`, `name` (`DiliAble`), and `alternateName` (`Dilshodbek Karribayev`) values that match the new brand.
5. THE index.html JSON-LD `Person` node SHALL set:
   1. `@id` = `{Canonical_Domain}/#person`
   2. `name` = `Dilshodbek Karribayev`
   3. `alternateName` = `["DiliAble"]`
   4. `url` = `{Canonical_Domain}/`
   5. `image` = `{Canonical_Domain}/brand/diliable-mark.svg` (or the resolved OG photo path)
   6. `jobTitle` = `["Full Stack Technology Engineer"]`
   7. `address.addressCountry` = `UZ`
   8. `sameAs` = an ordered list containing exactly the resolved primary GitHub URL (`https://github.com/DiliAble`), the Telegram URL (`https://t.me/karribayev`), the Instagram URL (`https://www.instagram.com/karribayev_004/`), and the `mailto:diliable004@gmail.com` URL.
6. THE index.html JSON-LD `sameAs` list SHALL NOT contain any `linkedin.com` URL until the owner supplies a LinkedIn profile URL.
7. THE App.jsx `SITE_URL` constant SHALL equal `Canonical_Domain` and SHALL be used consistently in every `og:url`, `og:image`, `twitter:image`, and `<link rel="canonical">` upsert.
8. THE App.jsx `DEFAULT_SEO.title` SHALL equal `Dilshodbek Karribayev (DiliAble) | Full Stack Technology Engineer` in place of the current default title.
9. THE App.jsx `DEFAULT_SEO.description` SHALL equal the same description string used in the index.html `<meta name="description">` tag (Requirement 9.1).
10. THE public/robots.txt file SHALL contain `Sitemap: {Canonical_Domain}/sitemap.xml` in place of the current `https://xayrusha.uz/sitemap.xml` line.

### Requirement 10: Контакты и социальные ссылки

**User Story:** Как владелец, я хочу, чтобы посетители могли связаться со мной через email, Telegram, Instagram, телефон и GitHub, и все ссылки должны быть корректными и рабочими.

#### Acceptance Criteria

1. THE Site_Data_Module `socialLinks` object SHALL contain exactly the following key-value pairs, and SHALL NOT contain a `linkedin` key or a `twitter` key:
   1. `github` = `https://github.com/DiliAble`
   2. `telegram` = `https://t.me/karribayev`
   3. `instagram` = `https://www.instagram.com/karribayev_004/`
   4. `email` = `mailto:diliable004@gmail.com`
   5. `phone` = `tel:+998773160155`
2. THE Footer_Section SHALL render in the `Socials` footer column exactly three links, in this order — `GitHub`, `Telegram`, `Instagram` — with `href` values equal to `socialLinks.github`, `socialLinks.telegram`, and `socialLinks.instagram` respectively, and SHALL NOT render a `LinkedIn`, `Email`, or `Phone` link in this column.
3. THE Footer_Section SHALL render in the `Contact` footer column an `Email` link with `href={socialLinks.email}` and visible label `diliable004@gmail.com`, and a `Phone` link with `href={socialLinks.phone}` and visible label `+998 77 316 01 55`; neither of these links SHALL have the `target="_blank"` attribute set.
4. THE Footer_Section round-icon strip SHALL render exactly four icon buttons, in this order — `GitHub`, `Telegram`, `Instagram`, `Email` — with `href` values equal to `socialLinks.github`, `socialLinks.telegram`, `socialLinks.instagram`, and `socialLinks.email` respectively, and SHALL NOT render a `LinkedIn` icon.
5. THE About_Section round-icon strip SHALL render exactly three icon buttons, in this order — `GitHub`, `Telegram`, `Instagram` — with `href` values equal to `socialLinks.github`, `socialLinks.telegram`, and `socialLinks.instagram` respectively, and SHALL NOT render a `LinkedIn` or `Twitter` icon.
6. THE TopCards_Section identity card social row SHALL render exactly three icon buttons, in this order — `GitHub`, `Telegram`, `Instagram` — with `href` values equal to `socialLinks.github`, `socialLinks.telegram`, and `socialLinks.instagram` respectively, and SHALL NOT render a `LinkedIn` or `Twitter` icon.
7. THE BehindCurtains_Section round-icon strip in the GitHub widget SHALL render exactly two icon buttons, in this order — `GitHub` and `Telegram` — with `href` values equal to `socialLinks.github` and `socialLinks.telegram` respectively, and SHALL NOT render a `LinkedIn` icon.
8. THE TopCards_Section `EMAIL` constant SHALL equal the string `diliable004@gmail.com` in place of the current `xayrulloweb@gmail.com` value.
9. THE Footer_Section `contactEmail` derived value SHALL equal the string `diliable004@gmail.com` at runtime.
10. THE Footer_Section Telegram fallback SHALL use `https://t.me/karribayev` in place of the current `https://t.me/Xayrusha` fallback.
11. Every external-profile link/icon-button (`github`, `telegram`, `instagram`) rendered inside Footer_Section, About_Section, TopCards_Section, and BehindCurtains_Section SHALL have `target="_blank"`, `rel="noopener noreferrer"`, and an `aria-label` that equals exactly the platform name (`GitHub`, `Telegram`, `Instagram`); links using the `mailto:` and `tel:` schemes SHALL have an `aria-label` equal to `Email` and `Phone` respectively.
12. IF a `socialLinks` field required to render a link/icon-button is missing, is an empty string, or equals `#`, THEN the corresponding link/icon-button SHALL NOT be rendered, and the remaining elements in the same row/column SHALL preserve their specified order without leaving empty gaps.
13. IF the owner later supplies a LinkedIn URL, THEN THE Site_Data_Module SHALL be extended by adding a `linkedin` key to `socialLinks`, and the Footer_Section, About_Section, TopCards_Section, and BehindCurtains_Section SHALL each render a `LinkedIn` icon linking to that URL; until such URL is supplied, no `LinkedIn` icon SHALL be rendered.

### Requirement 11: Обновление marquee, ScrollReveal и BehindCurtains-копи

**User Story:** Как владелец, я хочу, чтобы декоративные фразы, бегущая строка и цитаты отражали мою мультидисциплинарную специализацию, а не React/Tailwind-стек Xayrusha.

#### Acceptance Criteria

1. THE Site_Data_Module `marqueeWords` array SHALL contain exactly the following ordered strings, in place of the current list: `DATA ANALYTICS`, `HARDWARE`, `EMBEDDED SYSTEMS`, `ARDUINO`, `SQL / POWER BI`, `WEB DEVELOPMENT`, `GRAPHIC DESIGN`, `VIDEO EDITING`, `AUTOCAD`, `INNOVATION`.
2. THE ScrollReveal_Statement `PHRASE` array SHALL render the sentence `I transform ideas into intelligent products by combining engineering, data, software, and creative design.`, tokenised into words with the highlight flags set for the words `intelligent`, `engineering`, `data`, and `creative`.
3. THE BehindCurtains_Section `<h2>` SHALL render the two lines `Decoding hardware` and `and shipping software`, in place of the current `Decoding logic` / `and the lyrics` lines.
4. THE BehindCurtains_Section current-focus card SHALL render the copy `Building multidisciplinary products across data, hardware, and web at DiliAble.` in place of the current `Building production interfaces at Unusual with a frontend-first workflow.` copy.
5. THE BehindCurtains_Section current-focus chip row SHALL render exactly the three chips `Arduino`, `SQL`, `React`, in that order, in place of the current `React`, `TypeScript`, `Node` chips.
6. THE BehindCurtains_Section current-focus chip footer SHALL render the tenure label `2024 - Present` in place of the current `Aug 2025 - Present` label.
7. THE TopCards_Section philosophy card SHALL render the heading `Products` and the script line `that feel intelligent.`, and the descriptive paragraph SHALL reference `engineering, data, and design` — replacing the current `Interfaces` / `you can feel.` / interface-focused paragraph.
8. THE TopCards_Section philosophy card chip row SHALL render exactly the four chips `Hardware`, `Data`, `Design`, `Web`, in that order, in place of the current `Motion`, `Type`, `Feedback`, `Craft` chips.
9. THE TopCards_Section «Adaptable across time zones» card SHALL keep the current heading and location label `Uzbekistan`.

### Requirement 12: Секция Experience (BlogsSection) и Testimonials

**User Story:** Как владелец, я хочу, чтобы в секции Experience либо отображался мой реальный опыт, либо секция была скрыта, чтобы не показывать чужую биографию.

#### Acceptance Criteria

1. WHERE the owner has NOT supplied experience entries, THE Portfolio_Site SHALL remove the `<BlogsSection />` mount from `src/App.jsx` HomePage composition, and MAY additionally delete the `BlogsSection.jsx` file if no other module imports it.
2. WHERE the owner has supplied at least one experience entry, THE Blogs_Section SHALL render a timeline whose entries are read from a new export `experienceTimeline` in the Site_Data_Module (moved out of the component hard-code), each entry containing the fields `id`, `label`, `organization`, `period`, `location`, `points`.
3. WHERE the owner has supplied at least one experience entry, THE Blogs_Section SHALL NOT reference the strings `Tashkent University of Information Technologies, Urgench Branch`, `Unusual`, `Aug 2025 - Present`, or `Apr 2024 - Jul 2025` unless the owner explicitly re-supplied those values.
4. THE Testimonials_Section SHALL keep the current empty-array short-circuit and SHALL continue to render `null` while `testimonials.length === 0`, and no additional testimonials SHALL be added during the rebrand.

### Requirement 13: Обновление тестов

**User Story:** Как разработчик, я хочу, чтобы тесты соответствовали новому контенту, чтобы CI не падал после ребрендинга.

#### Acceptance Criteria

1. THE `src/components/sections/HeroSection.test.jsx` file SHALL, after the rebrand, still assert that the `View work` link exists and points at `/work`, and that the `Get in touch` link exists and points at `/#contact`.
2. WHERE the visible CTA button labels are changed by the owner during the rebrand, THE `HeroSection.test.jsx` matchers `getByRole('link', { name: /view work/i })` and `getByRole('link', { name: /get in touch/i })` SHALL be updated to match the new labels case-insensitively.
3. THE `src/data/siteData.test.js` file SHALL continue to assert:
   1. `projects` is an array with at least one entry.
   2. Every project has a truthy `id`, truthy `name`, an `href` matching `^/work/`, an array `tags`, an array `features`, and a truthy `deviceScreens.mobile` — with the caveat that placeholder Web_Project entries (Requirement 5.3) MAY have `deviceScreens.mobile === null`; in that case the test SHALL assert `deviceScreens.mobile !== undefined` instead of a truthy check.
   3. Project ids are unique.
4. IF Hardware_Project entries are added under a separate export `hardwareProjects`, THEN THE `siteData.test.js` file SHALL additionally assert that `hardwareProjects` is an array, that every hardware entry has a truthy `id`, `name`, and `instagramUrl` starting with `https://www.instagram.com/`, and that no hardware id collides with any web project id.
5. WHEN `npm test` (Vitest, `--run` mode) is executed on the rebranded codebase, THE test suite SHALL pass with zero failures.

### Requirement 14: Обновление конфигурации окружения

**User Story:** Как владелец, я хочу, чтобы виджет последнего GitHub-пуша показывал мой аккаунт, а не старый.

#### Acceptance Criteria

1. THE `.env` file SHALL contain the line `VITE_GITHUB_USERNAME=DiliAble` in place of the current `VITE_GITHUB_USERNAME=XayrulloWeb` line.
2. THE `.env.example` file SHALL contain the line `VITE_GITHUB_USERNAME=DiliAble` in place of the current `VITE_GITHUB_USERNAME=XayrulloWeb` line.
3. THE BehindCurtains_Section `FALLBACK_PUSH` object SHALL set `repoFullName` to `DiliAble/portfolio` (or an owner-confirmed repo), `commitUrl` to the value of `socialLinks.github`, and `message` to a neutral placeholder like `chore: initial commit for DiliAble portfolio.` in place of the current `XayrulloWeb/private-workbench` and Xayrusha-specific message.
4. THE BehindCurtains_Section `GITHUB_USERNAME` fallback default SHALL equal `DiliAble` in place of the current `XayrulloWeb` default.

### Requirement 15: Удаление устаревших импортов и файлов

**User Story:** Как разработчик, я хочу, чтобы после ребрендинга сборка не тянула ненужные ассеты старых проектов, чтобы уменьшить размер бандла и убрать «мёртвый» контент.

#### Acceptance Criteria

1. THE Projects_Data_Module SHALL NOT import any file from `src/assets/FilmZone`, `src/assets/Dream Go`, `src/assets/Finance`, `src/assets/Mchs`, or `src/assets/TempMonitoring` after the rebrand.
2. THE TopCards_Section SHALL NOT import `filmZonePhone`, `dreamGoPhone`, or `financePhone`, or SHALL replace those imports with imports of new Web_Project preview images once supplied. Until new previews are supplied, THE TopCards_Section rune card SHALL render `DevicePlaceholder`-style panels in place of the three phone screens with labels matching the current Web_Project names.
3. THE Portfolio_Site SHALL either physically remove the folders `src/assets/FilmZone`, `src/assets/Dream Go`, `src/assets/Finance`, `src/assets/Mchs`, `src/assets/TempMonitoring`, `public/assets/demo/xayrusha-avatar.svg`, `public/assets/demo/xayrusha-photo.jpg`, `public/brand/xayrusha-lockup.svg`, `public/brand/xayrusha-mark.svg`, or SHALL leave them on disk unreferenced pending a separate cleanup task; either way, no active source file SHALL `import` from them.
4. WHEN `npm run build` is executed after the rebrand, THE build step SHALL complete without errors related to missing imports or unresolved asset paths.
5. WHEN `npm run lint` is executed after the rebrand, THE lint step SHALL not report new unused-import warnings introduced by the rebrand.

### Requirement 16: Non-regression — сохранение UX, доступности и роутинга

**User Story:** Как владелец и как разработчик, я хочу, чтобы ребрендинг не сломал текущие UX-, а11y- и роутинг-свойства сайта, чтобы поведение осталось знакомым посетителям и корректным для скринридеров.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL keep the current route table (`/`, `/work`, `/work/:projectId`, `*`) unchanged in `src/App.jsx`, apart from the change that `:projectId` SHALL now match the new Web_Project ids listed in Requirement 5.
2. THE Portfolio_Site SHALL preserve the smooth-scroll behaviour, the scroll-to-hash logic, the skip-to-content link, the CustomCursor, the SmoothScroll wrapper, the ScrollProgressBar, and the ScrollToTopButton components mounted in `src/App.jsx`.
3. THE Header_Nav SHALL keep the current `navItems` labels (`Home`, `Work`, `Skills`, `About`, `Contact`) and the current section id targets (`hero`, `work`, `skills`, `about`, `contact`).
4. THE Portfolio_Site SHALL keep all interactive controls (buttons, links, form inputs) that are updated by this rebrand accessible via keyboard focus, and SHALL preserve `aria-label` attributes; when a control's icon changes (e.g. removing LinkedIn), the `aria-label` SHALL be removed together with the control.
5. WHEN a screen reader traverses the About_Section round-icon strip after the rebrand, THE screen reader SHALL announce exactly the icons GitHub, Telegram, Instagram in that order, and no LinkedIn or X/Twitter announcement SHALL occur.
6. WHILE the Portfolio_Site is rendered on a viewport of width `<= 375px`, THE Hero_Section, Skills_Section (grouped), About_Section, Projects_Section (Web + Hardware), and Footer_Section SHALL not produce horizontal overflow of the document body.
7. WHEN the Portfolio_Site is deployed under the Canonical_Domain, THE Vite `base` config SHALL remain the default (`/`) unless the owner explicitly requests a subpath deployment.

## Correctness Properties

Свойства ниже фиксируют инварианты и обратимые преобразования, которые должны выполняться на данных сайта после ребрендинга. Часть из них тестируется в `siteData.test.js` (property-style, over the whole array), часть — как integration-checks (grep-based, один раз).

1. **No-legacy invariant**: FOR ALL files in `src/`, `public/`, and `index.html`, the case-insensitive occurrence count of the substrings `xayrusha`, `raxmonberganov`, `xayrullo`, `xayrulloweb` SHALL be equal to zero (integration check, single grep pass; see Requirements 1, 8, 10, 14, 15).
2. **Href-integrity invariant (Web projects)**: FOR ALL entries in `projects`, `entry.href === "/work/" + entry.id` SHALL hold (property test in `siteData.test.js`).
3. **Instagram-integrity invariant (Hardware projects)**: FOR ALL entries in `hardwareProjects`, `entry.instagramUrl.startsWith("https://www.instagram.com/p/")` SHALL hold (property test).
4. **Id-uniqueness invariant**: FOR ALL entries across `projects.concat(hardwareProjects)`, `entry.id` SHALL be unique (property test).
5. **Skill-group-integrity invariant**: FOR ALL entries in `skillGroups`, `entry.items.length >= 1`, `entry.category.length >= 1`, `entry.emoji.length >= 1`, and item names within a group SHALL be unique (property test).
6. **Sitemap-projects round trip**: FOR the set `S = { entry.id for entry in projects }`, the set of `<url><loc>` paths in `public/sitemap.xml` matching `^{Canonical_Domain}/work/([^/]+)$` SHALL be exactly `S` (integration check; Requirement 7.3).
7. **Footer-projects round trip**: FOR the set `S = { "/work/" + entry.id for entry in projects }`, the set of `href` values in the `Projects` footer column SHALL be exactly `S` (property test; Requirement 7.1).
8. **Canonical-URL idempotence**: THE `App.jsx` `SITE_URL` constant, the `<link rel="canonical">` `href`, every `og:url` value, and the `<loc>` prefix in `public/sitemap.xml` SHALL all reference the same Canonical_Domain string; changing Canonical_Domain in one place SHALL require changing all others together, so a search for the previous domain SHALL yield zero matches (idempotence over the domain-swap operation; Requirements 9.2, 9.7, 7.3).
9. **Social-links integrity**: FOR ALL keys in `socialLinks`, the corresponding value SHALL either match `mailto:` + a valid email pattern, or `tel:+` + digits, or `https://` + a non-empty host, and no value SHALL equal the placeholder `#` (property test).
10. **JSON-LD sameAs subset**: THE `Person.sameAs` list in the `index.html` JSON-LD block SHALL be a subset of `{ socialLinks.github, socialLinks.telegram, socialLinks.instagram, socialLinks.email }` (i.e. no drift between structured data and the runtime social-links source of truth; Requirement 9.5).
11. **Test-baseline invariant**: `npm test` (Vitest `--run`) SHALL exit with code 0 after the rebrand (Requirement 13.5).

## Non-Goals

Пункты ниже — то, что явно НЕ входит в scope этого спека и НЕ должно быть сделано в рамках ребрендинга.

1. Редизайн визуальной системы: цветовая палитра, типографика (`@fontsource-variable/geist`, `font-script`), анимации (GSAP, Framer Motion, Lenis), grain/noise-слои, компоненты `ui/*` (SkillChip, TinyChip, ProfileCard, DevicesMockup, Particles, Globe, TiltCard, DarkVeil) — остаются как есть.
2. Реорганизация роутинга: не добавляются новые route-и (например, `/hardware`, `/blog`, `/contact` как отдельная страница) — все секции остаются на Home и `/work`.
3. Добавление CMS, админ-панели, headless-бэкенда, i18n-инфраструктуры — вне scope.
4. Русская локализация UI — вне scope; сайт остаётся на английском, за исключением уже существующих русских строк комментариев в исходниках.
5. Автоматическая генерация screenshot-превью для Web_Project через сторонние сервисы (screenshotone, urlbox и т.п.) — этот механизм не имплементируется; используются либо загруженные владельцем изображения, либо placeholder-компонент.
6. Публикация сайта на новом домене (регистрация DNS, HTTPS, CDN, аналитика) — вне scope этого спека; спек только готовит артефакты, консистентные с новым Canonical_Domain.
7. Добавление аналитики (Google Analytics, Plausible, Yandex Metrika) или пиксельных трекеров — вне scope.
8. Замена локального MP3-виджета `8-milya.mp3` в BehindCurtains — вне scope, если владелец явно не запросит замену/удаление в отдельной итерации.
9. Изменение существующих unit-тестов сверх минимальных обновлений строк/матчеров, необходимых чтобы тесты соответствовали новому контенту.
10. Оптимизация бандла, code-splitting, upgrade зависимостей, миграция на другую версию React/Vite/Tailwind — вне scope.
