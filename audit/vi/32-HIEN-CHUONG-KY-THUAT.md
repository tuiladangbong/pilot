# 32 — Hiến chương Kỹ thuật (đề xuất cho Pilot)

Mỗi quy tắc: ID · Quy tắc · Lý do · Cơ chế thực thi. "Gate" = có thể làm cổng chất lượng trong CI.

| ID | Quy tắc | Lý do | Thực thi |
|---|---|---|---|
| ARCH-001 | `core/`, `modules/**`, `ports`, `router` KHÔNG ĐƯỢC import kiểu Cloudflare hay `adapters/persistence`. | Tính di động (AGENTS.md) | Gate: thay test regex bằng luật TS-AST/`dependency-cruiser` |
| ARCH-002 | SQL chỉ nằm trong `adapters/persistence/d1/`. | Một nơi để review truy vấn | Gate: test grep `.prepare(` ngoài thư mục |
| ARCH-003 | Module KHÔNG import module khác; liên kết qua `resource_relationships`/port. | Cô lập | Gate: test ranh giới import |
| ARCH-004 | Route mới = một mục trong bảng route, khai báo mức auth, schema, chính sách cache. | Ngăn lệch theo từng route | Review + test liệt kê route so với auth |
| SEC-001 | Mọi route không phải GET PHẢI có test xác nhận 401 khi thiếu thông tin xác thực. | Ghi mặc định bị chặn | Gate: sinh từ bảng route |
| SEC-002 | Không suy ra danh tính từ header do client gửi nếu không xác minh mật mã. | Chống giả mạo | Review + unit test |
| SEC-003 | Tiến trình tự động CHỈ được đề xuất, không được đăng; ghi vào production cần quyết định của con người. | Toàn vẹn nội dung | Kiểm tra cấu hình workflow (không `--publish` trên `schedule`) |
| SEC-004 | Mỗi thao tác ghi tạo một dòng audit (actor, action, resource, thời gian). | Truy vết trách nhiệm | Test cấp repository |
| SEC-005 | Response mang CSP, nosniff, frame-ancestors; không handler inline hay `innerHTML` với giá trị chưa escape. | Giảm tầm ảnh hưởng XSS | Gate: test header; lint |
| SEC-006 | Secret chỉ ở kho secret của Cloudflare/GitHub; quét secret trong CI ở mỗi push. | Rò rỉ | Gate: gitleaks |
| DATA-001 | Mỗi thay đổi schema = một migration đánh số (chỉ DDL); seed nằm ngoài `migrations/`. | Tái lập được | Gate: CI áp mọi migration lên SQLite rỗng và kiểm tra schema |
| DATA-002 | Cột dạng liệt kê có ràng buộc CHECK. | Bất biến tại nguồn | Review migration + test schema |
| API-001 | Tham số phân trang được parse bởi một helper (an toàn NaN, có chặn trên). | Bền vững | Unit test; cấm grep `parseInt(...searchParams` trần |
| ERR-001 | Ném lỗi có kiểu (`ValidationError`, `NotFoundError`, `ConflictError`); không rẽ nhánh theo `err.message`. Lỗi lạ → 500 chung + log. | Status đúng, không rò rỉ | Lint; test ánh xạ ở router |
| TEST-001 | Hành vi repository và route được test trên SQLite thật với migration thật. | Test đúng chỗ dễ hỏng | Gate: CI |
| TEST-002 | Hàm thuần quan trọng có golden fixture (điểm, chuẩn hóa URL, predicate SSRF). | Tái lập được | Gate: CI |
| FE-001 | Mã UI gửi request phải hủy request đã bị thay thế (AbortController/sequence id). | Chống ghi đè dữ liệu cũ | Review; e2e |
| UX-001 | Điều khiển tương tác dùng được bằng bàn phím; animation tôn trọng `prefers-reduced-motion`; nhấp nháy ≤ 5 giây hoặc có thể dừng. | WCAG 2.2 AA | Gate: axe trong CI |
| PERF-001 | Ngân sách: p95 API < 300 ms, payload lần vẽ đầu < 200 KB. | Đo lường được | Kiểm tra tổng hợp sau deploy |
| OBS-001 | Một log có cấu trúc mỗi request (id, route, status, ms) và mỗi thao tác ghi. | Vận hành được | Review; test dạng log |
| CICD-001 | Workflow khai báo `permissions` tối thiểu, ghim action theo SHA, không nội suy `inputs` vào shell. | Chuỗi cung ứng | Gate: linter workflow (actionlint/zizmor) |
| CICD-002 | Chỉ deploy từ CI sau khi qua kiểm tra; smoke test sau deploy trên `/api/health` và `/api/db-health`; rollback có tài liệu và đã diễn tập. | Phát hành an toàn | Định nghĩa pipeline |
| DOC-001 | Quyết định → ADR (bối cảnh, quyết định, phương án thay thế, hệ quả); tài liệu audit/trạng thái có ngày và được thay thế chứ không sửa âm thầm. | Ngăn lệch | Checklist review |

Ứng viên tự động hóa ngay: ARCH-001/002/003, SEC-001, SEC-006, DATA-001, API-001, CICD-001, TEST-001/002.
