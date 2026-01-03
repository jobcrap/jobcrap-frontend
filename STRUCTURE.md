# Project Folder Structure

## Current Structure

```
story-app/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── select.jsx
│   │   │   └── badge.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         ✅ Created
│   │   │   ├── Footer.jsx         ✅ Created
│   │   │   └── Layout.jsx         ✅ Created
│   │   ├── post/
│   │   │   ├── PostCard.jsx       ✅ Created
│   │   │   ├── CreatePost.jsx     ⏳ Next
│   │   │   ├── VoteButtons.jsx    ⏳ Next
│   │   │   ├── CommentSection.jsx ⏳ Next
│   │   │   └── LanguageSwitch.jsx ⏳ Next
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx      ⏳ Next
│   │   │   ├── RegisterForm.jsx   ⏳ Next
│   │   │   └── SocialLogin.jsx    ⏳ Next
│   │   └── filters/
│   │       ├── CategoryFilter.jsx ⏳ Next
│   │       └── CountryFilter.jsx  ⏳ Next
│   ├── pages/
│   │   ├── Feed.jsx              ⏳ Next
│   │   ├── PostDetail.jsx        ⏳ Next
│   │   ├── CreatePost.jsx        ⏳ Next
│   │   ├── Login.jsx             ⏳ Next
│   │   ├── Register.jsx          ⏳ Next
│   │   ├── Profile.jsx           ⏳ Next
│   │   └── Admin.jsx             ⏳ Next
│   ├── store/
│   │   ├── authStore.js          ✅ Created
│   │   └── postsStore.js         ✅ Created
│   ├── services/
│   │   └── api.service.js        ✅ Created
│   ├── utils/
│   │   ├── api.js                ✅ Created
│   │   ├── constants.js          ✅ Created
│   │   └── validation.js         ✅ Created
│   ├── lib/
│   │   └── utils.js              ✅ Created
│   ├── App.jsx                    ⏳ Needs routing setup
│   ├── main.jsx
│   └── index.css                  ✅ Updated with Tailwind
├── public/
├── .env                           ⏳ To create
├── components.json                ✅ Created
├── tailwind.config.js             ✅ Created
├── postcss.config.js              ✅ Created
├── jsconfig.json                  ✅ Created
├── vite.config.js                 ✅ Updated
└── package.json                   ✅ Updated
```

## What's Created So Far

### ✅ Configuration Files
- Tailwind CSS & PostCSS configured
- Shadcn UI configured with components.json
- Path aliases set up with jsconfig.json and vite.config.js

### ✅ Utilities & Helpers
- **constants.js**: Categories, countries, trigger warnings, languages
- **validation.js**: Form validation, text formatting, date utilities
- **api.js**: Axios instance with auth interceptors

### ✅ State Management
- **authStore.js**: Authentication state (login, logout, user data)
- **postsStore.js**: Posts management with filters and sorting

### ✅ API Services
- **api.service.js**: Auth, Posts, and Comments API methods

### ✅ Layout Components
- **Navbar**: Responsive navigation with auth buttons
- **Footer**: Links and legal information
- **Layout**: Main wrapper component

### ✅ Post Components
- **PostCard**: Displays post with voting, trigger warnings, sharing

## Next Steps

1. **Install Shadcn UI Components** (in progress)
2. **Set up React Router** - App routing configuration
3. **Create Pages**:
   - Feed (homepage with posts list)
   - PostDetail (single post view with comments)
   - CreatePost (story submission form)
   - Login & Register (authentication pages)
   - Profile (user settings)
4. **Create Remaining Components**:
   - CreatePost form with validation
   - Comment section
   - Filter controls
   - Auth forms

## Mock Data for Development

Since backend isn't ready, we'll use mock data in `src/data/mockData.js`:
- Sample posts
- Sample users
- Sample comments

This allows full frontend development and testing before backend integration.
