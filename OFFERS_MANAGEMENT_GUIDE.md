# Special Offers Management System

## Overview

The Special Offers system has been fully implemented with:
- **Home Page**: Shows "Coming Soon" when no offers exist, displays active offers when available
- **Admin Dashboard**: Complete offer management interface to create, edit, and delete offers

## Features

### Customer View (Home Page)
- **Coming Soon Display**: When no offers exist, shows a professional "Coming Soon" message
- **Active Offers**: Displays all non-expired offers with:
  - Offer title and description
  - Discount percentage
  - Promo code (if available)
  - Expiry date
  - "Claim Offer" button

### Admin View (Admin Dashboard)
- **Offers Tab**: New tab in admin sidebar for managing offers
- **Create Offers**: Form to add new special offers with:
  - Title (required)
  - Description (required)
  - Discount percentage (required, 0-100)
  - Promo code (optional)
  - Expiry date (required)
- **Edit Offers**: Update existing offers
- **Delete Offers**: Remove offers with confirmation
- **Statistics**: Shows:
  - Total offers
  - Active offers (not expired)
  - Expired offers
- **Status Indicators**: Visual badges showing if offer is Active or Expired

## Files Created/Modified

### Frontend
- `frontend/src/pages/admin/ManageOffers.jsx` - Admin offer management page (NEW)
- `frontend/src/components/home/OffersSection.jsx` - Updated with "Coming Soon" display
- `frontend/src/components/admin/AdminSidebar.jsx` - Added Offers tab
- `frontend/src/pages/admin/AdminDashboard.jsx` - Integrated ManageOffers component

### Backend
- `backend/models/Offer.js` - Added `code` field for promo codes
- `backend/controllers/offerController.js` - Updated to handle promo codes
- `backend/routes/offerRoutes.js` - Already exists with all endpoints

## API Endpoints

### Public
- `GET /api/offers` - Get all active (non-expired) offers

### Admin (Protected + Admin)
- `POST /api/offers` - Create new offer
- `GET /api/offers/all` - Get all offers (including expired)
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer

## How to Use

### For Customers (Home Page)

1. **When No Offers Exist**:
   - See "Coming Soon" message with clock icon
   - Message: "We're preparing amazing special offers and exclusive deals for you"

2. **When Offers Exist**:
   - View all active offers in a grid layout
   - See offer details: title, description, discount, code, expiry
   - Click "Claim Offer" to book a design with the offer

### For Admin (Admin Dashboard)

#### Create a New Offer

1. Login as admin
2. Go to Admin Dashboard → **Offers** tab
3. Click **"Add Offer"** button
4. Fill in the form:
   - **Offer Title**: e.g., "Summer Special - 20% Off"
   - **Description**: e.g., "Get ready for the beach with our vibrant summer collection"
   - **Discount**: e.g., 20 (for 20%)
   - **Promo Code** (optional): e.g., "SUMMER20"
   - **Expiry Date**: Select date when offer expires
5. Click **"Create Offer"**
6. Success message appears: "Offer created successfully"

#### Edit an Offer

1. Go to Admin Dashboard → **Offers** tab
2. Find the offer you want to edit
3. Click the blue **"Edit"** button
4. Update the fields
5. Click **"Update Offer"**
6. Success message appears: "Offer updated successfully"

#### Delete an Offer

1. Go to Admin Dashboard → **Offers** tab
2. Find the offer you want to delete
3. Click the red **"Delete"** button
4. Confirm the deletion in the popup
5. Offer is permanently deleted
6. Success message appears: "Offer deleted successfully"

#### View Offer Statistics

The dashboard shows three stats:
- **Total Offers**: All offers in the system
- **Active Offers**: Offers that haven't expired yet
- **Expired Offers**: Offers past their expiry date

## Offer Status

### Active Offer
- Expiry date is in the future
- Displayed on home page
- Shows green "Active" badge in admin dashboard
- Customers can claim the offer

### Expired Offer
- Expiry date has passed
- NOT displayed on home page
- Shows red "Expired" badge in admin dashboard
- Can still be edited or deleted by admin

## Example Offers

### Summer Special
- Title: "Summer Special - 20% Off"
- Description: "Get ready for the beach with our vibrant summer collection. Applied to all bright and pastel sets."
- Discount: 20%
- Code: SUMMER20
- Expiry: 7 days from now

### Bridal Bundle
- Title: "Bridal Bundle Package"
- Description: "Book your bridal set and get complementary minimalist matching nails for two bridesmaids."
- Discount: 15%
- Code: BRIDE24
- Expiry: 90 days from now

## Coming Soon Display

When no offers exist, customers see:
- Clock icon
- "Coming Soon" heading
- Message: "We're preparing amazing special offers and exclusive deals for you"
- Subtext: "Check back soon for exciting promotions and discounts"

This encourages customers to return to the site for future offers.

## Technical Details

### Offer Model Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  discount: Number (0-100, required),
  code: String (optional),
  expiry: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Offer Filtering
- **Public API** (`GET /api/offers`): Returns only offers where expiry date >= current date
- **Admin API** (`GET /api/offers/all`): Returns all offers including expired ones

## Testing

### Test Creating an Offer
1. Login as admin (admin@nailsalon.com / adminpassword)
2. Go to Admin Dashboard → Offers
3. Click "Add Offer"
4. Fill in all fields
5. Click "Create Offer"
6. Go to home page
7. Scroll to "Special Offers" section
8. Should see your new offer displayed

### Test Coming Soon Display
1. Delete all offers from admin dashboard
2. Go to home page
3. Scroll to "Special Offers" section
4. Should see "Coming Soon" message

### Test Offer Expiry
1. Create an offer with expiry date in the past
2. Go to home page
3. Offer should NOT appear (only active offers shown)
4. Go to admin dashboard
5. Offer should appear with "Expired" badge

## Notes

- Offers are automatically filtered on the frontend based on expiry date
- Admin can see all offers including expired ones
- Promo codes are optional - if not provided, a code is auto-generated
- Discount must be between 0-100%
- All dates are stored in UTC and converted to local timezone for display

