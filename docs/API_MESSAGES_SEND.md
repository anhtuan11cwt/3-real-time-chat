# API Send Message Testing Guide

## Overview
Hướng dẫn chi tiết test API endpoint gửi tin nhắn sử dụng Postman.

## Prerequisites
1. Server đang chạy (npm run dev)
2. Đã đăng nhập và có session cookie
3. Có ít nhất 2 user trong database để test
4. Pusher được cấu hình đúng để test real-time

## Base URL
```
http://localhost:3000
```

## Authentication
API này yêu cầu xác thực qua NextAuth session. Khi test trong Postman, cần:
1. Đăng nhập trước qua API `/api/auth/sign-in`
2. Lưu cookie session để sử dụng cho các request sau

---

## Endpoint Details

### Method
```
POST
```

### URL
```
/api/messages/send
```

### Description
Gửi một tin nhắn mới đến người dùng được chỉ định và trigger real-time event qua Pusher.

---

## Request Configuration

### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |
| Cookie | [next-auth session cookie] | Yes |

### Request Body Schema
```json
{
  "message": "string",
  "receiverId": "string"
}
```

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| message | string | Yes | Không được rỗng, được trim | Nội dung tin nhắn cần gửi |
| receiverId | string | Yes | Valid MongoDB ObjectId | ID của người nhận tin nhắn |

---

## Postman Setup

### Step 1: Create Request
1. Mở Postman
2. Click "New" → "Request"
3. Name: "Send Message API"
4. Method: POST
5. URL: `{{baseUrl}}/api/messages/send`

### Step 2: Configure Headers
```
Content-Type: application/json
```

### Step 3: Configure Body
1. Chọn "Body" tab
2. Chọn "raw" và "JSON"
3. Nhập body content:
```json
{
  "message": "Xin chào, đây là tin nhắn test từ Postman!",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

### Step 4: Environment Variables (Optional)
Trong Postman environment, thêm:
- `baseUrl`: `http://localhost:3000`
- `receiverId`: `[ID người nhận]`

Request URL sẽ trở thành: `{{baseUrl}}/api/messages/send`

---

## Test Cases

### Test Case 1: Success - Valid Message
**Setup:**
- Đã login với user A
- User B có ID: `60d5ecb74b24a1234567890`

**Request:**
```json
{
  "message": "Chào bạn, hôm nay bạn thế nào?",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

**Expected Response (201):**
```json
{
  "id": "60d5ecb74b24a1234567893",
  "body": "Chào bạn, hôm nay bạn thế nào?",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "senderId": "60d5ecb74b24a1234567891",
  "receiverId": "60d5ecb74b24a1234567890",
  "sender": {
    "id": "60d5ecb74b24a1234567891",
    "name": "Nguyễn Văn A",
    "profileImage": "https://example.com/avatar1.jpg"
  },
  "receiver": {
    "id": "60d5ecb74b24a1234567890",
    "name": "Trần Thị B",
    "profileImage": "https://example.com/avatar2.jpg"
  }
}
```

**Verification:**
- Status Code: 201
- Message được lưu trong database
- Pusher event được trigger
- Message body được trim correctly

### Test Case 2: Error - Missing Message Field
**Request:**
```json
{
  "receiverId": "60d5ecb74b24a1234567890"
}
```

**Expected Response (400):**
```json
{
  "error": "Thiếu các trường bắt buộc: message và receiverId"
}
```

### Test Case 3: Error - Missing Receiver ID
**Request:**
```json
{
  "message": "Test message"
}
```

**Expected Response (400):**
```json
{
  "error": "Thiếu các trường bắt buộc: message và receiverId"
}
```

### Test Case 4: Error - Empty Message
**Request:**
```json
{
  "message": "",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

**Expected Response (400):**
```json
{
  "error": "Tin nhắn không được để trống"
}
```

### Test Case 5: Error - Whitespace Only Message
**Request:**
```json
{
  "message": "   ",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

**Expected Response (400):**
```json
{
  "error": "Tin nhắn không được để trống"
}
```

### Test Case 6: Error - No Authentication
**Setup:**
- Không có session cookie

**Expected Response (401):**
```json
{
  "error": "Chưa được xác thực"
}
```

### Test Case 7: Error - Invalid Receiver ID
**Request:**
```json
{
  "message": "Test message",
  "receiverId": "invalid-id"
}
```

**Expected Response (500):**
```json
{
  "error": "Lỗi máy chủ nội bộ"
}
```

---

## Advanced Testing

### Test Case 8: Message with Special Characters
**Request:**
```json
{
  "message": "Hello! @#$%^&*()_+{}|:<>?[]\\;'\",./<>",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

### Test Case 9: Long Message
**Request:**
```json
{
  "message": "Đây là một tin nhắn rất dài để test khả năng xử lý của hệ thống...",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

### Test Case 10: Unicode Characters
**Request:**
```json
{
  "message": "Xin chào 👋! 你好! こんにちは! 안녕하세요!",
  "receiverId": "60d5ecb74b24a1234567890"
}
```

---

## Real-time Testing

### Verify Pusher Event
1. Mở browser console
2. Đăng nhập với user B
3. Gửi tin nhắn từ user A qua Postman
4. Kiểm tra user B nhận được real-time update

**Expected Pusher Event:**
```javascript
// Channel: [sorted-user-ids]
// Event: new-message
// Data: message object với đầy đủ thông tin
```

---

## Database Verification

### Check MongoDB
```javascript
// Connect to MongoDB
db.messages.find({
  $or: [
    { senderId: "userA_id", receiverId: "userB_id" },
    { senderId: "userB_id", receiverId: "userA_id" }
  ]
}).sort({ createdAt: 1 })
```

### Expected Document Structure
```json
{
  "_id": ObjectId("..."),
  "body": "message content",
  "senderId": "sender_user_id",
  "receiverId": "receiver_user_id",
  "createdAt": ISODate("..."),
  "__v": 0
}
```

---

## Performance Testing

### Load Testing
1. Gửi 100 requests liên tiếp
2. Monitor response time
3. Check database performance
4. Verify Pusher events không bị lỗi

### Concurrent Testing
1. Mở multiple Postman tabs
2. Gửi tin nhắn đồng thời
3. Verify messages được xử lý đúng thứ tự

---

## Troubleshooting

### Common Issues

#### Issue: "Chưa được xác thực"
**Causes:**
- Không có session cookie
- Session expired
- Login failed

**Solutions:**
1. Login lại qua `/api/auth/sign-in`
2. Check cookie trong Postman
3. Verify NextAuth configuration

#### Issue: "Thiếu các trường bắt buộc"
**Causes:**
- Request body malformed
- Missing fields in JSON
- Incorrect field names

**Solutions:**
1. Check JSON syntax
2. Verify field names exactly: `message` và `receiverId`
3. Use Postman's JSON validator

#### Issue: "Tin nhắn không được để trống"
**Causes:**
- Empty string message
- Whitespace only message

**Solutions:**
1. Ensure message has content
2. Check for accidental spaces

#### Issue: "Lỗi máy chủ nội bộ"
**Causes:**
- Invalid receiverId
- Database connection issues
- Pusher configuration errors

**Solutions:**
1. Verify receiverId exists in database
2. Check database connection
3. Review Pusher configuration

---

## Postman Collection Export

### Complete Collection JSON
```json
{
  "info": {
    "name": "Chat API - Send Message",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Send Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"message\": \"Test message from Postman\",\n  \"receiverId\": \"60d5ecb74b24a1234567890\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/messages/send",
          "host": ["{{baseUrl}}"],
          "path": ["api", "messages", "send"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## Testing Checklist

- [ ] Server đang chạy
- [ ] User đã login
- [ ] Session cookie được gửi
- [ ] Request body đúng format
- [ ] Message không rỗng
- [ ] ReceiverId valid
- [ ] Response status 201 cho success
- [ ] Message được lưu trong database
- [ ] Pusher event được trigger
- [ ] Error handling hoạt động đúng
- [ ] Special characters được xử lý
- [ ] Unicode characters được hỗ trợ

---

## Additional Notes

1. **Message Trimming**: API sẽ tự động trim whitespace từ message
2. **Real-time**: Pusher event được trigger ngay sau khi message được lưu
3. **Channel Naming**: Channel name được tạo bằng cách sort IDs và join với "-"
4. **Error Logging**: Check server console cho detailed error messages
5. **Rate Limiting**: Consider implementing rate limiting cho production

---

## Related Documentation

- [API Messages Overview](./API_MESSAGES.md)
- [Authentication API](./API_AUTH_SIGNUP.md)
- [Users API](./API_USERS.md)
