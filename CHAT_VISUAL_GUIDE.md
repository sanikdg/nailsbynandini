# Chat Visual Guide

## Customer's Chat View

```
┌─────────────────────────────────────────────────────┐
│ Chat with Admin                          [🟢] [X]   │
│ French Ombre                                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│                    Hello admin, I'm ready for my    │
│                    appointment!                      │
│                    [10:30 AM]                        │
│                                                      │
│                                                      │
│  Great! See you tomorrow at 10 AM!                  │
│  [10:31 AM]                                         │
│                                                      │
│                                                      │
│                    Perfect! Thank you!              │
│                    [10:32 AM]                        │
│                                                      │
├─────────────────────────────────────────────────────┤
│ [Type your message...] [Send]                       │
└─────────────────────────────────────────────────────┘

Legend:
- Right side (pink) = Customer's messages
- Left side (gray) = Admin's messages
- 🟢 = Socket.io connected
- [X] = Close chat
```

## Admin's Chat View

```
┌─────────────────────────────────────────────────────┐
│ Test Customer                            [🟢] [X]   │
│ French Ombre                                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Hello admin, I'm ready for my appointment!         │
│  [10:30 AM]                                         │
│                                                      │
│                                                      │
│                    Great! See you tomorrow at 10 AM!│
│                    [10:31 AM]                        │
│                                                      │
│                                                      │
│  Perfect! Thank you!                                │
│  [10:32 AM]                                         │
│                                                      │
├─────────────────────────────────────────────────────┤
│ [Type your message...] [Send]                       │
└─────────────────────────────────────────────────────┘

Legend:
- Left side (gray) = Customer's messages
- Right side (pink) = Admin's messages
- 🟢 = Socket.io connected
- [X] = Close chat
```

## My Bookings - Before Admin Accepts

```
┌─────────────────────────────────────────────────────┐
│ My Bookings                                          │
├─────────────────────────────────────────────────────┤
│ ▼ French Ombre                                       │
│   Tomorrow at 10:00 AM                              │
│                                    [Pending]        │
│                                                      │
│ (Chat button NOT visible)                           │
└─────────────────────────────────────────────────────┘
```

## My Bookings - After Admin Accepts

```
┌─────────────────────────────────────────────────────┐
│ My Bookings                                          │
├─────────────────────────────────────────────────────┤
│ ▼ French Ombre                                       │
│   Tomorrow at 10:00 AM                              │
│                                    [Confirmed]      │
│                                    [💬 Chat]        │
│                                                      │
│ (Chat button NOW visible)                           │
└─────────────────────────────────────────────────────┘
```

## View Bookings (Admin)

```
┌─────────────────────────────────────────────────────┐
│ View Bookings                                        │
├─────────────────────────────────────────────────────┤
│ Test Customer - French Ombre                         │
│ Tomorrow at 10:00 AM                                │
│                                    [Confirmed]      │
│                                    [💬 Chat]        │
│                                    [✓ Accept]       │
│                                    [✗ Reject]       │
└─────────────────────────────────────────────────────┘
```

## Console Logs - Customer Perspective

```
✓ Booking has conversationId: 507f1f77bcf86cd799439011
✓ Fetching messages for conversation: 507f1f77bcf86cd799439011
✓ Messages fetched: []
✓ Number of messages: 0
✓ Joined conversation room: 507f1f77bcf86cd799439011

[Customer sends message]
✓ Sending message to conversation: 507f1f77bcf86cd799439011
✓ Message saved to DB: {_id: "...", text: "Hello admin...", senderId: "..."}
✓ Message emitted via Socket.io

[Admin sends message]
✓ Message received: {_id: "...", text: "Great! See you...", senderId: "..."}
```

## Console Logs - Admin Perspective

```
[Admin opens chat]
✓ Booking has conversationId: 507f1f77bcf86cd799439011
✓ Fetching messages for conversation: 507f1f77bcf86cd799439011
✓ Messages fetched: [{...customer message...}]
✓ Number of messages: 1
✓ Joined conversation room: 507f1f77bcf86cd799439011

[Admin sends message]
✓ Sending message to conversation: 507f1f77bcf86cd799439011
✓ Message saved to DB: {_id: "...", text: "Great! See you...", senderId: "..."}
✓ Message emitted via Socket.io

[Customer sends message]
✓ Message received: {_id: "...", text: "Perfect! Thank you!", senderId: "..."}
```

## What Should Happen

1. **Customer books** → Status: Pending, Chat button hidden
2. **Admin accepts** → Status: Confirmed, Chat button visible
3. **Customer opens chat** → Sees empty message history
4. **Customer sends message** → Message appears on right (pink)
5. **Admin receives** → Message appears on left (gray) in real-time
6. **Admin sends reply** → Message appears on right (pink)
7. **Customer receives** → Message appears on left (gray) in real-time
8. **Both see timestamps** → Each message shows time sent
9. **History persists** → Closing and reopening shows all messages

## Success Indicators

✅ Chat button visible after admin accepts
✅ Chat modal opens without errors
✅ Messages appear in correct order
✅ Messages have correct sender (left/right)
✅ Messages have timestamps
✅ Real-time delivery works both ways
✅ Green dot shows Socket.io connected
✅ No console errors
✅ Message history persists
