# API Messages Testing Guide

## Overview
Hướng dẫn test API endpoints cho hệ thống tin nhắn sử dụng Postman.

## Prerequisites
1. Server đang chạy (npm run dev)
2. Đã đăng nhập và có session cookie
3. Có ít nhất 2 user trong database để test

## Base URL
```
http://localhost:3000
```

## Authentication
Các API này yêu cầu xác thực qua NextAuth session. Khi test trong Postman, cần:
1. Đăng nhập trước qua API `/api/auth/sign-in`
2. Lưu cookie session để sử dụng cho các request sau

---

## 1. Lấy Danh Sách Tin Nhắn

### Endpoint
```
GET /api/messages/[userId]
```

### Description
Lấy tất cả tin nhắn giữa user hiện tại và user có ID được chỉ định.

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | ID của người dùng muốn xem tin nhắn |

### Headers
```
Content-Type: application/json
Cookie: [next-auth session cookie]
```

### Example Request
```http
GET http://localhost:3000/api/messages/60d5ecb74b24a1234567890
```

### Success Response (200)
```json
[
  {
    "id": "60d5ecb74b24a1234567891",
    "body": "Xin chào!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "senderId": "60d5ecb74b24a1234567890",
    "receiverId": "60d5ecb74b24a1234567892",
    "sender": {
      "id": "60d5ecb74b24a1234567890",
      "name": "Nguyễn Văn A",
      "profileImage": "https://example.com/avatar1.jpg"
    },
    "receiver": {
      "id": "60d5ecb74b24a1234567892",
      "name": "Trần Thị B",
      "profileImage": "https://example.com/avatar2.jpg"
    }
  }
]
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Chưa được xác thực"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Lỗi máy chủ nội bộ"
}
```

---

## 2. Gửi Tin Nhắn Mới

### Endpoint
```
POST /api/messages/send
```

### Description
Gửi một tin nhắn mới đến người dùng được chỉ định.

### Headers
```
Content-Type: application/json
Cookie: [next-auth session cookie]
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | Nội dung tin nhắn |
| receiverId | string | Yes | ID của người nhận |

### Example Request
```http
POST http://localhost:3000/api/messages/send
Content-Type: application/json

{
  "message": "Chào bạn, hôm nay bạn thế nào?",
  "receiverId": "60d5ecb74b24a1234567892"
}
```

### Success Response (201)
```json
{
  "id": "60d5ecb74b24a1234567893",
  "body": "Chào bạn, hôm nay bạn thế nào?",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "senderId": "60d5ecb74b24a1234567890",
  "receiverId": "60d5ecb74b24a1234567892",
  "sender": {
    "id": "60d5ecb74b24a1234567890",
    "name": "Nguyễn Văn A",
    "profileImage": "https://example.com/avatar1.jpg"
  },
  "receiver": {
    "id": "60d5ecb74b24a1234567892",
    "name": "Trần Thị B",
    "profileImage": "https://example.com/avatar2.jpg"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "error": "Thiếu các trường bắt buộc: message và receiverId"
}
```

#### 400 Bad Request - Empty Message
```json
{
  "error": "Tin nhắn không được để trống"
}
```

#### 401 Unauthorized
```json
{
  "error": "Chưa được xác thực"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Lỗi máy chủ nội bộ"
}
```

---

## Postman Collection Setup

### Step 1: Create Collection
1. Mở Postman
2. Click "New" → "Collection"
3. Đặt tên: "Real-time Chat API"

### Step 2: Add Variables
Trong collection settings, thêm variables:
- `baseUrl`: `http://localhost:3000`
- `userId1`: `[ID user thứ nhất]`
- `userId2`: `[ID user thứ hai]`

### Step 3: Add Get Messages Request
1. Click "Add Request"
2. Name: "Get Messages"
3. Method: GET
4. URL: `{{baseUrl}}/api/messages/{{userId2}}`
5. Headers: 
   - Content-Type: application/json

### Step 4: Add Send Message Request
1. Click "Add Request"
2. Name: "Send Message"
3. Method: POST
4. URL: `{{baseUrl}}/api/messages/send`
5. Headers:
   - Content-Type: application/json
6. Body → raw → JSON:
```json
{
  "message": "Test message from Postman",
  "receiverId": "{{userId2}}"
}
```

### Step 5: Authentication Setup
1. Tạo request login trước:
   - POST `{{baseUrl}}/api/auth/sign-in`
   - Body: `{ "email": "user@example.com", "password": "password" }`
2. Enable cookie management trong Postman settings
3. Sau khi login, các request khác sẽ tự động gửi cookie

---

## Testing Workflow

### Test Case 1: Get Messages
1. Login với user A
2. Gửi request GET đến `/api/messages/[userB_id]`
3. Verify response contains messages between A và B
4. Check messages are sorted by createdAt ASC

### Test Case 2: Send Message
1. Login với user A
2. Gửi request POST đến `/api/messages/send`
3. Verify response status 201
4. Check message được tạo với đúng senderId và receiverId
5. Verify message body không bị trim thừa

### Test Case 3: Error Handling
1. Test với missing fields → Expected 400
2. Test với empty message → Expected 400
3. Test không có session → Expected 401
4. Test với invalid receiverId → Expected 500

---

## Tips for Testing

1. **Use Postman Interceptor**: Để browser cookies được tự động gửi
2. **Check Network Tab**: Trong browser để xem actual requests
3. **Use MongoDB Compass**: Để verify data được lưu đúng
4. **Test Edge Cases**: Empty conversation, long messages, special characters
5. **Monitor Console**: Check server logs cho debugging

---

## Common Issues

### Issue: "Chưa được xác thực"
**Solution**: Đảm bảo đã login và cookie được gửi đúng cách

### Issue: "Thiếu các trường bắt buộc"
**Solution**: Check request body có đúng format không

### Issue: CORS errors
**Solution**: Đảm bảo server đang chạy và đúng port

### Issue: Connection refused
**Solution**: Kiểm tra server đang chạy với `npm run dev`
