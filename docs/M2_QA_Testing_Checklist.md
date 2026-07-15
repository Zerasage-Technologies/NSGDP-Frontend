# M2 QA Testing Checklist

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Ready for Testing

---

## Prerequisites

- ✅ Backend running on `http://localhost:3001`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Database seeded with test data
- ✅ Test user accounts created (public, contributor, admin, super_admin)

---

## 1. Authentication & Session (5 min)

- [ ] **Login** with test credentials → Check redirects to dashboard
- [ ] **Logout** → Verify redirect to login page
- [ ] **Token refresh** → Leave browser open 10+ min, verify still logged in
- [ ] **Protected routes** → Try accessing `/admin` while logged out → Should redirect to login

---

## 2. User Dashboard (3 min)

- [ ] **Dashboard loads** → Check stats cards display numbers (downloads, notifications, datasets)
- [ ] **Recent downloads** → Verify list shows actual downloaded datasets
- [ ] **Notifications badge** → Verify unread count in navbar matches reality

---

## 3. Profile & Settings (5 min)

- [ ] **View profile** (`/profile`) → Check all fields populated from API
- [ ] **Update profile** → Change firstName → Save → Verify name updates in navbar
- [ ] **Change password** → Update password → Logout → Login with new password → Success
- [ ] **Change password (wrong current)** → Enter wrong current password → Verify error message

---

## 4. Datasets - Browse & Search (10 min)

- [ ] **Navigate to dataportal** (`/dataportal`) → Datasets load from API
- [ ] **Pagination** → Click next/previous → URL updates, new datasets load
- [ ] **Search** → Type "health" → Results filter in real-time
- [ ] **Category filter** → Select a category → Only matching datasets show
- [ ] **Organisation filter** → Select organisation → Datasets filtered correctly
- [ ] **Format filter** → Select CSV → Only CSV datasets show
- [ ] **Sort** → Change sort to "Most Popular" → Order changes
- [ ] **Clear filters** → Click clear → Back to all datasets

---

## 5. Dataset Detail & Download (5 min)

- [ ] **Open dataset** → Click any dataset card → Detail page loads
- [ ] **Dataset metadata** → All fields display (title, description, category, org, format, etc.)
- [ ] **Download button** → Click "Download Dataset" → File download starts
- [ ] **Download count** → Refresh page → Download count increments by 1
- [ ] **Related datasets** → Check "Related Datasets" section shows items from same category

---

## 6. Notifications (3 min)

- [ ] **View notifications** (`/notifications`) → List loads from API
- [ ] **Unread indicator** → Unread notifications have blue dot
- [ ] **Mark as read** → Click notification → Blue dot disappears
- [ ] **Mark all as read** → Click button → All notifications marked read
- [ ] **Navbar badge** → Unread count in navbar updates when marking as read

---

## 7. Organisations (3 min)

- [ ] **Browse organisations** (`/organisations`) → List loads from API
- [ ] **Filter by type** → Select "Government" → Only government orgs show
- [ ] **Search organisations** → Type org name → Results filter
- [ ] **Organisation card** → Displays name, type badge, dataset count

---

## 8. Admin - User Management (5 min)

**Login as admin user first**

- [ ] **View users** (`/admin/users`) → User list loads
- [ ] **Filter by role** → Select "Contributor" → Only contributors show
- [ ] **Filter by status** → Select "Active" → Only active users show
- [ ] **Change role** → Click "Change Role" → Select new role → Save → Role updates in table
- [ ] **Org-scoped admin** → Login as org admin → Can only see users in their org

---

## 9. Admin - Review Queue (5 min)

**Login as admin user**

- [ ] **View review queue** (`/admin/datasets`) → Datasets load
- [ ] **Status tabs** → Click "Submitted" → Only submitted datasets show
- [ ] **Search datasets** → Type dataset title → Results filter
- [ ] **Status badges** → Each dataset shows correct status badge
- [ ] **Dataset count** → Tab labels show count (e.g., "Submitted (5)")

---

## 10. Admin - Organisations (3 min)

**Login as admin user**

- [ ] **View organisations** (`/admin/organisations`) → List loads
- [ ] **Organisation table** → Shows name, type, dataset count, actions
- [ ] **Type badges** → Each org has correct type badge (Government, NGO, etc.)
- [ ] **Dataset count** → Count matches actual datasets per org

---

## 11. Error Handling (5 min)

- [ ] **API error** → Stop backend → Try loading dataportal → Graceful error message
- [ ] **401 Unauthorized** → Delete access token from localStorage → Refresh → Redirect to login
- [ ] **404 dataset** → Navigate to `/dataportal/non-existent-slug` → 404 page or error message
- [ ] **Network timeout** → Slow 3G in DevTools → Loading states show correctly

---

## 12. Performance & Loading States (3 min)

- [ ] **Initial load** → Dataportal shows skeleton loading states
- [ ] **Pagination** → Loading indicator shows while fetching new page
- [ ] **Search** → Debounced search (doesn't fire on every keystroke)
- [ ] **Filter changes** → Loading state shows during filter application

---

## Critical Issues to Flag

🔴 **Block M2 launch:**
- Authentication broken (cannot login)
- Datasets not loading at all
- Downloads failing completely
- Admin cannot manage users/datasets

🟡 **Fix before launch (not blocking):**
- Minor UI bugs (styling, alignment)
- Missing error messages
- Slow load times (>5s)
- Missing loading states

🟢 **Post-launch (nice to have):**
- Additional filters
- Enhanced search
- Better empty states
- Performance optimizations

---

## Test Data Requirements

Before testing, ensure database has:
- ✅ At least 20 datasets (various categories, orgs, formats)
- ✅ At least 5 organisations (different types)
- ✅ At least 10 users (different roles)
- ✅ At least 5 notifications per user
- ✅ Some datasets in each status (draft, pending, approved, rejected)

---

## Browser Testing

Test on at least 2 browsers:
- [ ] Chrome/Edge (primary)
- [ ] Firefox (secondary)
- [ ] Mobile view (responsive design)

---

## Notes & Issues

Use this section to record any bugs or issues found during testing:

```
Issue 1: [Description]
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Severity: 🔴 / 🟡 / 🟢

Issue 2: ...
```

---

**Testing Time Estimate:** ~55 minutes for complete run-through  
**Recommended:** Test twice - once as regular user, once as admin
