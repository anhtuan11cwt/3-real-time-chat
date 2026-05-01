# Upload & Setup Profile API – Tài liệu Postman

**Base URL**: `http://localhost:3000`

---

## 1. Upload Ảnh Lên Cloudinary

- **Method**: POST
- **URL**: `http://localhost:3000/api/upload`
- **Authorization**: Không
- **Headers**:
  - `Content-Type: multipart/form-data`
- **Body** (form-data):
  - `file`: [chọn file ảnh]

- **Response**:
  - 200 (thành công): Trả về URL ảnh đã upload

```json
{
  "url": "https://res.cloudinary.com/.../chat-app/avatars/..."
}
```

  - 400 (không có file):

```json
{
  "error": "Không có file được upload"
}
```

  - 400 (không phải ảnh):

```json
{
  "error": "Chỉ cho phép file ảnh"
}
```

  - 400 (quá 2MB):

```json
{
  "error": "Kích thước file tối đa 2MB"
}
```

  - 500 (lỗi máy chủ):

```json
{
  "error": "Upload thất bại"
}
```

---

## 2. Lấy Thông Tin User Hiện Tại

- **Method**: GET
- **URL**: `http://localhost:3000/api/user/me`
- **Authorization**: Cookie từ NextAuth (đã đăng nhập)

- **Response**:
  - 200 (thành công):

```json
{
  "id": "...",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "bio": null,
  "profileImage": null,
  "hasProfile": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

  - 401 (chưa đăng nhập):

```json
{
  "error": "Chưa đăng nhập"
}
```

---

## 3. Cập Nhật Profile

- **Method**: POST
- **URL**: `http://localhost:3000/api/user/setup-profile`
- **Authorization**: Cookie từ NextAuth (đã đăng nhập)
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "bio": "Xin chào, tôi là A",
  "profileImage": "https://res.cloudinary.com/.../..."
}
```

- **Response**:
  - 200 (thành công):

```json
{
  "id": "...",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "bio": "Xin chào, tôi là A",
  "profileImage": "https://res.cloudinary.com/.../...",
  "hasProfile": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

  - 401 (chưa đăng nhập):

```json
{
  "error": "Chưa đăng nhập"
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

- **Flow đăng ký và thiết lập profile**:
  1. User đăng ký tại `/api/auth/sign-up` → auto sign-in
  2. Redirect sang `/setup-profile` (đã có session)
  3. Fetch thông tin user từ `/api/user/me` để pre-fill form
  4. Upload ảnh lên `/api/upload` → nhận URL
  5. Gọi `/api/user/setup-profile` với bio và profileImage
  6. Redirect sang `/chat`

- **Validation**:
  - `bio`: tùy chọn
  - `profileImage`: tùy chọn, là URL từ Cloudinary
  - `name`: đã có từ sign-up, không cần nhập lại

- **Cloudinary**: Ảnh được lưu vào folder `chat-app/avatars`