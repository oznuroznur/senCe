# Sence Backend - API Documentation

## Base Information

- **Base URL**: `http://localhost:3000/api` (development)
- **Authentication**: Bearer token (Clerk JWT)
- **Content-Type**: `application/json`
- **Documentation Format**: OpenAPI/Swagger available at `/api/docs`

## Authentication

### Header Format
```
Authorization: Bearer <clerk_jwt_token>
```

### Public Routes
Some endpoints marked `@Public()` can be accessed without authentication:
- Question listing and details
- Public user profiles
- Leaderboard
- Topics and tags
- Participation statistics

### Protected Routes
Require valid JWT token in Authorization header. The token is automatically validated and the user is created lazily on first login.

---

## 1. Users Module (`/users`)

### GET `/users/me`
**Protected** - Get current user profile

**Response (200)**
```json
{
  "id": "uuid",
  "username": "john-584721",
  "displayName": "John Doe",
  "email": "john@example.com",
  "avatarUrl": "https://...",
  "bio": "Tech enthusiast",
  "xpTotal": 1500,
  "level": 2,
  "correctPredictions": 8,
  "totalPredictions": 15,
  "createdAt": "2026-04-10T12:00:00Z"
}
```

### PATCH `/users/me`
**Protected** - Update current user profile

**Request Body**
```json
{
  "displayName": "John D.",  // optional, 2-80 chars
  "bio": "Updated bio"       // optional, max 500 chars
}
```

**Response (200)** - Same as GET `/users/me`

### GET `/users/me/xp-history`
**Protected** - Get XP transaction history (paginated)

**Query Parameters**
- `page` (optional, default 1) - Page number
- `limit` (optional, default 20) - Items per page (1-100)

**Response (200)**
```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 100,
      "reason": "PREDICTION_CORRECT",
      "balanceAfter": 1500,
      "metadata": {
        "streakBonus": 5
      },
      "createdAt": "2026-04-10T12:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### GET `/users/:username`
**Public** - Get user profile by username

**Path Parameters**
- `username` - User's username

**Response (200)** - Same as GET `/users/me`

**Error (404)** - User not found or deleted

### GET `/users/leaderboard`
**Public** - Get top 50 users by XP

**Response (200)**
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "john-584721",
      "displayName": "John Doe",
      "avatarUrl": "https://...",
      "xpTotal": 2500,
      "level": 3,
      "correctPredictions": 20,
      "totalPredictions": 35,
      "rank": 1
    }
  ]
}
```

---

## 2. Questions Module (`/questions`)

### GET `/questions`
**Public** - List published questions (paginated)

**Query Parameters**
- `page` (optional, default 1) - Page number
- `limit` (optional, default 20) - Items per page (1-100)
- `topicId` (optional) - Filter by topic UUID

**Response (200)**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "2026-world-cup-final",
      "title": "2026 Dünya Kupası finalini kim kazanır?",
      "description": "Tahmin süresi finalden 1 saat önce kapanır.",
      "type": "BINARY",
      "status": "PUBLISHED",
      "visibility": "PUBLIC",
      "creator": {
        "id": "uuid",
        "username": "moderator-123456",
        "displayName": "Moderator"
      },
      "topic": {
        "id": "uuid",
        "name": "Spor",
        "slug": "sports"
      },
      "closesAt": "2026-06-15T15:00:00Z",
      "options": [
        {
          "id": "uuid",
          "key": "YES",
          "label": "Evet",
          "position": 0
        },
        {
          "id": "uuid",
          "key": "NO",
          "label": "Hayır",
          "position": 1
        }
      ],
      "resolvedOptionId": null,
      "totalParticipants": 150,
      "totalXPPool": 5000,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "total": 234,
  "page": 1,
  "limit": 20
}
```

### GET `/questions/:slug`
**Public** - Get question by slug

**Path Parameters**
- `slug` - Question slug

**Response (200)** - Same structure as individual question from GET `/questions`

**Error (404)** - Question not found or deleted

### POST `/questions`
**Protected** - Create question (MODERATOR/ADMIN only)

**Request Body**
```json
{
  "title": "2026 Dünya Kupası finalini kim kazanır?",
  "description": "Tahmin süresi finalden 1 saat önce kapanır.",
  "type": "BINARY",              // optional, default: BINARY
  "visibility": "PUBLIC",        // optional, default: PUBLIC
  "topicId": "uuid",             // optional
  "options": [
    {
      "label": "Takim A",
      "key": "A"                  // optional
    },
    {
      "label": "Takim B",
      "key": "B"
    }
  ]
}
```

**Response (201)** - Same as GET `/questions/:slug`

### PATCH `/questions/:id`
**Protected** - Update question (MODERATOR/ADMIN only)

**Path Parameters**
- `id` - Question UUID

**Request Body**
```json
{
  "title": "Updated title",      // optional
  "description": "New desc",     // optional
  "type": "MULTIPLE_CHOICE",     // optional
  "visibility": "UNLISTED"       // optional
}
```

**Response (200)** - Updated question object

### DELETE `/questions/:id`
**Protected** - Soft delete question (ADMIN only)

**Path Parameters**
- `id` - Question UUID

**Response (204)** - No content

### POST `/questions/:id/resolve`
**Protected** - Resolve question and distribute XP (MODERATOR/ADMIN only)

**Path Parameters**
- `id` - Question UUID

**Request Body**
```json
{
  "resolvedOptionId": "uuid"     // UUID of the correct option
}
```

**Response (204)** - No content

---

## 3. Question Comments (`/questions/:questionId/comments`)

### GET `/questions/:questionId/comments`
**Public** - Get comments with replies (paginated)

**Path Parameters**
- `questionId` - Question UUID

**Query Parameters**
- `page` (optional, default 1) - Page number
- `limit` (optional, default 20) - Items per page

**Response (200)**
```json
{
  "data": [
    {
      "id": "uuid",
      "body": "Great question!",
      "status": "ACTIVE",
      "depth": 0,
      "user": {
        "id": "uuid",
        "username": "john-584721",
        "displayName": "John Doe",
        "avatarUrl": "https://..."
      },
      "reactionCounts": {
        "LIKE": 5,
        "DISLIKE": 0,
        "AGREE": 3,
        "DISAGREE": 0
      },
      "replies": [
        {
          "id": "uuid",
          "body": "I agree!",
          "status": "ACTIVE",
          "depth": 1,
          "user": {
            "id": "uuid",
            "username": "jane-987654",
            "displayName": "Jane Smith"
          },
          "reactionCounts": {
            "LIKE": 2,
            "DISLIKE": 0,
            "AGREE": 1,
            "DISAGREE": 0
          },
          "createdAt": "2026-04-10T13:00:00Z"
        }
      ],
      "createdAt": "2026-04-10T12:00:00Z"
    }
  ],
  "total": 24,
  "page": 1,
  "limit": 20
}
```

### POST `/questions/:questionId/comments`
**Protected** - Create root comment

**Path Parameters**
- `questionId` - Question UUID

**Request Body**
```json
{
  "body": "Great question!"      // required, max 2000 chars
}
```

**Response (201)** - Comment object (see structure above)

### POST `/questions/:questionId/comments/:id/reply`
**Protected** - Reply to a comment (max depth 1)

**Path Parameters**
- `questionId` - Question UUID
- `id` - Comment UUID

**Request Body**
```json
{
  "body": "I agree!"
}
```

**Response (201)** - Reply comment object

### DELETE `/questions/:questionId/comments/:id`
**Protected** - Soft delete comment (own or MODERATOR)

**Path Parameters**
- `questionId` - Question UUID
- `id` - Comment UUID

**Response (200)**
```json
{
  "success": true
}
```

---

## 4. Reactions

### POST `/questions/:questionId/reactions`
**Protected** - Toggle reaction on a question

**Path Parameters**
- `questionId` - Question UUID

**Request Body**
```json
{
  "type": "LIKE"  // LIKE | DISLIKE | AGREE | DISAGREE
}
```

**Response (200)**
```json
{
  "type": "LIKE",
  "isActive": true,
  "count": 6
}
```

### POST `/comments/:commentId/reactions`
**Protected** - Toggle reaction on a comment

**Path Parameters**
- `commentId` - Comment UUID

**Request Body & Response** - Same as question reactions

---

## 5. Question Bookmarks (`/questions`)

### POST `/questions/:questionId/bookmark`
**Protected** - Toggle bookmark on a question

**Path Parameters**
- `questionId` - Question UUID

**Response (200)**
```json
{
  "bookmarked": true
}
```

### GET `/users/me/bookmarks`
**Protected** - Get user's bookmarked questions (paginated)

**Query Parameters**
- `page` (optional, default 1)
- `limit` (optional, default 20)

**Response (200)**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "question-slug",
      "title": "Question title",
      // ... full question object
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

---

## 6. Question Follows (`/questions/:questionId/follow`)

### POST `/questions/:questionId/follow`
**Protected** - Toggle follow on a question

**Path Parameters**
- `questionId` - Question UUID

**Response (200)**
```json
{
  "following": true
}
```

### GET `/questions/:questionId/follow`
**Protected** - Check if user follows a question

**Path Parameters**
- `questionId` - Question UUID

**Response (200)**
```json
{
  "following": true
}
```

---

## 7. Predictions/Participations (`/questions/:questionId/participations`)

### POST `/questions/:questionId/participations`
**Protected** - Place a prediction on a question

**Path Parameters**
- `questionId` - Question UUID

**Request Body**
```json
{
  "optionId": "uuid",            // UUID of the option
  "xpWagered": 100               // XP to wager (amount >= 10)
}
```

**Response (200)**
```json
{
  "id": "uuid",
  "questionId": "uuid",
  "optionId": "uuid",
  "xpWagered": 100,
  "xpResult": null,
  "isCorrect": null,
  "createdAt": "2026-04-10T12:45:00Z"
}
```

### GET `/questions/:questionId/participations`
**Public** - Get aggregate prediction statistics

**Path Parameters**
- `questionId` - Question UUID

**Response (200)**
```json
{
  "options": [
    {
      "id": "uuid",
      "key": "YES",
      "label": "Yes",
      "participantCount": 120,
      "xpTotal": 5000,
      "percentage": 65.5
    },
    {
      "id": "uuid",
      "key": "NO",
      "label": "No",
      "participantCount": 65,
      "totalXP": 2600,
      "percentage": 34.5
    }
  ],
  "totalParticipants": 185,
  "totalXPPool": 7600
}
```

### GET `/questions/:questionId/participations/me`
**Protected** - Get current user's prediction for a question

**Path Parameters**
- `questionId` - Question UUID

**Response (200)**
```json
{
  "id": "uuid",
  "questionId": "uuid",
  "optionId": "uuid",
  "xpWagered": 100,
  "xpResult": 150,             // null if question not resolved
  "isCorrect": true,           // null if question not resolved
  "createdAt": "2026-04-10T12:45:00Z"
}
```

**Error (404)** - User has no prediction for this question

---

## 8. Topics (`/topics`)

### GET `/topics`
**Public** - List all topics

**Response (200)**
```json
[
  {
    "id": "uuid",
    "name": "Spor",
    "slug": "sports",
    "description": "Spor tahminleri"
  },
  {
    "id": "uuid",
    "name": "Kripto",
    "slug": "crypto",
    "description": "Kripto para tahminleri"
  }
]
```

### GET `/topics/:slug`
**Public** - Get topic with question count

**Path Parameters**
- `slug` - Topic slug

**Response (200)**
```json
{
  "id": "uuid",
  "name": "Spor",
  "slug": "sports",
  "description": "Spor tahminleri",
  "questionCount": 45,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

## 9. Tags (`/tags`)

### GET `/tags`
**Public** - List all tags

**Response (200)**
```json
[
  {
    "id": "uuid",
    "name": "Football",
    "slug": "football"
  },
  {
    "id": "uuid",
    "name": "Basketball",
    "slug": "basketball"
  }
]
```

---

## 10. Moderation (`/moderation`)

### POST `/questions/:questionId/report`
**Protected** - Report a question

**Path Parameters**
- `questionId` - Question UUID

**Request Body**
```json
{
  "reason": "INAPPROPRIATE",    // Report reason
  "description": "Detailed explanation"  // optional
}
```

**Response (201)**
```json
{
  "id": "uuid",
  "reporterId": "uuid",
  "targetType": "QUESTION",
  "targetId": "uuid",
  "reason": "INAPPROPRIATE",
  "status": "OPEN",
  "createdAt": "2026-04-10T12:00:00Z"
}
```

### POST `/comments/:commentId/report`
**Protected** - Report a comment

**Path Parameters**
- `commentId` - Comment UUID

**Request Body & Response** - Same as question report

---

## Data Types & Enums

### QuestionType
```
BINARY              // Yes/No questions
MULTIPLE_CHOICE     // Multiple options
OPEN_ENDED          // Free text answers
PREDICTION_MARKET   // Market-based prediction
```

### QuestionStatus
```
DRAFT               // Not yet published
PUBLISHED           // Active for predictions
CLOSED              // Closed but not resolved
RESOLVED            // Resolved with winner
ARCHIVED            // Archived
REMOVED             // Deleted
```

### QuestionVisibility
```
PUBLIC              // Visible to everyone
UNLISTED            // Not in listings, but accessible by URL
PRIVATE             // Only for specific users
```

### CommentStatus
```
ACTIVE              // Normal comment
HIDDEN              // Hidden by moderator
REMOVED             // Soft deleted
```

### ReactionType
```
LIKE
DISLIKE
AGREE
DISAGREE
```

### UserRole
```
USER                // Regular user
MODERATOR           // Can create/edit questions, moderate content
ADMIN               // Full access
```

### UserStatus
```
ACTIVE              // Normal user
SUSPENDED           // Temporarily suspended
BANNED              // Permanently banned
PENDING             // Awaiting verification
```

### XPTransactionReason
```
PREDICTION_CORRECT          // Correct prediction
PREDICTION_INCORRECT        // Wrong prediction
PREDICTION_PLACED           // Bonus for placing prediction
STREAK_BONUS                // Streak reward
BADGE_REWARD                // Badge earned
LEVEL_UP_BONUS              // Level up bonus
SIGNUP_BONUS                // Account creation bonus (1000 XP)
DAILY_LOGIN_BONUS           // Daily login reward
ADMIN_ADJUSTMENT            // Admin adjustment
```

### ModerationReportStatus
```
OPEN                // Newly reported
REVIEWING           // Under review
RESOLVED            // Issue resolved
REJECTED            // Report rejected
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate username, etc.) |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "displayName",
      "message": "displayName must be between 2 and 80 characters"
    }
  ]
}
```

---

## Pagination

Paginated endpoints follow this pattern:

**Request**
```
GET /endpoint?page=1&limit=20
```

**Response**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

- `page`: Current page (1-indexed)
- `limit`: Items per page (typically 1-100)
- `total`: Total count of all items

---

## Rate Limiting

Currently no rate limiting is enforced, but may be added in production.

---

## Authentication Flow (Frontend Implementation)

1. User signs up/logs in with Clerk
2. Get Clerk JWT token from Clerk SDK
3. Include token in all protected route requests:
   ```
   Authorization: Bearer <token>
   ```
4. On first API call, user is automatically created in database
5. Subsequent calls use existing user account

**Important**: The user's Prisma `id` (UUID) is different from `clerkUserId`. Use `id` for API calls.

---

## Example Frontend Usage

### Fetch questions
```typescript
const response = await fetch('http://localhost:3000/api/questions?page=1&limit=20');
const data = await response.json();
console.log(data.data); // Array of questions
```

### Place prediction with auth
```typescript
const token = await getTokenFromClerk(); // Your Clerk implementation

const response = await fetch(
  'http://localhost:3000/api/questions/{questionId}/participations',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      optionId: 'uuid-of-option',
      xpWagered: 100
    })
  }
);
```

### Get user profile
```typescript
const token = await getTokenFromClerk();

const response = await fetch('http://localhost:3000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const user = await response.json();
```

---

## Notes for Frontend Team

1. **Timestamps**: All dates are ISO 8601 format in UTC
2. **UUIDs**: Use UUID format for all IDs
3. **XP System**: 
   - Users start with 1000 XP
   - Can wager XP on predictions
   - Lose wagered amount if wrong
   - Win more if correct (varies by pool)
4. **Soft Deletes**: Deleted items have `deletedAt` timestamp but are excluded from public endpoints
5. **Level System**: Based on `xpTotal` (never decreases)
6. **Usernames**: Auto-generated as `emailPrefix-randomDigits` (e.g., john-584721)
7. **Comment Replies**: Limited to 1 level deep (parentComment → reply only)
8. **Bookmarks & Follows**: Toggle endpoints (call again to remove)

---

**API Version**: 1.0  
**Last Updated**: 2026-04-10  
**Swagger Docs**: Available at `/api/docs`
