# Ứng Dụng Chat Thời Gian Thực

Ứng dụng chat thời gian thực đầy đủ tính năng được xây dựng với Next.js 16, TypeScript và các công nghệ web hiện đại.

## Tính Năng

- **Nhắn tin thời gian thực** với giao nhận tin nhắn tức thì
- **Xác thực người dùng** với đăng nhập an toàn基于 thông tin đăng nhập
- **Quản lý hồ sơ** với tải lên ảnh đại diện
- **Theo dõi trạng thái trực tuyến** hiển thị ai đang hoạt động
- **Thiết kế đáp ứng** với giao diện tối
- **Lưu trữ cơ sở dữ liệu** với MongoDB
- **Tải lên hình ảnh** với tích hợp Cloudinary

## Công Nghệ

### Frontend
- **Next.js 16** (App Router, TypeScript)
- **React 19** với hooks hiện đại
- **Tailwind CSS 4** cho styling
- **Lucide React** cho icons
- **React Icons** cho các yếu tố UI bổ sung

### Backend & Database
- **MongoDB Atlas** cho cơ sở dữ liệu
- **Prisma** làm ORM
- **NextAuth v5** cho xác thực
- **bcryptjs** cho hashing mật khẩu

### Real-time & Storage
- **Pusher Channels** cho nhắn tin và presence thời gian thực
- **Cloudinary** cho lưu trữ hình ảnh và CDN

### Công cụ phát triển
- **TypeScript** cho type safety
- **ESLint** cho chất lượng code
- **Biome** cho formatting và linting
- **Prisma Client** cho các thao tác database

## Cấu Trúc Dự Án

```
real-time-chat/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── messages/      # Message handling
│   │   ├── pusher/        # Pusher authentication
│   │   ├── upload/        # Image upload
│   │   ├── user/          # User management
│   │   └── users/         # User listing
│   ├── chat/              # Chat interface
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── auth.ts            # NextAuth configuration
├── components/            # React components
│   ├── ChatWindow.tsx     # Main chat interface
│   ├── MessageBubble.tsx  # Message display component
│   ├── Providers.tsx      # App context providers
│   └── Sidebar.tsx        # User list and navigation
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## Bắt Đầu

### Yêu cầu

- Node.js 18+ đã cài đặt
- Tài khoản MongoDB Atlas (cho database)
- Tài khoản Cloudinary (cho tải lên hình ảnh)
- Tài khoản Pusher (cho tính năng thời gian thực)

### Cài Đặt

1. Clone repository:
```bash
git clone <repository-url>
cd real-time-chat
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Thiết lập biến môi trường:
```bash
cp .env.example .env
```

4. Cấu hình biến môi trường trong `.env`:
```env
# Database
DATABASE_URL="mongodb+srv://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Pusher
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

5. Khởi tạo database:
```bash
npx prisma db push
npx prisma generate
```

6. Khởi động development server:
```bash
npm run dev
```

7. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Schema Database

### User Model
```typescript
interface User {
  id: string
  name: string | null
  email: string
  password: string
  bio: string | null
  profileImage: string | null
  hasProfile: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Message Model
```typescript
interface Message {
  id: string
  body: string
  createdAt: DateTime
  senderId: string
  receiverId: string
  sender: User
  receiver: User
}
```

## Luồng Xác Thực

1. **Đăng ký**: Người dùng tạo tài khoản với email và mật khẩu
2. **Thiết lập hồ sơ**: Người dùng tải lên ảnh đại diện và thiết lập thông tin hồ sơ
3. **Đăng nhập**: Người dùng xác thực với thông tin đăng nhập
4. **Quản lý session**: Session-based JWT với NextAuth
5. **Protected Routes**: Middleware bảo vệ các route chat và hồ sơ

## Tính Năng Thời Gian Thực

### Nhắn tin
- Giao nhận tin nhắn tức thì sử dụng Pusher Channels
- Lưu lịch sửữ tin nhắn trong MongoDB
- Đồng bộ thời gian thực trên nhiều client
- Tự động scroll đến tin nhắn mới nhất

### Trạng thái trực tuyến
- Theo dõi trạng thái online/offline thời gian thực
- Presence channels cho sự sẵn có của người dùng
- Chỉ báo trực quan trong sidebar người dùng
- Tự động cập nhật trạng thái khi kết nối/ngắt kết nối

## Thành Phần UI

### Cửa sổ Chat
- Bubble tin nhắn với phân biệt người gửi/người nhận
- Input tin nhắn thời gian thực với nút gửi
- Tự động scroll đến tin nhắn mới nhất
- Ảnh đại diện và header cuộc trò chuyện

### Sidebar
- Danh sách người dùng với chỉ báo trạng thái online
- Hiển thị hồ sơ người dùng hiện tại
- Chức năng đăng xuất
- Lựa chọn người dùng để trò chuyện

### Trang Xác thực
- Form đăng nhập với validation
- Form đăng ký với xác nhận mật khẩu
- Thiết lập hồ sơ với tải lên hình ảnh
- Thiết kế đáp ứng cho mọi kích thước màn hình

## Lệnh Phát Triển

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run check           # Run Biome check
npm run format          # Format code with Biome

# Database
npx prisma studio       # Open Prisma Studio
npx prisma db push      # Push schema to database
npx prisma generate     # Generate Prisma Client
```

## Triển Khai

### Vercel Deployment

1. Push code lên GitHub repository
2. Kết nối Vercel với tài khoản GitHub của bạn
3. Import dự án
4. Cấu hình biến môi trường trong Vercel dashboard
5. Deploy

### Biến Môi Trường cho Production

Đảm bảo thêm tất cả biến môi trường từ file `.env` vào cài đặt dự án Vercel:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `CLOUDINARY_*` variables
- `PUSHER_*` variables

## Kiểm Tra Ứng Dụng

### Luồng Đăng Ký Người Dùng
1. Điều hướng đến trang chủ
2. Click "Sign up" và tạo tài khoản mới
3. Thiết lập hồ sơ với ảnh đại diện và bio
4. Xác nhận redirect đến giao diện chat

### Luồng Nhắn Tin
1. Mở hai cửa sổ hoặc tab trình duyệt
2. Đăng nhập với các tài khoản người dùng khác nhau
3. Chọn người dùng từ sidebar
4. Gửi tin nhắn và xác nhận giao nhận thời gian thực
5. Kiểm tra chỉ báo trạng thái trực tuyến

### Xử Lý Lỗi
- Kiểm tra đăng ký email trùng lặp
- Kiểm tra thông tin đăng nhập không hợp lệ
- Kiểm tra truy cập protected routes mà không có xác thực
- Kiểm tra validations tải lên file

## Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Thực hiện thay đổi
4. Chạy tests và linting
5. Gửi pull request

## Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT.

## Liên Kết Liên Quan

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Pusher Documentation](https://pusher.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
