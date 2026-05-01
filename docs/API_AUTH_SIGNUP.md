# Auth API – Tài liệu Postman

**Base URL**: `http://localhost:3000`  
**Prefix**: `/api/auth`

---

## 1. Đăng ký tài khoản

- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/sign-up`
- **Authorization**: Không
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "123456"
}
```

- **Response**:
  - 201 (thành công): Tạo tài khoản thành công, trả về thông tin user.

```json
{
  "id": "...",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "bio": null,
  "profileImage": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

  - 400 (thiếu trường bắt buộc):

```json
{
  "error": "Thiếu thông tin bắt buộc"
}
```

  - 400 (định dạng email không hợp lệ):

```json
{
  "error": "Định dạng email không hợp lệ"
}
```

  - 400 (mật khẩu dưới 6 ký tự):

```json
{
  "error": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

  - 400 (email đã tồn tại):

```json
{
  "error": "Email đã tồn tại"
}
```

  - 500 (lỗi máy chủ):

```json
{
  "error": "Lỗi máy chủ nội bộ"
}
```

---

## Ghi chú

- **Đăng ký**: Tạo user mới và trả về thông tin user (không trả JWT token).
- **Validation**:
  - `name`: bắt buộc, trim khoảng trắng
  - `email`: bắt buộc, lowercase, trim khoảng trắng, kiểm tra định dạng regex
  - `password`: bắt buộc, ít nhất 6 ký tự
- **Mật khẩu**: được hash bằng bcrypt với salt rounds = 10 trước khi lưu vào database.