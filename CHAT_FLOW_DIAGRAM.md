# Chat System Flow Diagram

## Complete Chat Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CHAT SYSTEM FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: CUSTOMER BOOKS DESIGN
┌──────────────────────────────────────────────────────────────────────┐
│ Customer Dashboard → Book Design                                      │
│ ├─ Select design                                                      │
│ ├─ Enter name, date, time                                            │
│ └─ Submit booking                                                     │
│                                                                       │
│ Backend: POST /api/bookings                                          │
│ ├─ Create Booking document                                           │
│ ├─ Status: "Pending"                                                 │
│ ├─ conversationId: null (not set yet)                                │
│ └─ Return booking to frontend                                        │
│                                                                       │
│ Frontend: My Bookings                                                │
│ ├─ Display booking with status "Pending"                             │
│ └─ Chat button: HIDDEN (no conversationId)                           │
└──────────────────────────────────────────────────────────────────────┘

STEP 2: ADMIN ACCEPTS BOOKING
┌──────────────────────────────────────────────────────────────────────┐
│ Admin Dashboard → View Bookings                                       │
│ ├─ Find pending booking                                              │
│ └─ Click "Accept" button                                             │
│                                                                       │
│ Backend: PUT /api/bookings/:id/accept                                │
│ ├─ Create Conversation document                                      │
│ │  ├─ participants: [customerId, adminId]                           │
│ │  ├─ bookingId: bookingId                                           │
│ │  └─ designId: designId                                             │
│ ├─ Update Booking document                                           │
│ │  ├─ Status: "Confirmed"                                            │
│ │  └─ conversationId: conversationId (NEW!)                          │
│ └─ Return updated booking to frontend                                │
│                                                                       │
│ Frontend: Admin sees booking status changed to "Confirmed"           │
└──────────────────────────────────────────────────────────────────────┘

STEP 3: CUSTOMER OPENS CHAT (THE FIX!)
┌──────────────────────────────────────────────────────────────────────┐
│ Customer Dashboard → My Bookings                                      │
│ ├─ Refresh page or wait 5 seconds                                    │
│ ├─ Booking status now shows "Confirmed"                              │
│ ├─ Chat button: NOW VISIBLE                                          │
│ └─ Click "Chat" button                                               │
│                                                                       │
│ Frontend: openChat() function (THE FIX!)                             │
│ ├─ Fetch fresh booking data from API                                 │
│ │  └─ GET /api/bookings?userId=customerId                           │
│ ├─ Find the booking in response                                      │
│ ├─ Extract conversationId from fresh booking                         │
│ └─ Pass refreshed booking to ChatModal                               │
│                                                                       │
│ Frontend: ChatModal opens                                            │
│ ├─ Check if booking.conversationId exists ✓                          │
│ ├─ Fetch message history                                             │
│ │  └─ GET /api/messages/:conversationId                              │
│ ├─ Join Socket.io room                                               │
│ │  └─ socket.emit('join chat', conversationId)                       │
│ └─ Display chat interface                                            │
└──────────────────────────────────────────────────────────────────────┘

STEP 4: ADMIN SENDS MESSAGE
┌──────────────────────────────────────────────────────────────────────┐
│ Admin Chat Modal                                                      │
│ ├─ Type message: "Hello from admin"                                  │
│ └─ Click Send button                                                 │
│                                                                       │
│ Frontend: handleSendMessage()                                        │
│ ├─ POST /api/messages                                                │
│ │  ├─ conversationId: conversationId                                 │
│ │  ├─ text: "Hello from admin"                                       │
│ │  ├─ senderId: adminId (from auth)                                  │
│ │  └─ messageType: "text"                                            │
│ │                                                                    │
│ │  Backend: createMessage()                                          │
│ │  ├─ Save Message to database                                       │
│ │  ├─ Update Conversation.lastMessage                                │
│ │  └─ Return message with _id and timestamps                         │
│ │                                                                    │
│ ├─ Emit Socket.io event                                              │
│ │  └─ socket.emit('new message', messageObject)                      │
│ │                                                                    │
│ │  Backend: Socket.io handler                                        │
│ │  ├─ Receive 'new message' event                                    │
│ │  ├─ Broadcast to conversation room                                 │
│ │  └─ socket.in(conversationId).emit('message received', msg)        │
│ │                                                                    │
│ └─ Display message in admin's chat                                   │
└──────────────────────────────────────────────────────────────────────┘

STEP 5: CUSTOMER RECEIVES MESSAGE (REAL-TIME!)
┌──────────────────────────────────────────────────────────────────────┐
│ Customer Chat Modal (already open)                                    │
│ ├─ Socket.io listener active                                         │
│ │  └─ socket.on('message received', (msg) => {...})                  │
│ │                                                                    │
│ │  Backend broadcasts message to room                                │
│ │  └─ socket.in(conversationId).emit('message received', msg)        │
│ │                                                                    │
│ ├─ Message received event triggered                                  │
│ ├─ Add message to messages array                                     │
│ └─ Message appears in chat instantly!                                │
│                                                                       │
│ Customer sees: "Hello from admin" (with timestamp)                   │
└──────────────────────────────────────────────────────────────────────┘

STEP 6: CUSTOMER SENDS REPLY
┌──────────────────────────────────────────────────────────────────────┐
│ Customer Chat Modal                                                   │
│ ├─ Type message: "Hello from customer"                               │
│ └─ Click Send button                                                 │
│                                                                       │
│ Same flow as STEP 4, but:                                            │
│ ├─ senderId: customerId (instead of adminId)                         │
│ └─ Message broadcast to admin's chat                                 │
│                                                                       │
│ Admin sees: "Hello from customer" (with timestamp)                   │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Structure

### Booking Document (After Admin Accepts)
```javascript
{
  _id: ObjectId("booking123"),
  userId: ObjectId("customer456"),
  customerName: "John Doe",
  designId: ObjectId("design789"),
  designName: "French Ombre",
  date: "2024-04-25",
  time: "10:00 AM",
  status: "Confirmed",
  conversationId: ObjectId("conv000"),  // ← Created when admin accepts
  notes: null,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Document
```javascript
{
  _id: ObjectId("conv000"),
  participants: [
    ObjectId("customer456"),
    ObjectId("admin123")
  ],
  bookingId: ObjectId("booking123"),
  designId: ObjectId("design789"),
  lastMessage: "Hello from admin",
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Document
```javascript
{
  _id: ObjectId("msg111"),
  conversationId: ObjectId("conv000"),
  senderId: ObjectId("admin123"),  // or customerId
  text: "Hello from admin",
  messageType: "text",
  readBy: [ObjectId("admin123")],
  createdAt: Date,
  updatedAt: Date
}
```

## Key Points

### Before the Fix
```
Customer clicks Chat
  ↓
ChatModal receives stale booking object
  ↓
booking.conversationId = undefined
  ↓
Chat modal shows warning
  ↓
Messages can't be fetched
  ↓
❌ Customer can't see messages
```

### After the Fix
```
Customer clicks Chat
  ↓
openChat() refreshes booking from API
  ↓
booking.conversationId = ObjectId (from fresh data)
  ↓
ChatModal receives updated booking
  ↓
Messages fetched successfully
  ↓
Socket.io joins conversation room
  ↓
✅ Customer can see messages in real-time
```

## Socket.io Events

### Client → Server
```javascript
socket.emit('setup', userData)           // User connects
socket.emit('join chat', conversationId) // Join conversation room
socket.emit('new message', messageObj)   // Send message
```

### Server → Client
```javascript
socket.emit('connected')                 // Connection confirmed
socket.emit('message received', msg)     // New message received
socket.emit('new message notification', msg) // Notification
```

## API Endpoints Used

### Booking
```
GET  /api/bookings?userId=customerId    // Fetch customer's bookings
PUT  /api/bookings/:id/accept            // Admin accepts booking
```

### Messages
```
GET  /api/messages/:conversationId       // Fetch message history
POST /api/messages                       // Send new message
```

## Timeline

```
T0: Customer books design
    ├─ Booking created (Pending, no conversationId)
    └─ Chat button hidden

T1: Admin accepts booking
    ├─ Conversation created
    ├─ conversationId added to booking
    └─ Chat button becomes visible (after refresh)

T2: Customer clicks Chat
    ├─ Booking data refreshed from API ← THE FIX!
    ├─ conversationId now available
    ├─ Messages fetched from database
    └─ Socket.io joins room

T3: Admin sends message
    ├─ Message saved to database
    ├─ Socket.io broadcasts to room
    └─ Customer receives in real-time

T4: Customer sends reply
    ├─ Message saved to database
    ├─ Socket.io broadcasts to room
    └─ Admin receives in real-time
```

## Success Indicators

✅ Chat button visible after admin accepts
✅ Chat modal opens without errors
✅ Message history loads
✅ Green dot shows Socket.io connected
✅ Messages appear in real-time
✅ No console errors
✅ Both directions work (admin → customer, customer → admin)
