# DESIGN.md — Class 1IA08 Interactive Class Website

## 1. Project Identity

**Class 1IA08** adalah website resmi kelas untuk mahasiswa.

Website ini berfungsi sebagai pusat informasi kelas yang mudah diakses oleh mahasiswa, dosen, dan anggota kelas.

Website memiliki dua area utama:

1. **Public Class Website**
   - halaman utama kelas
   - pengumuman
   - informasi tugas
   - informasi mata kuliah
   - dokumentasi/foto tugas bila relevan
   - informasi kelas lain yang benar-benar tersedia

2. **Admin Dashboard**
   - hanya untuk admin
   - mengelola pengumuman
   - mengelola mata kuliah
   - mengelola tugas
   - mengelola foto/attachment tugas
   - mengelola data yang memang tersedia di Supabase

Website ini **bukan**:
- LMS
- project management app
- task assignment app
- student dashboard
- SaaS dashboard
- portfolio pribadi

---

# 2. Product Direction

Arah utama:

> **Interactive Dark Class Website**

Public website harus terasa seperti:
- modern
- dark-first
- akademik
- youthful
- organized
- interactive
- community-oriented
- clean
- premium
- mudah digunakan

Admin dashboard harus terasa:
- jelas
- efisien
- utilitarian
- konsisten
- ringan
- mudah dipahami

Prioritas desain:

**Clarity > Usability > Accessibility > Content > Visual Polish > Motion > Decoration**

---

# 3. Visual Personality

Public website:

- dark
- editorial
- modern
- technical
- calm
- interactive
- youthful

Admin dashboard:

- neutral
- functional
- compact
- structured
- shadcn-first

Hindari:
- tampilan AI generik
- terlalu banyak card
- terlalu banyak rounded pill
- gradient dekoratif berlebihan
- glassmorphism berlebihan
- glow berlebihan
- headline terlalu besar
- shadow berat
- dekorasi tanpa fungsi
- fake statistics
- fake testimonials
- fake class achievements
- elemen melayang random
- animasi di setiap elemen

---

# 4. Anti-Slop Rules

Sebelum mengerjakan frontend:

1. Baca `AGENTS.md`
2. Baca `DESIGN.md`
3. Gunakan skill Anti-Slop yang relevan saja
4. Jangan load semua skill tanpa kebutuhan
5. Prioritaskan struktur dan hierarchy daripada dekorasi

Skill yang relevan:
- `antislop`
- `antislop-ui`
- `antislop-layoutmobile`
- `antislop-copywriting`
- `antislop-human`
- `antislop-code`

Jika sebuah elemen tidak membantu user memahami atau menggunakan website:
**jangan tambahkan.**

---

# 5. Current Technology

Stack project:

```text
React
Vite
Tailwind CSS v4
React Router
Lucide React
Supabase
shadcn/ui
```

Untuk motion public website:

```text
Framer Motion
```

boleh ditambahkan jika memang digunakan.

ReactBits boleh digunakan secara selektif.

Jangan migrasi ke:
- Next.js
- Material UI
- Bootstrap
- Chakra UI
- Ant Design

---

# 6. Public vs Admin Design

## Public Website

Public website boleh menggunakan:
- strong typography
- subtle interactive background
- scroll reveal
- section numbering
- responsive editorial layout
- subtle hover interaction
- dark/light theme
- controlled motion

Public website tidak boleh terasa seperti admin dashboard.

Gunakan:
- navbar
- hero
- section
- divider
- editorial list
- footer

Sebelum memakai card, pertimbangkan apakah spacing + border + separator sudah cukup.

## Admin Dashboard

Admin dashboard menggunakan:
- shadcn/ui
- sidebar
- table
- form
- dialog
- dropdown
- badge
- pagination
- skeleton
- toast

Admin tidak membutuhkan:
- ReactBits background
- large cinematic hero
- scroll storytelling
- animated canvas
- 3D effect

---

# 7. Color System

## Dark Theme

```text
Background Primary   #080B12
Background Secondary #0D111B
Surface              #121826
Surface Hover        #182033

Text Primary         #F8FAFC
Text Secondary       #A8B3C7
Text Muted           #6F7B91

Border               #243047
Border Strong        #334155

Primary Accent       #3B82F6
Primary Hover        #2563EB
Primary Soft         #172554

Info                 #38BDF8
Success              #22C55E
Warning              #F59E0B
Error                #EF4444
```

## Light Theme

```text
Background Primary   #F7F9FC
Background Secondary #EEF3F9
Surface              #FFFFFF
Surface Hover        #F1F5F9

Text Primary         #0F172A
Text Secondary       #475569
Text Muted           #64748B

Border               #D7E0EA
Border Strong        #CBD5E1

Primary Accent       #2563EB
Primary Hover        #1D4ED8
Primary Soft         #EFF6FF

Info                 #0284C7
Success              #16A34A
Warning              #D97706
Error                #DC2626
```

**Jangan gunakan kuning sebagai warna identitas utama.**

Semantic yellow/amber hanya boleh dipakai untuk status warning bila memang dibutuhkan.

---

# 8. Theme Tokens

Jangan hardcode warna theme di setiap component.

Gunakan semantic CSS variables:

```css
--bg-primary
--bg-secondary
--surface
--surface-hover

--text-primary
--text-secondary
--text-muted

--border
--border-strong

--accent
--accent-hover
--accent-soft

--success
--warning
--error
--info
```

Dark dan light harus memiliki layout yang sama.

Yang berubah hanya visual token.

---

# 9. Theme Behavior

Public website dark-first.

Theme toggle tersedia di navbar.

Theme preference harus tersimpan.

Expected:

```text
dark
→ switch
→ light
→ refresh
→ tetap light
```

Boleh menggunakan:
- `localStorage`
- `prefers-color-scheme`

Jangan membuat light mode kembali ke tampilan biru-putih generik lama.

Light mode harus tetap terasa modern dan editorial.

---

# 10. Typography

Gunakan font existing project:

```text
Geist
```

Typography harus:
- kuat
- mudah dibaca
- modern
- tidak oversized

Gunakan monospace hanya untuk:
- metadata
- tanggal
- kode mata kuliah
- section label
- small technical labels

Jangan gunakan monospace untuk paragraph panjang.

---

# 11. Typography Hierarchy

Hero title:

```text
clamp(3rem, 7vw, 7rem)
```

Section heading:

```text
text-4xl md:text-5xl lg:text-6xl
font-semibold / font-bold
```

Subheading:

```text
text-xl md:text-2xl
```

Body:

```text
text-base md:text-lg
leading-relaxed
```

Metadata:

```text
text-xs / text-sm
text-muted
```

---

# 12. Public Layout Container

Standard:

```text
max-w-7xl
mx-auto
px-4
sm:px-6
lg:px-8
```

Text-heavy content:

```text
max-w-3xl
```

Large visual content:

```text
max-w-[1400px]
```

hanya jika diperlukan.

Semua section utama harus terasa align secara horizontal.

---

# 13. Public Navbar

Navbar harus:
- sticky/fixed
- minimal
- dark/light aware
- responsive
- compact
- active state jelas
- tidak terlalu dominan

Desktop concept:

```text
1IA08.

HOME
PENGUMUMAN
TUGAS
MATA KULIAH

theme toggle
```

Gunakan hanya route/fitur yang benar-benar ada.

Jangan membuat menu dummy.

Saat di top:
- background dapat transparent

Saat scroll:
- background semi-opaque
- subtle blur
- thin border-bottom

---

# 14. Navbar Brand

Brand utama:

```text
1IA08.
```

atau:

```text
CLASS 1IA08.
```

Gunakan blue accent pada dot/small highlight bila perlu.

Jangan jadikan "Class Hub" sebagai identitas utama jika nama kelas dapat digunakan langsung.

---

# 15. Mobile Navigation

Mobile:
- accessible menu
- tidak overflow
- z-index aman
- menutup setelah route dipilih
- dark/light aware
- keyboard friendly

Boleh gunakan shadcn `Sheet` bila cocok.

---

# 16. Homepage Structure

Struktur yang disarankan:

```text
Navbar

Hero

01 / Latest Announcements

02 / Latest Assignments

03 / Class Information

04 / Courses / Mata Kuliah

Optional real content section

Footer
```

Hanya tampilkan section jika data nyata tersedia.

Jangan menambahkan Members/Gallery/Activities bila backend dan data belum ada.

---

# 17. Hero

Hero harus menjawab:
- ini website kelas apa?
- informasi apa yang tersedia?
- user harus mulai dari mana?

Concept:

```text
CLASS 1IA08

ONE PLACE FOR
OUR CLASS.

Pengumuman, tugas, dan informasi mata kuliah
dalam satu tempat.

[ LIHAT PENGUMUMAN ]
[ LIHAT TUGAS ]

SCROLL ↓
```

Copy final boleh disesuaikan.

Jangan gunakan startup-style marketing copy.

---

# 18. Hero Background

Gunakan maksimal SATU ReactBits background.

Preferred:
- Threads
atau
- Dot Grid

Background harus:
- subtle
- low contrast
- tidak mengganggu teks
- tidak menghalangi button
- ringan di mobile
- respect reduced motion

Accent background menggunakan:
- blue
- cyan
- muted white/gray

**Jangan gunakan yellow accent.**

---

# 19. Hero Motion

Gunakan Framer Motion secara halus.

Entrance:
1. class label
2. headline
3. supporting text
4. CTA
5. scroll indicator

On scroll:
- slight scale down
- slight fade
- subtle vertical motion

Hindari extreme zoom.

---

# 20. Section Numbering

Gunakan numbering kecil seperti:

```text
01 / LATEST UPDATES
02 / ASSIGNMENTS
03 / CLASS INFO
04 / COURSES
```

Hero tidak perlu nomor.

Gunakan blue accent untuk section number.

---

# 21. Latest Announcements

Sumber data:

```text
public.pengumuman
```

Tampilan public harus editorial, bukan card grid berat.

Recommended:

```text
01
02 OCT 2026

JUDUL PENGUMUMAN

Ringkasan isi pengumuman...

READ MORE →
```

Gunakan:
- divider
- tanggal
- judul
- excerpt
- optional detail action

Jangan semua announcement dibungkus card besar.

---

# 22. Announcement Page

Route public announcement harus fokus pada readability.

Struktur:

```text
PENGUMUMAN

Informasi terbaru untuk Class 1IA08.

---------------------------------

Tanggal
Judul
Isi ringkas
```

Data hanya tampil bila:

```text
aktif = true
```

Order:
- tanggal terbaru
- fallback created_at terbaru bila dibutuhkan

Jangan tampilkan announcement nonaktif di public.

---

# 23. Assignments / Tugas

Sumber data:

```text
public.tugas
```

Setiap tugas memiliki:

- id
- mata_kuliah_id
- tanggal_tugas
- catatan
- created_at
- updated_at

Public assignment UI harus menampilkan secara jelas:

```text
Nama Mata Kuliah
Tanggal Tugas
Catatan
Attachment/Foto jika ada
```

Jika `catatan` kosong:
jangan tampilkan placeholder panjang.

---

# 24. Assignment Display

Prefer editorial rows/list.

Example:

```text
02 OCT

PEMROGRAMAN WEB

Tugas membuat halaman responsif menggunakan React.

2 lampiran
VIEW DETAIL →
```

Hindari:
- kanban
- progress board
- task assignment UI
- project management layout

Ini hanya informasi tugas kelas.

---

# 25. Task Detail

Jika detail route dibuat, tampilkan:

```text
Mata Kuliah
Tanggal Tugas
Catatan
Lampiran/Foto
Tanggal dibuat/diupdate bila relevan
```

Gunakan `tugas_foto` sebagai attachment list.

---

# 26. Mata Kuliah

Sumber data:

```text
public.mata_kuliah
```

Field:

```text
id
nama
kode
aktif
created_at
```

Public hanya menampilkan mata kuliah aktif:

```text
aktif = true
```

Tampilan:

```text
KODE
NAMA MATA KULIAH
```

Jika kode null:
jangan tampilkan placeholder palsu.

---

# 27. Course / Mata Kuliah UI

Gunakan compact list atau simple grid.

Jangan setiap mata kuliah dibuat kartu besar.

Contoh:

```text
IF101
Pemrograman Dasar

IF102
Basis Data
```

Hover:
- subtle border
- slight blue accent
- no heavy shadow

---

# 28. Tugas Foto / Attachment

Sumber data:

```text
public.tugas_foto
```

Field:

```text
id
tugas_id
storage_path
file_name
file_size
mime_type
created_at
```

Relasi:

```text
tugas_foto.tugas_id → tugas.id
```

Gunakan untuk:
- foto tugas
- attachment
- preview file

Storage file mengacu pada `storage_path`.

Jangan expose storage path mentah ke user jika signed/public URL handling diperlukan.

---

# 29. Attachment UI

Attachment dapat ditampilkan sebagai:

```text
[ thumbnail / icon ]

file_name
file_size
mime_type

OPEN / DOWNLOAD
```

Jika image:
- preview thumbnail
- modal/lightbox optional

Jika non-image:
- gunakan file icon
- tampilkan nama file

Jangan buat attachment gallery berlebihan.

---

# 30. Class Information

Class Information bersifat editorial.

Tampilkan informasi nyata seperti:
- Class 1IA08
- program/study info jika tersedia
- semester/academic year bila tersedia
- short class description
- important class link bila memang public

Jangan invent data.

Layout:
- split layout
- strong heading
- clean supporting text

Bukan giant card.

---

# 31. Important Links

Jika ada link penting kelas:
- Drive
- resource
- shared class document
- public group info

hanya tampilkan jika aman untuk public.

Gunakan simple list:

```text
Google Drive Class      ↗
Shared Material         ↗
```

Jangan expose link private.

---

# 32. Footer

Footer compact.

Concept:

```text
CLASS 1IA08.

Pusat informasi untuk kelas.

Pengumuman
Tugas
Mata Kuliah

© current year Class 1IA08

BACK TO TOP ↑
```

Jangan oversized.

---

# 33. Public Motion Rules

Gunakan:
- opacity
- y translation
- subtle scale
- stagger
- scroll reveal

Hindari:
- bouncing terus-menerus
- heavy parallax
- animation pada setiap item
- uncontrolled rotation
- continuous effects tanpa fungsi

---

# 34. Hover Interaction

Desktop:
- subtle border accent
- small translate
- small scale
- arrow movement
- underline

Contoh:

```text
translateY: -2px
scale: 1.01
```

Mobile tidak boleh bergantung pada hover.

---

# 35. Responsive Philosophy

Desktop boleh lebih interaktif.

Mobile harus:
- lebih sederhana
- cepat
- readable
- touch-friendly
- no horizontal overflow
- no hover dependency
- reduced expensive animation

---

# 36. Reduced Motion

Respect:

```css
prefers-reduced-motion: reduce
```

Saat aktif:
- stop background continuous animation
- reduce reveal movement
- disable mouse tracking
- keep content immediately visible

Motion = enhancement, bukan requirement.

---

# 37. Accessibility

Wajib:
- semantic headings
- visible focus
- sufficient contrast
- meaningful alt text
- keyboard support
- accessible nav
- labels pada form
- no hover-only information
- accessible modal/dialog

Gunakan semantic HTML sebelum ARIA.

---

# 38. Supabase Database — Source of Truth

Gunakan schema dari Supabase sebagai sumber data utama.

Current public tables:

```text
profiles
pengumuman
mata_kuliah
tugas
tugas_foto
```

Jangan membuat UI untuk entity yang tidak ada tanpa requirement baru.

---

# 39. Table: profiles

Supabase table:

```text
profiles
```

Columns:

```text
id          uuid
full_name   text
role        text
created_at  timestamptz
```

Relation:

```text
profiles.id → auth.users.id
```

Purpose:
- menyimpan profil user/admin
- menyimpan role

Jangan tampilkan semua profile public secara otomatis.

Data profile harus digunakan sesuai permission.

---

# 40. Table: pengumuman

Supabase table:

```text
pengumuman
```

Columns:

```text
id          int8
judul       text
isi         text
tanggal     date
aktif       bool
created_at  timestamptz
updated_at  timestamptz
```

Purpose:
- menyimpan pengumuman kelas

Public:
- hanya `aktif = true`

Admin:
- list
- create
- edit
- activate/deactivate
- delete bila requirement memang mengizinkan

---

# 41. Table: mata_kuliah

Supabase table:

```text
mata_kuliah
```

Columns:

```text
id          int8
nama        text
kode        text nullable
aktif       bool
created_at  timestamptz
```

Purpose:
- data mata kuliah

Public:
- hanya mata kuliah aktif

Admin:
- create
- edit
- activate/deactivate
- delete hanya bila aman terhadap relasi tugas

---

# 42. Table: tugas

Supabase table:

```text
tugas
```

Columns:

```text
id              int8
mata_kuliah_id  int8
tanggal_tugas   date
catatan         text nullable
created_at      timestamptz
updated_at      timestamptz
```

Relation:

```text
tugas.mata_kuliah_id → mata_kuliah.id
```

Purpose:
- menyimpan informasi tugas kelas

Public:
- tampilkan tugas dengan nama mata kuliah
- tanggal
- catatan
- attachment/foto bila tersedia

Admin:
- create
- edit
- delete
- pilih mata kuliah dari data aktif

---

# 43. Table: tugas_foto

Supabase table:

```text
tugas_foto
```

Columns:

```text
id            int8
tugas_id      int8
storage_path  text
file_name     text
file_size     int8
mime_type     text
created_at    timestamptz
```

Relation:

```text
tugas_foto.tugas_id → tugas.id
```

Purpose:
- menyimpan metadata foto/file attachment tugas

Admin:
- upload
- preview
- delete

Public:
- preview attachment yang sesuai
- open/download jika diizinkan

---

# 44. Database Relationship Summary

```text
auth.users
    │
    └── profiles
         id → auth.users.id


mata_kuliah
    │
    └── tugas
         mata_kuliah_id → mata_kuliah.id
             │
             └── tugas_foto
                  tugas_id → tugas.id


pengumuman
    standalone content table
```

Jangan menduplikasi data mata kuliah di table tugas.

Selalu gunakan relasi.

---

# 45. Data UI Rules

Public:
- content-first
- hanya data yang perlu dilihat mahasiswa
- jangan expose raw technical fields
- jangan tampilkan ID database
- jangan tampilkan storage path mentah

Admin:
- tampilkan field yang diperlukan untuk mengelola konten
- technical metadata dapat ditempatkan sebagai secondary info

---

# 46. Supabase Query Direction

Public queries harus:
- select field yang diperlukan saja
- filter `aktif = true` untuk pengumuman/mata kuliah
- order by tanggal/created_at sesuai kebutuhan
- include relation mata kuliah pada tugas
- include tugas_foto bila detail membutuhkan attachment

Jangan overfetch tanpa kebutuhan.

---

# 47. Loading State

Public:
- subtle skeleton
- no giant spinner

Admin:
- shadcn Skeleton
- button loading
- table loading

---

# 48. Empty State

Public examples:

```text
Belum ada pengumuman terbaru.
```

```text
Belum ada tugas yang ditampilkan.
```

```text
Belum ada mata kuliah aktif.
```

Admin:

```text
Belum ada pengumuman.

Tambah pengumuman pertama.
```

Jangan pakai giant illustration.

---

# 49. Error State

Public:

```text
Data belum dapat dimuat.
Silakan coba lagi.
```

Admin:

```text
Gagal menyimpan data.
Periksa kembali lalu coba lagi.
```

Jangan tampilkan raw Supabase error ke user.

---

# 50. Admin Dashboard Direction

Admin menggunakan shadcn/ui.

Primary goals:
- fast content management
- clarity
- predictable workflow

Tidak perlu ReactBits.

---

# 51. Admin Sidebar

Gunakan existing shadcn Sidebar.

Structure mengikuti fitur nyata:

```text
Overview

Content
- Pengumuman
- Mata Kuliah
- Tugas

Settings

Logout
```

Jika attachment dikelola di dalam Tugas:
jangan buat menu `Tugas Foto` terpisah.

Gunakan:

```text
SidebarProvider
Sidebar
SidebarHeader
SidebarContent
SidebarGroup
SidebarMenu
SidebarMenuItem
SidebarMenuButton
SidebarFooter
SidebarInset
```

`SidebarInset` wajib agar content tidak overlap.

---

# 52. Admin Dashboard Overview

Hanya tampilkan real metrics.

Contoh bila tersedia:

```text
Jumlah Pengumuman Aktif
Jumlah Mata Kuliah Aktif
Jumlah Tugas
Tugas Terbaru
```

Jangan buat fake charts.

Jangan buat fake analytics.

---

# 53. Admin Pengumuman

Admin page:

```text
Pengumuman

Kelola informasi yang ditampilkan kepada mahasiswa.

[ + Tambah Pengumuman ]

Search...

-----------------------------------------
Judul       Tanggal       Status   Actions
-----------------------------------------
```

Gunakan:
- Table
- Badge
- DropdownMenu
- Dialog/Sheet
- AlertDialog

---

# 54. Admin Mata Kuliah

Admin page:

```text
Mata Kuliah

Kelola daftar mata kuliah kelas.

[ + Tambah Mata Kuliah ]

-----------------------------------
Kode     Nama     Status     Actions
-----------------------------------
```

Status:
- aktif
- nonaktif

---

# 55. Admin Tugas

Admin page:

```text
Tugas

Kelola tugas berdasarkan mata kuliah.

[ + Tambah Tugas ]

------------------------------------------------
Tanggal    Mata Kuliah    Lampiran    Actions
------------------------------------------------
```

Create/Edit form:

```text
Mata Kuliah
Tanggal Tugas
Catatan
Attachment
```

Gunakan data `mata_kuliah` untuk select.

---

# 56. Admin Attachment

Attachment dikelola dalam task form/detail.

Functions:
- upload
- preview
- remove
- file metadata

Jangan membuat upload UI yang terlalu kompleks.

---

# 57. Admin Forms

Gunakan:
- Label
- Input
- Textarea
- Select
- Button

Need:
- validation
- error
- loading
- disabled
- success feedback

---

# 58. Admin Delete

Destructive actions wajib confirmation.

Gunakan shadcn `AlertDialog`.

Contoh:
- delete pengumuman
- delete tugas
- delete attachment

Untuk mata kuliah yang punya tugas:
pastikan behavior database aman sebelum delete.

---

# 59. Admin Login

Login tetap simple.

Gunakan:
- Input
- Button
- visible labels
- clear errors
- back link

Tidak perlu ReactBits.

Tidak perlu public interactive background.

---

# 60. Admin Theme

Admin dapat mengikuti dark/light semantic tokens.

Tetapi admin tidak perlu accent blue sekuat public.

Gunakan shadcn system colors secara konsisten.

---

# 61. Buttons

Public:

Primary:
- blue accent
- strong contrast

Secondary:
- transparent/dark
- border

Text link:
- minimal
- arrow optional

Admin:
ikuti shadcn variants.

---

# 62. Cards

Public:
gunakan card hanya jika grouping membutuhkan surface.

Sebelum card:
cek apakah separator/spacing cukup.

Admin:
card boleh untuk summary/settings.

Avoid:
- rounded-3xl
- shadow-2xl
- glass panel
- gradient border

---

# 63. Radius

Public:

```text
6px–12px
```

Admin:
gunakan shadcn defaults.

---

# 64. Shadows

Gunakan shadow minimal.

Prefer:
- border
- spacing
- hierarchy

Jangan heavy glowing shadow.

---

# 65. Icons

Gunakan Lucide React.

Examples:

```text
Megaphone
BookOpen
CalendarDays
Paperclip
FileText
ExternalLink
ArrowRight
Moon
Sun
Menu
X
Upload
Trash2
Pencil
MoreHorizontal
```

Icon harus memiliki fungsi.

---

# 66. Copywriting

Gunakan Bahasa Indonesia sebagai bahasa utama.

Technical labels/section labels boleh English jika konsisten.

Contoh acceptable:

```text
01 / LATEST UPDATES

Pengumuman terbaru untuk Class 1IA08.
```

Hindari corporate/AI phrases:
- seamless
- empower
- revolutionary
- next-generation
- innovative ecosystem

---

# 67. Performance

Public:
- lightweight motion
- lazy load below fold
- no multiple WebGL canvases
- no physics
- no unnecessary continuous animation

Mobile:
- simplify effects

---

# 68. Image Rules

Images:
- maintain aspect ratio
- meaningful alt text
- lazy-load below fold
- no stretching
- object-cover only when appropriate

Task attachment image:
- preview cleanly
- support modal only if useful

---

# 69. Public Routes

Gunakan hanya routes yang nyata.

Current/future valid examples berdasarkan data:

```text
/
 /pengumuman
 /tugas
 /mata-kuliah
```

Buat route baru hanya jika implementasi dan data benar-benar tersedia.

Jangan buat:
- members
- gallery
- activities

sebelum feature/data ada.

---

# 70. Section Rhythm

Desktop:

```text
py-24
to
py-32
```

Mobile:

```text
py-16
to
py-20
```

Hindari gap sangat besar tanpa alasan.

---

# 71. Shared Alignment

Semua section utama align pada grid yang sama.

Example:

```text
01 / LATEST UPDATES
LATEST ANNOUNCEMENTS
```

dan:

```text
02 / ASSIGNMENTS
LATEST TASKS
```

harus memiliki alignment konsisten.

---

# 72. Final Public Goal

Public website harus terasa seperti:

> digital home untuk Class 1IA08.

Harus:
- modern
- dark-first
- mudah dibaca
- interaktif
- terorganisir
- cocok untuk mahasiswa

Tidak boleh terasa seperti:
- portfolio clone
- SaaS startup
- dashboard
- AI template
- effect showcase

---

# 73. Final Admin Goal

Admin dashboard harus terasa:

> content management tool untuk Class 1IA08.

Harus:
- simple
- reliable
- efficient
- responsive
- accessible

Bukan versi lain dari public website.

---

# 74. Final Priority

Saat membuat keputusan desain:

```text
Content
>
Clarity
>
Usability
>
Accessibility
>
Hierarchy
>
Motion
>
Decoration
```

Jika sebuah effect mengurangi keterbacaan:
hapus effect.

Jika interface terasa seperti dashboard pada public side:
sederhanakan.

Jika data tidak ada:
jangan buat fake content.

Jika card tidak diperlukan:
gunakan spacing atau separator.

Jika warna dekoratif tidak memiliki fungsi:
jangan gunakan.

**Blue is the primary identity accent. Yellow is not part of the public visual identity.**
