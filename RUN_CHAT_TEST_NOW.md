# Run Chat Test Now - Complete Guide

## Servers Status
✅ Backend: http://localhost:5000 (Running)
✅ Frontend: http://localhost:5174 (Running)

## Quick Start (10 minutes)

### Open Two Browser Windows/Tabs

**Window 1 - Customer**
- URL: http://localhost:5174
- Role: Customer

**Window 2 - Admin**
- URL: http://localhost:5174
- Role: Admin

---

## Test Steps

### WINDOW 1: Customer Registration

1. Go to http://localhost:5174
2. Click "Sign Up"
3. Create account:
   - Email: `testcustomer@test.com`
   - Password: `test123456`
   - Name: `Test Customer`
4. Click "Sign Up" button
5. Login with these credentials

### WINDOW 1: Customer Books Design

1. Click "Customer Dashboard"
2. Click "Book Design"
3. Select any design (e.g., "French Ombre")
4. Fill booking:
   - Date: Pick tomorrow
   - Time: 10:00 AM
5. Click "Book Appointment"
6. Go to "My Bookings"
7. **Check**: Status shows "Pending"
8. **Check**: Chat button is NOT visible

### WINDOW 2: Admin Login

1. Go to http://localhost:5174
2. Click "Sign In"
3. Login as admin:
   - Email: `admin@nailsbynandini.com`
   - Password: `admin123`
4. Click "Admin Dashboard"
5. Click "View Bookings"
6. Find booking from Window 1 (customer: "Test Customer")

### WINDOW 2: Admin Accepts Booking

1. Click "Accept" button on the booking
2. **Check**: Status changes to "Confirmed"

### WINDOW 1: Customer Refreshes

1. Refresh "My Bookings" page (F5)
2. **Check**: Status now shows "Confirmed"
3. **Check**: Chat button is NOW visible
4. Click "Chat" button
5. **Check**: Chat modal opens
6. **Check**: Green dot in header (Socket.io connected)

### WINDOW 1: Customer Sends Message

1. Type in chat: `Hello admin, I'm ready for my appointment!`
2. Click Send button
3. **Check**: Message appears on right side (pink background)
4. **Check**: Message has timestamp
5. **Open DevTools (F12)** and check console:
   - Should see: "Message saved to DB"
   - Should see: "Message emitted via Socket.io"

### WINDOW 2: Admin Opens Chat

1. In View Bookings, click "Chat" for the same booking
2. **Check**: Chat modal opens
3. **Check**: Customer's message appears on left side (gray)
4. **Check**: Message shows timestamp
5. **Check**: Green dot in header
6. **Open DevTools (F12)** and check console:
   - Should see: "Message received"

### WINDOW 2: Admin Sends Reply

1. Type in chat: `Great! See you tomorrow at 10 AM!`
2. Click Send button
3. **Check**: Message appears on right side (pink)
4. **Check**: Message has timestamp
5. **Check Console**: Should see "Message saved to DB"

### WINDOW 1: Customer Receives Reply

1. Look at chat modal
2. **Check**: Admin's message appears on left side (gray)
3. **Check**: Message shows timestamp
4. **Check Console**: Should see "Message received"

### WINDOW 1: Customer Sends Another Message

1. Type: `Perfect! Thank you!`
2. Click Send
3. **Check**: Message appears on right (pink)

### WINDOW 2: Admin Receives

1. Look at chat modal
2. **Check**: Customer's message appears on left (gray)
3. **Check Console**: Should see "Message received"

### WINDOW 1: Verify Message History

1. Close chat (click X)
2. Click "Chat" again
3. **Check**: All 3 messages are still there
4. **Check**: Messages in correct order

---

## Expected Result

### Customer's Chat Should Show:
```
[Right - Pink]  Hello admin, I'm ready for my appointment!
[Left - Gray]   Great! See you tomorrow at 10 AM!
[Right - Pink]  Perfect! Thank you!
```

### Admin's Chat Should Show:
```
[Left - Gray]   Hello admin, I'm ready for my appointment!
[Right - Pink]  Great! See you tomorrow at 10 AM!
[Left - Gray]   Perfect! Thank you!
```

---

## Success Checklist

- [ ] Chat button hidden when booking is Pending
- [ ] Chat button visible when booking is Confirmed
- [ ] Customer can open chat without errors
- [ ] Customer's first message appears in both chats
- [ ] Admin's reply appears in both chats in real-time
- [ ] Customer's second message appears in both chats in real-time
- [ ] All messages have timestamps
- [ ] Messages are in correct order
- [ ] Message history persists when reopening
- [ ] Green dot shows Socket.io connected
- [ ] No console errors

---

## If Something Goes Wrong

### Chat Button Not Visible
- Admin must accept booking first
- Customer must refresh page
- Wait 5 seconds for auto-poll

### Messages Not Appearing
- Check browser console (F12)
- Look for error messages
- Verify green dot (Socket.io connected)
- Try refreshing page

### Red Dot (Socket.io Disconnected)
- Restart backend server
- Refresh browser page
- Check browser console for errors

### Can't Login
- Check email/password are correct
- Try creating new account
- Check backend is running

---

## Console Logs to Expect

### When Opening Chat:
```
Booking has conversationId: [ID]
Fetching messages for conversation: [ID]
Messages fetched: [...]
Joined conversation room: [ID]
```

### When Sending Message:
```
Sending message to conversation: [ID]
Message saved to DB: {...}
Message emitted via Socket.io
```

### When Receiving Message:
```
Message received: {...}
```

---

## Estimated Time

- Customer registration: 1 minute
- Book design: 1 minute
- Admin login & accept: 1 minute
- Chat test: 5 minutes
- **Total: ~10 minutes**

---

## Next Steps After Test

✅ **If all tests pass:**
- Chat system is working correctly
- Ready for production
- Monitor for issues

❌ **If tests fail:**
- Check CHAT_DEBUGGING_GUIDE.md
- Review console logs
- Restart servers
- Try again

---

## Important Notes

- Use two separate browser windows/tabs
- Keep DevTools open to see console logs
- Don't close chat modal between messages
- Refresh page if chat button doesn't appear
- Green dot should always be visible in chat header

---

**Ready to test? Start with WINDOW 1: Customer Registration above!**
