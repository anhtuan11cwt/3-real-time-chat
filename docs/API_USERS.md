# Users API – Tài liệu Postman

**Base URL**: `http://localhost:3000`  
**Prefix**: `/api/users`

---

## 1. Lấy danh sách người dùng

- **Method**: GET
- **URL**: `http://localhost:3000/api/users`
- **Authorization**: Cần đăng nhập (NextAuth session)
- **Headers**:
  - `Cookie: next-auth.session-token=...` (tự động gửi khi đã đăng nhập)
- **Response**:
  - 200 (thành công): Trả về danh sách user (loại trừ user hiện tại)

```json
[
  {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "vana@example.com",
    "profileImage": null
  },
  {
    "id": "...",
    "name": "Trần Thị B",
    "email": "thib@example.com",
    "profileImage": null
  }
]
```

  - 401 (chưa đăng nhập):

```json
[]
```

---

## Ghi chú

- **Authentication**: API sử dụng NextAuth session, cần có cookie session hợp lệ
- **Logic**:
  - Lấy session hiện tại qua `auth()`
  - Nếu không có session hoặc email, trả về mảng rỗng với status 401
  - Query tất cả users từ database, loại trừ user đang đăng nhập (theo email)
  - Chỉ trả về các trường: `id`, `name`, `email`, `profileImage`
- **Sử dụng trong Postman**:
  - Bước 1: Đăng nhập thành công qua `/api/auth/sign-up` hoặc trang login
  - Bước 2: Copy cookie `next-auth.session-token` từ trình duyệt
  - Bước 3: Thêm cookie vào Headers của request GET `/api/users`
