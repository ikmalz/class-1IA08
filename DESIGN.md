# DESIGN.md — Class 1IA08

## 1. Project Identity

**Class 1IA08** adalah website kelas untuk mahasiswa.

Website ini berfungsi sebagai pusat informasi kelas yang mudah diakses oleh mahasiswa, bukan sebagai aplikasi task management atau project management.

Website terdiri dari dua area utama:

1. **Public Class Website**
   - dapat diakses mahasiswa/pengunjung
   - menampilkan informasi kelas
   - fokus pada informasi, identitas, dan aktivitas kelas

2. **Admin Dashboard**
   - hanya dapat diakses admin
   - digunakan untuk mengelola konten website
   - menggunakan **shadcn/ui** sebagai UI foundation utama

Tidak ada sistem:

- task assignment
- assign task ke mahasiswa
- task management
- kanban
- project management
- student dashboard

---

# 2. Product Direction

Website harus terasa seperti:

> Website resmi kelas mahasiswa yang modern, rapi, ramah, dan mudah digunakan.

Bukan seperti:

> SaaS dashboard, project management app, LMS, atau template AI generik.

Prioritas utama:

**Clarity > Usability > Accessibility > Visual Polish > Decoration**

---

# 3. Design Personality

Desain harus terasa:

- Modern
- Academic
- Friendly
- Organized
- Youthful
- Calm
- Reliable
- Community-oriented

Hindari tampilan yang:

- terlalu corporate
- terlalu formal
- seperti dashboard startup
- seperti template admin gratis
- terlalu futuristik
- terlalu banyak dekorasi
- terlihat AI-generated

---

# 4. Anti-Slop Rules

Project menggunakan Anti-Slop.

Sebelum mengerjakan frontend:

1. Baca `AGENTS.md`.
2. Baca `DESIGN.md`.
3. Terapkan Anti-Slop **during the work**.
4. Load hanya skill yang relevan dengan task.
5. Jangan load semua skill tanpa kebutuhan.

Untuk frontend:

- `antislop` → core rules
- `antislop-ui` → UI dan visual
- `antislop-layoutmobile` → responsive/mobile
- `antislop-copywriting` → teks UI
- `antislop-human` → konten tentang orang
- `antislop-code` → code comments jika diperlukan

Hindari pola AI UI seperti:

- terlalu banyak rounded cards
- gradient dekoratif tanpa fungsi
- glowing backgrounds
- glassmorphism berlebihan
- blob dekoratif
- headline hero terlalu besar
- semua elemen berbentuk pill
- shadow berlebihan
- setiap section dibungkus card
- statistik palsu
- testimonial palsu
- generic feature grid
- random floating elements
- animasi berlebihan
- copywriting ala startup

Setiap elemen harus memiliki fungsi.

---

# 5. Application Areas

## Public Website

Public website merupakan wajah utama Class 1IA08.

Public website tidak boleh terasa seperti dashboard.

Gunakan layout website biasa dengan:

- navbar
- main content
- section
- footer

Gunakan whitespace, typography, separator, dan hierarchy sebelum menggunakan card.

## Admin Dashboard

Admin dashboard merupakan aplikasi internal.

Dashboard digunakan untuk mengelola konten website Class 1IA08.

Area ini boleh menggunakan pola dashboard seperti:

- sidebar
- header
- data table
- form
- dialog
- dropdown
- tabs
- pagination
- toast
- confirmation dialog

Untuk dashboard admin, **gunakan shadcn/ui sebagai UI foundation**.

---

# 6. Technology Direction

Frontend stack saat ini:

```text
React
Vite
Tailwind CSS v4
React Router
Lucide React
Supabase
```

Untuk **Admin Dashboard**, gunakan:

```text
shadcn/ui
Tailwind CSS
Lucide React
```

Jangan menambahkan UI framework lain seperti:

- Material UI
- Ant Design
- Chakra UI
- Bootstrap

kecuali ada kebutuhan yang benar-benar tidak dapat diselesaikan menggunakan stack saat ini.

---

# 7. shadcn/ui Rules

shadcn/ui terutama digunakan untuk **Admin Dashboard**.

Gunakan komponen shadcn jika sudah tersedia sebelum membuat custom implementation.

Contoh:

```text
Button
Input
Textarea
Label
Card
Table
Dialog
AlertDialog
DropdownMenu
Select
Tabs
Badge
Sheet
Tooltip
Skeleton
Separator
Breadcrumb
Pagination
Sidebar
```

Custom component boleh dibuat untuk kebutuhan domain-specific.

Contoh:

```text
AnnouncementTable
MemberTable
AdminPageHeader
ContentStatusBadge
```

Jangan membuat ulang komponen dasar yang sebenarnya sudah tersedia di shadcn/ui.

---

# 8. Admin Sidebar

Admin dashboard menggunakan sidebar berbasis **shadcn/ui Sidebar**.

Struktur dasar:

```text
Admin Dashboard
│
├── Overview
├── Content Management
│   └── sesuai fitur website
├── Members
├── Settings
└── Logout
```

Menu final harus mengikuti fitur yang benar-benar tersedia.

Jangan membuat menu dummy.

Sidebar harus:

- responsive
- dapat collapse jika diperlukan
- memiliki active state yang jelas
- bekerja dengan keyboard
- menggunakan Lucide icons
- tidak menutupi content
- menggunakan layout shadcn yang benar

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

Gunakan `SidebarInset` agar content dashboard tidak overlap dengan sidebar.

---

# 9. Visual Direction

Gunakan gaya:

**Clean Modern Campus Interface**

Karakteristik:

- typography kuat namun tidak berlebihan
- whitespace terkontrol
- subtle border
- neutral surfaces
- satu primary accent
- hierarchy jelas
- content-first design

Public website boleh memiliki lebih banyak identitas visual.

Admin dashboard harus lebih utilitarian dan fokus pada efisiensi.

---

# 10. Color Direction

Gunakan neutral base dengan satu primary accent.

Default:

```text
Background:      #F8FAFC
Surface:         #FFFFFF
Main text:       #0F172A
Secondary text:  #475569
Muted text:      #64748B
Border:          #E2E8F0

Primary:         #2563EB
Primary hover:   #1D4ED8
Primary subtle:  #EFF6FF
```

Jika Class 1IA08 nantinya memiliki warna identitas resmi, warna tersebut dapat menggantikan primary default.

Jangan memenuhi seluruh interface dengan primary color.

---

# 11. Semantic Colors

Gunakan semantic color hanya untuk status yang benar-benar memiliki arti.

Contoh:

```text
Green  → published / success
Amber  → draft / warning
Red    → destructive / error
Blue   → information
```

Jangan menggunakan semantic colors sebagai dekorasi.

---

# 12. Typography

Gunakan font yang mudah dibaca.

Default:

```text
Inter, system-ui, sans-serif
```

atau font existing project jika sudah ditentukan.

Hierarchy:

### Page title

```text
font-semibold
text-2xl md:text-3xl
```

### Section title

```text
font-semibold
text-lg md:text-xl
```

### Component title

```text
font-medium
text-base
```

### Body

```text
text-sm md:text-base
```

### Metadata

```text
text-sm
text-muted-foreground
```

Hindari:

- heading terlalu besar
- bold pada hampir semua text
- terlalu banyak hierarchy
- uppercase paragraphs
- decorative fonts untuk UI

---

# 13. Public Website Layout

Gunakan container:

```text
max-w-7xl
mx-auto
px-4
sm:px-6
lg:px-8
```

Untuk konten berbasis teks, gunakan width yang lebih terbatas agar mudah dibaca.

Contoh:

```text
max-w-3xl
```

Gunakan spacing sebagai struktur visual.

Jangan otomatis membungkus setiap section dengan card.

---

# 14. Public Navigation

Navigation harus sederhana.

Navigation hanya berisi halaman yang benar-benar tersedia.

Contoh struktur dapat berupa:

```text
Home
Announcements
Class Information
Members
Gallery
```

Tetapi jangan membuat halaman tersebut hanya karena tercantum sebagai contoh.

Gunakan hanya fitur yang sudah menjadi requirement project.

Navbar desktop harus sederhana.

Mobile gunakan accessible menu atau sheet.

Active route harus terlihat jelas.

---

# 15. Homepage

Homepage bukan landing page startup.

Homepage harus menjawab:

> “Apa informasi utama tentang Class 1IA08?”

Homepage dapat menampilkan konten seperti:

### Class Identity

- Class 1IA08
- identitas singkat
- semester/program jika tersedia

### Important Information

Informasi kelas yang paling relevan.

### Latest Announcements

Beberapa pengumuman terbaru.

### Class Content

Informasi atau aktivitas kelas yang relevan sesuai requirements.

Tidak perlu:

- giant hero
- marketing CTA
- fake statistics
- testimonials
- pricing-style cards
- feature comparison

---

# 16. Announcements

Announcement harus terasa seperti pengumuman kelas asli.

Setiap announcement dapat memiliki:

- title
- publication date
- author jika diperlukan
- content
- optional image
- optional attachment/link

Public view harus mengutamakan keterbacaan.

Admin dapat:

- create
- edit
- delete
- publish/unpublish

hanya jika fitur tersebut memang masuk requirements backend.

Admin management sebaiknya menggunakan:

```text
Table
DropdownMenu
Dialog
AlertDialog
Button
Badge
Pagination
```

dari shadcn/ui.

---

# 17. Members

Jika website memiliki halaman anggota kelas, prioritaskan identitas mahasiswa secara sederhana.

Informasi dapat berupa:

- name
- photo/avatar
- role/class position jika ada

Jangan membuat profil terasa seperti employee directory corporate.

Admin management dapat menggunakan table atau list sederhana.

---

# 18. Gallery

Jika gallery merupakan bagian requirements:

Public:

- visual-first
- grid responsive
- image aspect ratio konsisten
- tidak terlalu banyak card decoration

Admin:

- upload
- preview
- delete
- edit metadata jika dibutuhkan

Gunakan dialog/form shadcn pada admin.

---

# 19. Admin Dashboard Overview

Dashboard admin adalah halaman ringkasan pengelolaan website.

Dashboard **bukan** halaman mahasiswa.

Dashboard hanya boleh menampilkan informasi yang berguna untuk admin.

Contoh:

```text
Jumlah announcement
Jumlah member
Jumlah gallery item
Recent content
Recent admin activity
```

Hanya tampilkan metric yang benar-benar memiliki data.

Jangan membuat statistik palsu hanya untuk mengisi dashboard.

---

# 20. Admin Dashboard Layout

Desktop:

```text
┌──────────────┬─────────────────────────────┐
│              │ Header / Breadcrumb         │
│   Sidebar    ├─────────────────────────────┤
│              │                             │
│              │ Main Content                │
│              │                             │
└──────────────┴─────────────────────────────┘
```

Mobile:

```text
┌───────────────────────────────┐
│ Menu  Page Title              │
├───────────────────────────────┤
│                               │
│ Main Content                  │
│                               │
└───────────────────────────────┘
```

Sidebar pada mobile menjadi drawer/sheet.

Tidak boleh ada horizontal scroll akibat sidebar.

---

# 21. Admin Page Structure

Setiap admin page sebaiknya mengikuti struktur konsisten:

```text
Breadcrumb
↓
Page title + description
↓
Primary action
↓
Filters/Search jika diperlukan
↓
Main content
↓
Pagination jika diperlukan
```

Contoh:

```text
Announcements

Kelola pengumuman yang ditampilkan di website kelas.

                              [+ Tambah Pengumuman]

[ Search announcement... ]

--------------------------------------------------
Title       Status       Published      Actions
--------------------------------------------------
...
```

---

# 22. Tables

Gunakan table hanya pada admin dashboard.

Table harus:

- readable
- responsive
- memiliki action yang jelas
- tidak terlalu banyak kolom
- tidak menampilkan data yang tidak penting

Untuk mobile, pertimbangkan:

- hide secondary columns
- horizontal scroll hanya jika benar-benar diperlukan
- alternative compact representation

Action gunakan `DropdownMenu` bila terdapat beberapa action.

---

# 23. Forms

Admin forms harus memiliki:

- visible label
- validation
- error message
- loading state
- disabled state
- success feedback

Gunakan komponen shadcn:

```text
Input
Textarea
Select
Checkbox
Button
Label
```

Jika memakai form library di kemudian hari, jangan memperkenalkan dependency hanya untuk form kecil.

---

# 24. Dialogs

Gunakan `Dialog` untuk:

- create/edit small content
- preview
- supporting actions

Gunakan dedicated page jika form terlalu kompleks.

Gunakan `AlertDialog` untuk destructive action seperti:

```text
Delete announcement
Delete member
Delete gallery item
```

Destructive action harus meminta konfirmasi.

---

# 25. Buttons

Gunakan hierarchy yang jelas.

Primary:

```text
Tambah Pengumuman
Simpan
Publish
```

Secondary:

```text
Batal
Preview
```

Destructive:

```text
Hapus
```

Ghost:

```text
table actions
navigation utilities
```

Jangan memiliki banyak primary button yang bersaing di satu section.

---

# 26. Cards

Public website:

Gunakan cards hanya saat grouping content memang membutuhkan container.

Admin dashboard:

Card diperbolehkan untuk:

- summary metrics
- grouped settings
- dashboard overview

Tetapi hindari dashboard yang seluruhnya berupa card-grid tanpa hierarchy.

Recommended:

```text
rounded-lg
border
bg-card
```

Hindari:

```text
rounded-3xl
shadow-2xl
glassmorphism
gradient border
```

---

# 27. Radius and Shadows

Gunakan radius secara konsisten.

```text
Button → shadcn default
Input → shadcn default
Card → rounded-lg
Dialog → shadcn default
```

Gunakan shadow minimal.

Border dan hierarchy lebih disukai daripada heavy shadow.

---

# 28. Icons

Gunakan **Lucide React**.

Icons harus memiliki fungsi.

Admin examples:

```text
LayoutDashboard
Megaphone
Users
Images
Settings
LogOut
Plus
Pencil
Trash2
MoreHorizontal
Menu
```

Jangan gunakan icon hanya untuk dekorasi.

---

# 29. Loading States

Handle loading state secara eksplisit.

Gunakan:

- shadcn Skeleton untuk content
- button loading state untuk mutation
- subtle progress indicator bila relevan

Hindari full-screen spinner untuk operasi kecil.

---

# 30. Empty States

Empty state harus sederhana.

Contoh admin:

```text
Belum ada pengumuman.

Tambahkan pengumuman pertama untuk mulai menampilkan informasi kepada mahasiswa.
```

Kemudian primary action:

```text
Tambah Pengumuman
```

Jangan menggunakan ilustrasi besar hanya untuk mengisi ruang.

---

# 31. Error States

Jangan menampilkan raw Supabase error kepada user.

Public example:

```text
Pengumuman belum dapat dimuat.
Silakan coba lagi.
```

Admin example:

```text
Gagal menyimpan pengumuman.
Periksa data lalu coba lagi.
```

Technical error tetap dapat dicatat di console/log bila diperlukan saat development.

---

# 32. Responsive Design

Website harus berfungsi baik pada:

```text
Mobile
Tablet
Laptop
Desktop
```

## Public

Mobile-first readability.

Pastikan:

- navigation dapat digunakan
- text tidak terlalu kecil
- gambar responsive
- tidak ada horizontal overflow
- spacing proporsional

## Admin

Desktop dapat menggunakan sidebar permanen.

Mobile menggunakan drawer/sidebar trigger.

Admin table dan forms harus tetap usable pada viewport kecil.

Jangan hanya mengecilkan desktop layout.

---

# 33. Accessibility

Semua halaman harus mendukung:

- semantic HTML
- keyboard navigation
- visible focus
- sufficient contrast
- labels
- accessible dialog
- accessible dropdown
- alt text
- touch target yang layak

Shadcn membantu menyediakan foundation accessibility, tetapi implementasinya tetap harus benar.

Jangan mengandalkan warna sebagai satu-satunya indikator.

---

# 34. Motion

Motion harus minimal.

Allowed:

- hover
- dropdown
- sidebar transition
- dialog transition
- accordion/disclosure
- subtle state transitions

Recommended:

```text
150ms–250ms
```

Hindari:

- floating animation
- scroll animation berlebihan
- entrance animation pada semua section
- bouncing icons
- parallax
- auto-moving visual

---

# 35. Copywriting

Untuk UI utama gunakan bahasa Indonesia yang natural.

Contoh bagus:

```text
Pengumuman terbaru
Tentang kelas
Anggota kelas
Lihat semua
Tambah pengumuman
Simpan perubahan
Hapus pengumuman
```

Hindari:

```text
Unlock Your Potential
Experience Excellence
Empowering Your Academic Journey
Discover More
Transform Your Experience
```

Website adalah utility dan identity website kelas, bukan marketing product.

---

# 36. Components

Buat reusable components hanya ketika memang digunakan berulang.

Potential public components:

```text
Navbar
MobileNav
Footer
SectionHeader
AnnouncementItem
MemberCard
GalleryItem
EmptyState
```

Potential admin components:

```text
AdminSidebar
AdminHeader
AdminPageHeader
DataTable
ContentStatusBadge
DeleteConfirmation
EmptyState
```

Jangan membuat abstraction berlebihan.

---

# 37. Suggested Folder Direction

Jangan restructure hanya demi terlihat rapi.

Jika codebase bertambah, arah yang dapat digunakan:

```text
src/
├── assets/
├── components/
│   ├── public/
│   ├── admin/
│   └── ui/
├── layouts/
│   ├── PublicLayout.jsx
│   └── AdminLayout.jsx
├── lib/
├── pages/
│   ├── public/
│   └── admin/
├── routes/
└── App.jsx
```

`components/ui` digunakan untuk komponen shadcn.

---

# 38. Public vs Admin Separation

Jaga separation yang jelas.

Public:

```text
/
...
```

Admin:

```text
/admin
/admin/...
```

Admin dashboard tidak boleh mengubah public site menjadi dashboard.

Gunakan layout berbeda:

```text
PublicLayout
AdminLayout
```

Authentication dan authorization admin harus tetap ditangani dengan benar.

Frontend hiding bukan security mechanism.

---

# 39. Existing Project Cleanup

Sebelum menghapus code, cek penggunaannya.

Existing template CSS seperti:

```text
.counter
.hero
#next-steps
#docs
.ticks
```

kemungkinan berasal dari starter template.

Hapus hanya jika sudah dipastikan tidak digunakan.

Jangan melakukan unrelated refactor saat mengerjakan satu fitur.

---

# 40. Design Review Checklist

Sebelum frontend dianggap selesai, cek:

### Public

- Apakah terlihat seperti website kelas?
- Apakah informasi utama mudah ditemukan?
- Apakah navigation sederhana?
- Apakah ada UI dekoratif tanpa fungsi?
- Apakah mobile nyaman digunakan?
- Apakah copy terasa natural?
- Apakah tampilannya bebas AI-slop?

### Admin

- Apakah menggunakan shadcn/ui secara konsisten?
- Apakah sidebar responsive?
- Apakah menggunakan `SidebarInset`?
- Apakah page hierarchy jelas?
- Apakah table mudah dibaca?
- Apakah destructive action memiliki confirmation?
- Apakah form memiliki validation/loading/error states?
- Apakah mobile tetap usable?
- Apakah admin dashboard hanya berisi informasi berguna?

### General

- Accessibility
- responsive
- loading states
- empty states
- error states
- no unnecessary dependency
- no unnecessary component abstraction
- no fake data untuk dekorasi

---

# 41. Source of Truth

Untuk keputusan frontend gunakan urutan:

```text
1. Functional requirements
2. DESIGN.md
3. Existing project architecture
4. AGENTS.md + Anti-Slop
5. shadcn/ui patterns untuk Admin
6. Existing visual patterns
```

Jika existing UI bertentangan dengan `DESIGN.md`, perbaiki secara bertahap.

Jangan redesign bagian yang tidak berhubungan dengan task saat ini.

---

# 42. Final Principle

Public Class 1IA08 website harus terasa seperti:

> Rumah digital modern untuk informasi dan identitas kelas 1IA08.

Admin dashboard harus terasa seperti:

> Tool internal yang bersih dan efisien untuk mengelola konten website.

Bukan:

> Task manager, LMS, SaaS dashboard, atau website hasil template AI.