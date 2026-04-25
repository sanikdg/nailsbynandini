# Chat System Test - Manual Steps

## Server Status
✅ Backend: Running on http://localhost:5000
✅ Frontend: Running on http://localhost:5174

## Test Scenario: Customer and Admin Chat

### Step 1: Customer Registration & Login
1. Open browser: http://localhost:5174
2. Click "Sign Up" or "Register"
3. Create customer account:
   - Email: `testcustomer@test.com`
   - Password: `test123456`
   - Name: `Test Customer`
4. Login with these credentials

### Step 2: Customer Books a Design
1. Go to "Book Design" in Customer Dashboard
2. Select any design (e.g., "French Ombre")
3. Fill in booking details:
   - Date: Tomorrow's date
   - Time: 10:00 AM
4. Click "Book Appointment"
5. Go to "My Bookings"
6. **Verify**: Booking shows with status "Pending"
7. **Verify**: Chat button is NOT visible (no conversationId yet)

### Step 3: Admin Accepts Booking
1. Open a new browser tab (or window)
2. Go to http://localhost:5174
3. Login as admin:
   - Email: `admin@nailsbynandini.com`
   - Password: `admin123`
4. Go to "View Bookings"
5. Find the booking from Step 2 (customer name: "Test Customer")
6. Click "Accept" button
7. **Verify**: Booking status changes to "Confirmed"

### Step 4: Customer Opens Chat
1. Go back to customer tab
2. Refresh "My Bookings" page (or wait 5 seconds)
3. **Verify**: Booking status now shows "Confirmed"
4. **Verify**: Chat button is now visible
5. Click "Chat" button
6. **Check browser console (F12)**:
   - Should see: "Booking has conversationId: [ID]"
   - Should see: "Fetching messages for conversation: [ID]"
   - Should see: "Messages fetched: []"
   - Should see: "Joined conversation room: [ID]"

### Step 5: Customer Sends First Message
1. In customer's chat modal
2. Type message: `Hello admin, I'm ready for my appointment!`
3. Click Send button
4. **Verify**: Message appears in customer's chat (right side, pink background)
5. **Check browser console**:
   - Should see: "Sending message to conversation: [ID]"
   - Should see: "Message saved to DB: [object]"
   - Should see: "Message emitted via Socket.io"

### Step 6: Admin Receives Customer's Message
1. In admin tab, open chat for the same booking
2. **Verify**: Customer's message appears in admin's chat (left side, gray background)
3. **Verify**: Message shows timestamp
4. **Check browser console (Admin)**:
   - Should see: "Message received: [object]"

### Step 7: Admin Sends Reply
1. In admin's chat modal
2. Type message: `Great! See you tomorrow at 10 AM!`
3. Click Send button
4. **Verify**: Message appears in admin's chat (right side, pink background)
5. **Check browser console (Admin)**:
   - Should see: "Message saved to DB: [object]"
   - Should see: "Message emitted via Socket.io"

### Step 8: Customer Receives Admin's Message
1. Go back to customer tab
2. **Verify**: Admin's message appears in customer's chat (left side, gray background)
3. **Verify**: Message shows timestamp
4. **Check browser console (Customer)**:
   - Should see: "Message received: [object]"

### Step 9: Customer Sends Another Message
1. In customer's chat modal
2. Type message: `Perfect! Thank you!`
3. Click Send button
4. **Verify**: Message appears in customer's chat
5. **Verify**: Admin receives it in real-time

### Step 10: Verify Message History
1. Close chat modal (click X button)
2. Reopen chat modal
3. **Verify**: All previous messages are still there
4. **Verify**: Messages are in correct order with timestamps

## Expected Chat Flow

```
Customer: "Hello admin, I'm ready for my appointment!"
Admin: "Great! See you tomorrow at 10 AM!"
Customer: "Perfect! Thank you!"
```

## Success Criteria

✅ Chat button appears after admin accepts booking
✅ Customer can open chat without errors
✅ Customer's first message appears in both chats
✅ Admin's reply appears in both chats in real-time
✅ Customer's second message appears in both chats in real-time
✅ All messages have timestamps
✅ Messages are in correct order
✅ Message history persists when reopening chat
✅ No console errors
✅ Socket.io shows green dot (connected)

## Debugging Checklist

### If Chat Button Not Visible
- [ ] Admin accepted the booking? (Check admin's View Bookings)
- [ ] Customer refreshed the page? (Wait 5 sec or refresh)
- [ ] Booking status shows "Confirmed"?

### If Chat Modal Won't Open
- [ ] Check browser console for errors
- [ ] Check if conversationId exists in booking
- [ ] Verify Socket.io connection (green dot)

### If Messages Don't Appear
- [ ] Check browser console for "Message received" log
- [ ] Verify Socket.io shows green dot
- [ ] Check if message was saved to database
- [ ] Try refreshing the page

### If Only One Direction Works
- [ ] Check senderId in messages (should match user ID)
- [ ] Verify both users are in the same conversation room
- [ ] Check Socket.io broadcast is working

## Console Logs to Look For

### Customer Opening Chat
```
Booking has conversationId: 507f1f77bcf86cd799439011
Fetching messages for conversation: 507f1f77bcf86cd799439011
Messages fetched: []
Number of messages: 0
Joined conversation room: 507f1f77bcf86cd799439011
```

### Customer Sending Message
```
Sending message to conversation: 507f1f77bcf86cd799439011
Message saved to DB: {_id: "...", text: "Hello admin...", senderId: "..."}
Message emitted via Socket.io
```

### Admin Receiving Message
```
Message received: {_id: "...", text: "Hello admin...", senderId: "..."}
```

### Admin Sending Message
```
Sending message to conversation: 507f1f77bcf86cd799439011
Message saved to DB: {_id: "...", text: "Great! See you...", senderId: "..."}
Message emitted via Socket.io
```

### Customer Receiving Message
```
Message received: {_id: "...", text: "Great! See you...", senderId: "..."}
```

## Database Verification (Optional)

If you want to verify messages are saved:

```javascript
// In MongoDB Compass or mongosh

// Check booking has conversationId
db.bookings.findOne({ customerName: "Test Customer" })
// Should show: conversationId: ObjectId("...")

// Check messages are saved
db.messages.find({ conversationId: ObjectId("...") })
// Should show all messages with senderId and text

// Check conversation exists
db.conversations.findOne({ _id: ObjectId("...") })
// Should show participants and bookingId
```

## Troubleshooting

### Port Already in Use
If you see "Port 5173 is in use", frontend will use 5174 instead.
Access at: http://localhost:5174

### Backend Connection Error
If backend won't start, check:
- MongoDB connection string in `.env`
- Port 5000 is not in use
- Node.js is installed

### Socket.io Not Connected (Red Dot)
- Restart backend server
- Check browser console for Socket.io errors
- Verify CORS settings in backend

### Messages Not Saving
- Check MongoDB is running
- Check backend console for errors
- Verify message API endpoint is working

## Next Steps After Test

If all tests pass:
1. ✅ Chat system is working correctly
2. ✅ Ready for production deployment
3. ✅ Monitor for any issues in real usage

If tests fail:
1. Check CHAT_DEBUGGING_GUIDE.md
2. Review console logs
3. Verify database
4. Restart servers
