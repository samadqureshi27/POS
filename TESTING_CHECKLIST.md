# 🧪 Login Integration - Testing Checklist

## 🚀 Quick Start

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open two pages:**
   - Login UI: http://localhost:3000/login
   - API Test: http://localhost:3000/api-test

3. **Open Browser DevTools** (F12)
   - Console tab for logs
   - Network tab for API calls
   - Application tab for localStorage

---

## ✅ Testing Checklist

### Test 1: API Connection (Use `/api-test` page)
- [ ] Page loads without errors
- [ ] Default email is pre-filled
- [ ] Enter your password
- [ ] Click "Test Login API"
- [ ] Check console for detailed request/response
- [ ] Status should be `200 ✅`
- [ ] Response should have `result.token`
- [ ] Response should have `result.user`

**Expected Console Output:**
```
🔐 Request: { url: "...", headers: {...}, body: {...} }
📡 Response: { status: 200, data: {...} }
```

---

### Test 2: Login UI Flow
- [ ] Go to `/login`
- [ ] Click "Admin" (right side)
- [ ] Form slides up from bottom
- [ ] Enter email: `qabdulsamad18@gmail.com`
- [ ] Enter password
- [ ] Click "LOGIN"
- [ ] Button shows "LOGGING IN..."
- [ ] Success toast appears
- [ ] Redirects to `/dashboard` after 500ms

**Expected Console Output:**
```
🔐 Login Request: { url, headers, body }
📡 Login Response Status: 200
📦 Login Response Data: { status, message, result }
✅ Login successful: { userId, email }
```

---

### Test 3: Validation Errors
- [ ] Clear email field
- [ ] Click "LOGIN"
- [ ] Should see "Email is required" error
- [ ] Should NOT make API call
- [ ] Enter invalid email format (e.g., "test")
- [ ] Should see "Invalid email format" error
- [ ] Enter valid email, clear password
- [ ] Should see "Password is required" error

---

### Test 4: Invalid Credentials
- [ ] Enter valid email
- [ ] Enter wrong password: "wrongpassword123"
- [ ] Click "LOGIN"
- [ ] Should see error message from API
- [ ] Should see error toast
- [ ] Should NOT redirect
- [ ] Should NOT store token in localStorage

**Expected Behavior:**
- Error message displayed in form
- Red toast notification
- No localStorage entries created

---

### Test 5: Network Monitoring
- [ ] Open Network tab in DevTools
- [ ] Filter by "Fetch/XHR"
- [ ] Click "LOGIN"
- [ ] Find request to `/t/auth/login`

**Verify Request:**
```
Method: POST
URL: https://api.tritechtechnologyllc.com/t/auth/login
Headers:
  Content-Type: application/json
  x-tenant-id: extraction-testt
Payload:
  email: "..."
  password: "..."
  posId: null
  defaultBranchId: null
```

**Verify Response:**
```
Status: 200 OK
Body:
  status: "success"
  message: "..."
  result:
    token: "eyJ..."
    user: { _id, email, fullName, roles, ... }
```

---

### Test 6: LocalStorage Verification
After successful login:

- [ ] Open Application tab → Local Storage
- [ ] Verify `accessToken` exists
- [ ] Verify `refreshToken` exists
- [ ] Verify `user` exists (JSON object)
- [ ] Verify `tenant_slug` = "extraction-testt"

**Verify Token:**
```javascript
// Run in console
const token = localStorage.getItem('accessToken');
console.log('Token:', token);
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 10));
```

**Verify User:**
```javascript
// Run in console
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('User ID:', user._id || user.id);
console.log('Email:', user.email);
console.log('Roles:', user.roles);
```

---

### Test 7: Error Scenarios

#### CORS Error
**If you see:**
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution:**
- Backend needs to allow `http://localhost:3000`
- Contact backend team to add CORS headers

#### 401 Unauthorized
**If you see:**
```
401 Unauthorized
```
**Possible reasons:**
- Wrong tenant slug
- User doesn't exist in this tenant
- Tenant is suspended

#### 404 Not Found
**If you see:**
```
404 Not Found
```
**Possible reasons:**
- API is down
- Wrong base URL
- Endpoint doesn't exist

#### Network Error
**If you see:**
```
Failed to fetch
```
**Possible reasons:**
- No internet connection
- API server is down
- DNS resolution failed

---

## 🐛 Debugging Commands

### Test API with curl:
```bash
curl -X POST https://api.tritechtechnologyllc.com/t/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: extraction-testt" \
  -d '{
    "email": "qabdulsamad18@gmail.com",
    "password": "YOUR_PASSWORD",
    "posId": null,
    "defaultBranchId": null
  }'
```

### Test in browser console:
```javascript
fetch('https://api.tritechtechnologyllc.com/t/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': 'extraction-testt'
  },
  body: JSON.stringify({
    email: 'qabdulsamad18@gmail.com',
    password: 'YOUR_PASSWORD',
    posId: null,
    defaultBranchId: null
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Check stored data:
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Tenant:', localStorage.getItem('tenant_slug'));
```

### Clear all auth data:
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');
localStorage.removeItem('tenant_slug');
location.reload();
```

---

## 📊 Success Criteria

✅ **All checks must pass:**

1. API test page returns 200 status
2. Login UI accepts credentials
3. Success toast appears
4. Redirects to dashboard
5. Token stored in localStorage
6. User data stored in localStorage
7. Tenant slug stored in localStorage
8. Network tab shows correct headers
9. Console shows detailed logs
10. No console errors

---

## 🎯 Next Steps After Login Works

1. Test Manager/PIN login
2. Test Forgot Password flow
3. Test Reset Password flow
4. Add authentication middleware for protected routes
5. Test token refresh on 401 responses
6. Test logout functionality
7. Integrate remaining API endpoints

---

## 📞 Need Help?

**Console shows errors?**
- Read the error message carefully
- Check Network tab for failed requests
- Verify environment variables in `.env.local`
- Check this checklist for similar issues

**API returns errors?**
- Verify credentials are correct
- Check tenant slug is correct
- Test with curl to isolate frontend issues
- Contact backend team if API is down

**Still stuck?**
- Share console logs
- Share Network tab screenshots
- Share error messages
- Check `AUTH_INTEGRATION.md` for detailed info

---

**Status**: ✅ Ready for Testing
**Last Updated**: 2025-10-24
