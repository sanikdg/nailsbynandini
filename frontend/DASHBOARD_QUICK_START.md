# Dashboard Quick Start Guide

## Admin Dashboard

### Access
- URL: `http://localhost:5173/admin`
- Requires admin login at `/admin-login`

### Features

#### Manage Designs
1. Fill in design name and price
2. Upload an image
3. Click "Add Design"
4. View all designs in the table below
5. Delete designs using the trash icon

#### View Bookings
- See all customer bookings
- Columns: Customer Name, Design Name, Date, Time
- Auto-refreshes when new bookings are created

---

## Customer Dashboard

### Access
- URL: `http://localhost:5173/dashboard`
- Requires customer login at `/auth`

### Features

#### Book Design
1. Browse available designs in the grid
2. Click on a design to select it (highlighted with pink border)
3. Enter preferred date and time
4. Click "Confirm Booking"
5. Success message appears

#### My Bookings
- View all your confirmed bookings
- Shows: Design Name, Date, Time
- Updates in real-time

---

## Integration with Designs Page

### "Book This Design" Button
1. Go to `/designs` page
2. Click on any design to open lightbox
3. Click green "Book This Design" button
4. Automatically redirected to `/dashboard/book`
5. Selected design is pre-filled

---

## API Endpoints Required

### Designs
```
GET /api/designs
POST /api/designs (multipart/form-data with image)
DELETE /api/designs/:id
```

### Bookings
```
GET /api/bookings (admin - all bookings)
GET /api/bookings?userId=:id (customer - user's bookings)
POST /api/bookings
```

---

## Testing Checklist

- [ ] Admin can add a design with image
- [ ] Admin can view all designs in table
- [ ] Admin can delete a design
- [ ] Admin can view all bookings
- [ ] Customer can browse designs
- [ ] Customer can select and book a design
- [ ] Customer can view their bookings
- [ ] "Book This Design" button works from Designs page
- [ ] Logout works on both dashboards
- [ ] Mobile responsive layout works

---

## Troubleshooting

### Designs not loading
- Check backend `/api/designs` endpoint
- Verify CORS is enabled
- Check browser console for errors

### Bookings not saving
- Verify backend `/api/bookings` POST endpoint
- Check user authentication
- Verify form data is being sent correctly

### Images not uploading
- Check multipart/form-data handling in backend
- Verify file size limits
- Check upload directory permissions

---

## File Locations

```
frontend/src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageDesigns.jsx
│   │   └── ViewBookings.jsx
│   └── customer/
│       ├── CustomerDashboard.jsx
│       ├── BookDesign.jsx
│       └── MyBookings.jsx
├── components/
│   ├── admin/
│   │   ├── AdminNavbar.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── DesignForm.jsx
│   │   ├── DesignsList.jsx
│   │   └── BookingsTable.jsx
│   └── customer/
│       ├── CustomerNavbar.jsx
│       ├── CustomerSidebar.jsx
│       ├── DesignSelector.jsx
│       └── BookingsList.jsx
```

---

## Key Changes from Old Dashboards

✓ Removed: Complex analytics, multiple tabs, unnecessary features
✓ Added: Clean, focused functionality
✓ Improved: Code organization and maintainability
✓ Simplified: User experience with minimal UI
✓ Maintained: All existing public pages unchanged
