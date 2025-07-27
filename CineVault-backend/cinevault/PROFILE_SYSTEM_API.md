# Profile System API Documentation

The Profile System allows users to create and manage multiple profiles (up to 3) for personalized experiences. Each profile can have its own watch-later list and preferences.

## Overview

### User Flow:
1. **Registration** → User creates account
2. **Profile Creation** → User creates a profile (required after registration)
3. **Login** → User logs in
4. **Profile Selection** → User selects a profile to use
5. **Profile Screen** → Displays selected profile information

### Key Features:
- **Up to 3 profiles per user**
- **Profile-specific watch-later lists**
- **Kids profiles** (with content restrictions)
- **Profile avatars**
- **Profile management** (create, update, delete)

## Base URLs
```
/api/profiles
/api/watch-later
```

## Profile Management API

### 1. Create Profile
**POST** `/api/profiles?userId={userId}`

Create a new profile for a user.

**Request Body:**
```json
{
  "name": "John's Profile",
  "avatarPath": "/avatars/john.jpg",
  "isKidsProfile": false
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "John's Profile",
  "avatarPath": "/avatars/john.jpg",
  "isKidsProfile": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 2. Get User Profiles
**GET** `/api/profiles?userId={userId}`

Get all active profiles for a user.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "John's Profile",
    "avatarPath": "/avatars/john.jpg",
    "isKidsProfile": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "userId": 1,
    "name": "Kids Profile",
    "avatarPath": "/avatars/kids.jpg",
    "isKidsProfile": true,
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00",
    "updatedAt": "2024-01-15T11:00:00"
  }
]
```

### 3. Get Specific Profile
**GET** `/api/profiles/{profileId}?userId={userId}`

Get a specific profile by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "John's Profile",
  "avatarPath": "/avatars/john.jpg",
  "isKidsProfile": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 4. Update Profile
**PUT** `/api/profiles/{profileId}?userId={userId}`

Update a profile's information.

**Request Body:**
```json
{
  "name": "John's Updated Profile",
  "avatarPath": "/avatars/john_new.jpg",
  "isKidsProfile": false
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "John's Updated Profile",
  "avatarPath": "/avatars/john_new.jpg",
  "isKidsProfile": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T12:00:00"
}
```

### 5. Delete Profile
**DELETE** `/api/profiles/{profileId}?userId={userId}`

Delete a profile (soft delete - sets isActive to false).

**Response (200 OK):**
```json
{
  "message": "Profile deleted successfully"
}
```

### 6. Get Default Profile
**GET** `/api/profiles/default?userId={userId}`

Get the default profile for a user (first created active profile).

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "name": "John's Profile",
  "avatarPath": "/avatars/john.jpg",
  "isKidsProfile": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 7. Check if User Can Create Profile
**GET** `/api/profiles/can-create?userId={userId}`

Check if user can create more profiles (max 3).

**Response (200 OK):**
```json
{
  "canCreate": true
}
```

### 8. Get Profile Count
**GET** `/api/profiles/count?userId={userId}`

Get the number of active profiles for a user.

**Response (200 OK):**
```json
{
  "count": 2
}
```

## Updated Watch Later API (Profile-Based)

### 1. Add to Watch Later (Profile)
**POST** `/api/watch-later?profileId={profileId}`

Add content to a specific profile's watch later list.

**Request Body:**
```json
{
  "contentId": 123,
  "contentType": "MOVIE",
  "notes": "Looks interesting!"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "contentId": 123,
  "contentType": "MOVIE",
  "contentTitle": "Movie Title",
  "contentOverview": "Movie description...",
  "posterPath": "/path/to/poster.jpg",
  "backdropPath": "/path/to/backdrop.jpg",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "addedAt": "2024-01-15T10:30:00",
  "notes": "Looks interesting!"
}
```

### 2. Get Profile's Watch Later List
**GET** `/api/watch-later?profileId={profileId}`

Get all items in a specific profile's watch later list.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "contentId": 123,
    "contentType": "MOVIE",
    "contentTitle": "Movie Title",
    "contentOverview": "Movie description...",
    "posterPath": "/path/to/poster.jpg",
    "backdropPath": "/path/to/backdrop.jpg",
    "voteAverage": 8.5,
    "voteCount": 1000,
    "addedAt": "2024-01-15T10:30:00",
    "notes": "Looks interesting!"
  }
]
```

### 3. Get Profile's Watch Later by Type
**GET** `/api/watch-later/type/{contentType}?profileId={profileId}`

Get watch later items filtered by content type for a specific profile.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "contentId": 123,
    "contentType": "MOVIE",
    "contentTitle": "Movie Title",
    "contentOverview": "Movie description...",
    "posterPath": "/path/to/poster.jpg",
    "backdropPath": "/path/to/backdrop.jpg",
    "voteAverage": 8.5,
    "voteCount": 1000,
    "addedAt": "2024-01-15T10:30:00",
    "notes": "Looks interesting!"
  }
]
```

### 4. Check Watch Later Status (Profile)
**GET** `/api/watch-later/check/{contentId}?profileId={profileId}&contentType={contentType}`

Check if content is in a specific profile's watch later list.

**Response (200 OK):**
```json
{
  "inWatchLater": true
}
```

### 5. Get Watch Later Count (Profile)
**GET** `/api/watch-later/count?profileId={profileId}`

Get the count of watch later items for a specific profile.

**Response (200 OK):**
```json
{
  "totalCount": 5,
  "movieCount": 3,
  "seriesCount": 2
}
```

### 6. Update Notes (Profile)
**PUT** `/api/watch-later/{contentId}/notes?profileId={profileId}&contentType={contentType}`

Update notes for a specific watch later item in a profile.

**Request Body:**
```json
{
  "notes": "Updated notes about this content"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "contentId": 123,
  "contentType": "MOVIE",
  "contentTitle": "Movie Title",
  "contentOverview": "Movie description...",
  "posterPath": "/path/to/poster.jpg",
  "backdropPath": "/path/to/backdrop.jpg",
  "voteAverage": 8.5,
  "voteCount": 1000,
  "addedAt": "2024-01-15T10:30:00",
  "notes": "Updated notes about this content"
}
```

### 7. Remove from Watch Later (Profile)
**DELETE** `/api/watch-later/{contentId}?profileId={profileId}&contentType={contentType}`

Remove content from a specific profile's watch later list.

**Response (200 OK):**
```json
{
  "message": "Removed from watch later list"
}
```

## Usage Examples

### Complete User Flow:

**1. Register User:**
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "dateOfBirth": "1990-01-01"
  }'
```

**2. Create Profile:**
```bash
curl -X POST "http://localhost:8080/api/profiles?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John's Profile",
    "avatarPath": "/avatars/john.jpg",
    "isKidsProfile": false
  }'
```

**3. Get User Profiles:**
```bash
curl -X GET "http://localhost:8080/api/profiles?userId=1"
```

**4. Add Movie to Profile's Watch Later:**
```bash
curl -X POST "http://localhost:8080/api/watch-later?profileId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": 123,
    "contentType": "MOVIE",
    "notes": "Looks interesting!"
  }'
```

**5. Get Profile's Watch Later List:**
```bash
curl -X GET "http://localhost:8080/api/watch-later?profileId=1"
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Maximum number of profiles (3) reached for this user"
}
```

### 404 Not Found
```json
{
  "message": "Profile not found"
}
```

## Profile System Features

### Profile Limits:
- **Maximum 3 profiles per user**
- **At least 1 profile must remain active**
- **Profile names must be unique per user**

### Profile Types:
- **Regular profiles**: Full access to content
- **Kids profiles**: Restricted content access (for future implementation)

### Profile Management:
- **Create**: Add new profiles
- **Update**: Modify profile information
- **Delete**: Soft delete (sets isActive to false)
- **List**: View all active profiles
- **Select**: Choose profile for current session

### Watch Later Integration:
- **Profile-specific lists**: Each profile has its own watch later list
- **Content isolation**: Movies/series are saved per profile
- **Personalized experience**: Different preferences per profile 