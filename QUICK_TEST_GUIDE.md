# Quick Chat Testing Guide

## TL;DR - What Changed
Customer's booking data is now **automatically refreshed** when they click the Chat button, ensuring they get the latest `conversationId` from the server.

## Quick Test (5 minutes)

### Open Two Browser Tabs
- **Tab 1**: Customer (http://localhost:5173)
- **Tab 2**: Admin (http://localhost:5173)

### Tab 1 - Customer
1. Login as customer
2. Go to "Book Design"
3. Select any design and book an appointment
4. Go to "My Bookings"
5. **Note**: Chat button is NOT visible (booking is Pending)

### Tab 2 - Admin
1. Login as admin: `admin@nailsbynandini.com / admin123`
2. Go to "View Bookings"
3. Find the booking from Tab 1
4. Click "Accept" button

### Tab 1 - Customer (Refresh)
1. Refresh the page or wait 5 seconds
2. **Now**: Chat button should be visible (booking is Confirmed)
3. Click "Chat" button
4. Chat modal opens

### Tab 2 - Admin
1. Open chat for the same booking
2. Type: "Hello from admin"
3. Click Send

### Tab 1 - Customer
1. **Message should appear**: "Hello from admin"
2. Type: "Hello from customer"
3. Click Send

### Tab 2 - Admin
1. **Message should appear**: "Hello from customer"

## ✅ Success
If messages appear in both directions, the chat system is working!

## ❌ If Messages Don't Appear

### Check 1: Is Chat Button Visible?
- If NO: Admin hasn't accepted the booking yet
- If YES: Continue to Check 2

### Check 2: Open Browser Console (F12)
When you click Chat button, you should see:
```
Booking has conversationId: [some-id]
Fetching messages for conversation: [some-id]
Messages fetched: [...]
Number of messages: 0
```

If you see "Booking missing conversationId", the refresh didn't work. Try:
- Refresh the page
- Wait 5 seconds for auto-poll
- Click Chat again

### Check 3: Is Socket.io Connected?
- Look at chat header
- Should see **green dot** (not red)
- If red: Socket.io connection failed

### Check 4: Check Backend Console
Should see:
```
User connected to socket: [socket-id]
User Joined Room: [conversationId]
```

If not, Socket.io isn't working properly.

## Common Issues

| Issue | Solution |
|-------|----------|
| Chat button not visible | Admin must accept booking first |
| "Booking missing conversationId" | Refresh page, wait 5 sec, try again |
| Red dot in chat header | Restart backend server |
| Messages not appearing | Check browser console for errors |
| Admin can send but customer can't see | Check if conversationId exists in booking |

## Key Files Changed
- `frontend/src/pages/customer/MyBookings.jsx` - Auto-refresh booking
- `frontend/src/components/customer/ChatModal.jsx` - Better logging

## No Backend Restart Needed
Just refresh the frontend and test!
