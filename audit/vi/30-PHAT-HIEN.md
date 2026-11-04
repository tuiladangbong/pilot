# 30 — Các phát hiện (kiểm toán độc lập, 2026-11-04)

Thang mức độ: P0 nghiêm trọng · P1 cao · P2 trung bình · P3 thấp · P4 cải tiến.
Bằng chứng được dẫn dạng `đường_dẫn:dòng`. "NOT VERIFIED" = không thể xác lập chỉ từ repo.
Tất cả phát hiện ở trạng thái OPEN. Không sửa code trong quá trình kiểm toán.

---
## P1 — CAO

### AUD-SEC-001 · Tự động đăng nội dung bên thứ ba lên production mà không có người duyệt (theo lịch, mỗi 6 giờ)
- Loại: BẢO MẬT / QUY TRÌNH · Độ tin cậy: Cao
- Bằng chứng: `.github/workflows/auto-curate.yml` — `cron: '0 */6 * * *'`; `DRY_RUN="${{ github.event.inputs.dry_run }}"` rỗng khi chạy theo lịch nên nhánh `else` chạy `node scripts/auto-curate/index.mjs --publish`. `scripts/auto-curate/index.mjs:159-186` đăng tool + workflow + prompt qua API curator; thông báo Telegram là `notifier.notifyPublished(...)` (index.mjs:189), tức là *sau khi* đã đăng.
- Nguyên nhân gốc: "duyệt bởi người" chỉ là thông báo, không phải cổng chặn. Điều kiện nhận là điểm heuristic (stars/points/từ khóa, `qualityScorer.mjs`) trên dữ liệu HackerNews/GitHub/HuggingFace — kẻ tấn công có thể tác động (làm giả sao, nhồi từ khóa).
- Tác động: kẻ tấn công khiến URL/văn bản tùy ý xuất hiện trên danh mục production mà không ai quyết định; tổn hại uy tín, host link phishing/mã độc, lạm dụng SEO. Job nắm token ghi toàn quyền.
- Kịch bản lỗi: kẻ tấn công tạo repo GitHub có mô tả đạt heuristic, sau đó website/README chuyển độc hại → bị đăng trong vòng 6 giờ.
- Khuyến nghị: lần chạy theo lịch chỉ ở chế độ dry-run/"đề xuất" (ghi ứng viên vào trạng thái chờ hoặc PR); yêu cầu con người duyệt rõ ràng mới được đăng; thêm khái niệm `status=pending` (hiện chưa có).
- Khả năng xảy ra TB · Tác động TB · Khả năng phát hiện Thấp · Phạm vi: toàn danh mục công khai · Phục hồi: dễ nhưng mất uy tín.
- Quy mô: Trung bình · Chuẩn: OWASP API6, SLSA/OpenSSF

### AUD-SEC-002 · Một bearer token tĩnh dùng chung là cơ chế xác thực/phân quyền duy nhất; chế độ tin header không xác minh chữ ký
- Loại: BẢO MẬT · Độ tin cậy: Cao (mô hình token) / Trung bình (mức độ phơi bày của chế độ header)
- Bằng chứng: `src/adapters/http/curatorAuth.ts` — ai giữ `CURATOR_TOKEN` (hoặc `ADMIN_TOKEN` cũ, `bootstrap.ts`) đều là `curator@pilot`; danh tính là một chuỗi hằng. `trustAccessHeader` chấp nhận `cf-access-authenticated-user-email` mà không xác minh JWT (`cf-access-jwt-assertion`). `wrangler.jsonc` chỉ đặt route `custom_domain`, không đặt `workers_dev: false` (mặc định Wrangler mở `*.workers.dev`).
- Tác động: (a) không truy vết theo từng người, xoay token = hỏng mọi tự động hóa, token lộ từ CI/trình duyệt = toàn quyền ghi/xóa; (b) nếu `TRUST_CF_ACCESS=true` được bật ở production và worker truy cập được ngoài Access (workers.dev hoặc đường không nằm sau Access), header có thể bị giả mạo → chiếm quyền hoàn toàn. Cờ có bật ở production hay không: NOT VERIFIED.
- Không chống brute-force/giới hạn tốc độ cho kiểm tra token (WAF: NOT VERIFIED). So sánh thời gian hằng chỉ khi độ dài bằng nhau (chấp nhận được).
- Khuyến nghị: xác minh JWT của Access (aud + chữ ký qua JWKS) thay vì tin header; đặt `workers_dev: false`; token/danh tính riêng cho từng chủ thể; ghi audit log cho mỗi thao tác ghi.
- Quy mô: Trung bình · Chuẩn: OWASP ASVS V2/V4, API2/API5

### AUD-OPS-001 · Deploy và kiểm tra production là kiến thức truyền miệng; không có deploy tự động, staging, hay rollback đã kiểm thử
- Loại: VẬN HÀNH · Độ tin cậy: Cao
- Bằng chứng: `package.json` `deploy: wrangler deploy` chạy thủ công; `.gitignore` bỏ qua `deploy.bat` (commit 0fabcb5) — quy trình deploy thật chỉ có trên một máy. CI (`ci.yml`) chỉ typecheck+test; không có job deploy, smoke test, kiểm tra migration. Một D1 database id duy nhất; không có staging. `docs/runbooks/disaster-recovery.md` mô tả `d1 export` / `time-travel restore` nhưng không có bằng chứng đã từng thực hiện.
- Tác động: đội mới không thể deploy an toàn; thứ tự migration + code thủ công (`db:migrate:remote` tách khỏi `deploy`); không có quy trình rollback code.
- Khuyến nghị: ghi quy trình deploy vào repo; thêm job deploy trong CI có kiểm tra điều kiện, smoke test `/api/health` + `/api/db-health`; quy định thứ tự migration-rồi-deploy (expand/contract); diễn tập khôi phục vào D1 tạm và ghi lại kết quả.
- Quy mô: Trung bình

---
## P2 — TRUNG BÌNH

### AUD-SEC-003 · Không có header bảo mật/CSP; khóa curator lưu trong `localStorage`; CORS `*`
- Bằng chứng: `src/index.ts` chỉ thêm `X-Robots-Tag`/`X-Request-Id`; `public/app.js:1923` `localStorage.setItem('pilot_curator_key', key)`; `router.ts` `Access-Control-Allow-Origin: '*'`; 17 lần gán `innerHTML` trong `public/app.js`.
- Tác động: bất kỳ XSS nào (xem AUD-SEC-004) đều lấy được token curator vĩnh viễn. Không chống clickjacking, không có `nosniff`, `Referrer-Policy`. CORS `*` chấp nhận được chỉ vì xác thực bằng header token (không cookie) — cần giữ nguyên như vậy.
- Khuyến nghị: CSP (các handler inline `onerror=`/`onclick=` hiện tại cản trở CSP chặt), `nosniff`, `frame-ancestors 'none'`; giữ token trong bộ nhớ/sessionStorage hoặc chuyển sang Access.
- Quy mô: Trung bình

### AUD-SEC-004 · Render HTML phụ thuộc việc escape ở từng chỗ gọi; một số nội suy không được escape
- Bằng chứng: `public/app.js:1112` `data-id="${p.id}"` (và các thẻ tương tự) không escape; id do người gọi cung cấp (`CreateToolUseCase` nhận `body.id`), nên id chứa `"` thoát khỏi thuộc tính. `escapeHtml` có sẵn (`app.js:2032`) và dùng cho hầu hết văn bản, nên đây là kiểm soát dựa vào quy ước, không phải lỗ hổng toàn hệ thống.
- Tác động: stored XSS cho ai ghi được id (token bị lộ / pipeline của AUD-SEC-001). Server không ràng buộc định dạng id.
- Khuyến nghị: kiểm tra id phía server (UUID hoặc regex slug); dựng DOM bằng `textContent`/`dataset`; thêm lint cấm `innerHTML` với `${}` chưa escape.
- Quy mô: Nhỏ–Trung bình

### AUD-SYS-001 · Không có phân loại lỗi; điều khiển luồng bằng `err.message.includes('not found')`; trả thông điệp nội bộ thô cho client
- Loại: HỆ THỐNG · Độ tin cậy: Cao
- Biểu hiện: `router.ts` có ~40 khối catch dạng `err.message?.includes('not found') → 404, ngược lại jsonError(<X>_ERROR, err.message, 400|500)`; domain/use-case `throw new Error(...)`. Ví dụ `DELETE_ERROR`/`DUPLICATION_ERROR` trả `err.message` với status 500.
- Tác động: (1) đổi câu chữ làm 404 thành 500 âm thầm; (2) lỗi DB/driver (tên ràng buộc, mảnh SQL) có thể lộ qua `err.message`; (3) không phân biệt được lỗi validation, xung đột, hạ tầng → status sai (vd. vi phạm unique slug → 400/500 chung chung).
- Nguyên nhân gốc: ngữ nghĩa lỗi không phải là mối quan tâm của dự án.
- Khuyến nghị: hệ phân cấp `DomainError` nhỏ (Validation/NotFound/Conflict) ánh xạ một lần ở router; lỗi lạ → 500 chung + log.
- Quy mô: Trung bình

### AUD-ARCH-001 · `router.ts` là bộ điều phối regex 1.267 dòng, sao chép CRUD cho 4 module; validation đầu vào kiểu `any`, tùy tiện
- Bằng chứng: `wc -l`: router.ts 1267; bốn khối gần giống hệt cho prompts/tools/workflows/agents; `let body: any`; `parseInt(...)` cho phân trang không xử lý NaN.
- Tác động: mỗi thay đổi xuyên suốt (auth, cache, validation, log) phải sửa N lần; đã không nhất quán: `/api/resources` gửi `PUBLIC_CACHE_HEADERS` còn `/api/tools|prompts|…` thì không; `Allow-Methods` của OPTIONS thiếu `PATCH` dù có route PATCH (hỏng preflight cross-origin).
- Khuyến nghị: bảng route + handler từng route + helper parse/validate dùng chung. **Không** đưa framework vào khi chưa cần.
- Quy mô: Trung bình–Lớn

### AUD-TEST-001 · Test chỉ bao phủ code domain thuần và guard kiến trúc dạng regex; persistence, SQL, FTS, migration và router không được kiểm thử
- Bằng chứng: `npm test` → 37 pass/0 fail. agents 7, catalog 2, curator-auth 8, domain 5, portability 3, tools 7, workflows 5. `grep -l router tests/*.mjs` chỉ trúng `portability.test.mjs` (kiểm tra văn bản nguồn). Không test nào chạm `D1*Repository`, migration, hay một request HTTP qua `handleRequest`.
- Tác động: phần rủi ro nhất (~2.300 dòng SQL ở adapter, 8 migration, router 1.267 dòng) không có kiểm chứng chạy được; trigger FTS, unique slug, cascade delete và việc chặn auth ở mức route chưa được chứng minh.
- Khuyến nghị: chạy migration 0001–0008 trên SQLite (`node:sqlite` hoặc better-sqlite3 dạng devDependency, phù hợp mục tiêu portability) và test repository + `handleRequest` với fake trong bộ nhớ; thêm golden test cho hình dạng `GET /api/*`.
- Ngoài ra: `portability.test.mjs` quét import bằng regex theo dòng — khởi đầu tốt nhưng vượt qua được (dynamic import, import nhiều dòng, re-export type).
- Quy mô: Trung bình

### AUD-DATA-001 · Nhiều nguồn sự thật phân kỳ cho danh mục; dữ liệu seed nằm trong migration
- Bằng chứng: `data/ai-tools-catalog.json` (4.510 dòng), `src/data/catalogData.ts` (814), `public/data/catalogData.js` (906), `migrations/0007_*.sql` (632) và `0008_*.sql` (779) sinh bởi `scripts/generate_seed_0008.js`; cộng D1 sống bị pipeline curation thay đổi. `migrations/0006_public_catalog.sql:17-22` backfill slug theo id cứng.
- Tác động: không ai nói được nguồn nào có thẩm quyền; production lệch khỏi repo; sửa seed sau khi migration đã chạy không có tác dụng; môi trường mới ≠ production; frontend có thể hiển thị dữ liệu tĩnh khác API. `validate-catalog.mjs`/`import-catalog.mjs` có nhưng không nằm trong CI.
- Khuyến nghị: tuyên bố D1 là nguồn sự thật cho dữ liệu runtime; giữ một artifact seed + importer idempotent ngoài `migrations/`; migration chỉ chứa DDL.
- Quy mô: Trung bình

### AUD-OBS-001 · Khả năng quan sát chỉ là `console.error` cho ngoại lệ không bắt được
- Bằng chứng: 1 chỗ dùng `console.` trong `src/` (đường lỗi không xử lý của router.ts). Không có log có cấu trúc, audit trail cho thay đổi, số đo độ trễ, không có khối `observability` trong `wrangler.jsonc`; `/api/db-health` chỉ là kiểm tra kết nối. Request id có (cf-ray / UUID) và trả về trong `X-Request-Id` — tốt — nhưng không được log kèm lỗi ở các đường 4xx/5xx đã xử lý.
- Tác động: không trả lời được "ai đã đổi/xóa tool này, khi nào"; không tính được SLO khả dụng/độ trễ; runbook sự cố không có gì để truy vấn.
- Khuyến nghị: bật Workers observability; một dòng log có cấu trúc cho mỗi request (id, route, status, ms) và mỗi thao tác ghi (actor, resource id, action).
- Quy mô: Nhỏ–Trung bình

### AUD-CICD-001 · Lỗ hổng gia cố CI/workflow
- Bằng chứng: `ci.yml`/`auto-curate.yml` thiếu khối `permissions:` (token quyền mặc định); action ghim theo tag (`@v4`) không theo SHA; `auto-curate.yml` nội suy `${{ github.event.inputs.* }}` thẳng vào shell (chèn script bởi người có quyền dispatch; thấp vì cần quyền ghi); `concurrency.cancel-in-progress: true` có thể hủy giữa lúc đang đăng khiến tool được đăng mà thiếu workflow/prompt (đăng nhiều lệnh gọi, không giao dịch); không có `npm audit`, quét secret, tự động cập nhật dependency; branch protection NOT VERIFIED.
- Quy mô: Nhỏ

### AUD-DOC-001 · Bản kiểm toán cũ trong repo (`docs/audit/`) đã lỗi thời và mâu thuẫn với code
- Bằng chứng: `docs/audit/30-FINDINGS.md` liệt kê AUD-SEC-001 (token fallback hardcode / header giả mạo được, "P0"), AUD-PERF-001 (Cartesian join), AUD-OPS-001 (script migration) là còn mở. Code hiện tại: không còn token hardcode (`curatorAuth.ts`), đếm bằng scalar subquery (`D1ResourceRepository.ts`), `package.json` dùng `wrangler d1 migrations apply`. Các bản sửa nằm ở commit 92b8464, *sau* commit audit 7e38a08, và tài liệu không được cập nhật. `/api/architecture` trả hằng cứng. README/tài liệu kiến trúc chưa đối chiếu từng dòng (NOT VERIFIED).
- Tác động: tài liệu sai nguy hiểm hơn không có; người đọc tin rằng P0 còn sống hoặc mục đã sửa vẫn cần làm. ID phát hiện trùng với audit này.
- Khuyến nghị: đánh dấu `docs/audit/` là ảnh chụp lịch sử có ngày; giữ một sổ đăng ký phát hiện sống; audit này dùng thư mục `audit/` để không ghi đè lịch sử.

### AUD-AIOPS-001 · Pipeline curation: secret chết, handler "approve" Telegram gây hiểu lầm, không có danh sách người gửi được phép
- Bằng chứng: `scripts/auto-curate/telegram-webhook.mjs:54-55` trả lời "Approved and published to Pilot!" khi `approve_*` nhưng không gọi curator client (grep: không có `client.`, không publish); cũng không kiểm tra người/chat bấm có bằng `TELEGRAM_CHAT_ID`. Listener không được workflow nào chạy (script long-polling). `AI_API_KEY` được truyền vào workflow và `evaluateCandidate(candidate, apiKey)` nhận nó, nhưng chấm điểm chỉ dùng heuristic (không thấy gọi LLM). Biểu thức `kind` là `x ? 'tool' : 'tool'` (qualityScorer.mjs).
- Tác động: người vận hành được báo ứng viên đã duyệt/đăng trong khi không có gì xảy ra (thành công giả); secret không dùng làm tăng bề mặt rò rỉ; nếu sau này nối dây, ai trong chat cũng duyệt được.
- Quy mô: Nhỏ

---
## P3 — THẤP

- **AUD-BUG-001 NaN khi phân trang**: `parseInt('abc')` → NaN; clamp ở repo `Math.min(Math.max(NaN,1),500)` = NaN (đã kiểm tra bằng node) → NaN bind vào `LIMIT ?` → nhiều khả năng D1 báo lỗi → 500 cho truy vấn sai đơn giản. `offset` không giới hạn (OFFSET sâu phải quét) và `limit` tới 500 kèm cột nội dung prompt cho mỗi dòng.
- **AUD-SEC-005 Bộ lọc SSRF dựa trên chuỗi**: `isPrivateOrBlockedHost` (`Tool.ts:180`) kiểm tra hostname/IPv4 dạng chấm/một số tiền tố IPv6; không kiểm tra sau phân giải DNS (tên công khai → IP riêng), phạm vi IPv6 ánh xạ IPv4 (`::ffff:…`) NOT VERIFIED. Giảm thiểu: endpoint cần quyền curator; redirect được kiểm tra lại từng bước (đã xác minh `FetchToolMetadataUseCase.ts`); egress của Workers không tới được mạng RFC1918. Rủi ro còn lại: thấp.
- **AUD-SEC-006 Body request không giới hạn / không rate limit** trên GET công khai (tìm kiếm toàn văn + fallback `LIKE '%q%'` trên nội dung prompt/instructions của agent khi truy vấn FTS bị làm sạch thành rỗng, vd. `q=*`). Quy tắc WAF/rate-limit của Cloudflare NOT VERIFIED.
- **AUD-DATA-002 `favorite` có hai–ba nghĩa**: `resources.favorite` (toàn cục, do curator đặt, 0003) vs favorite theo khách trong `localStorage` (`pilot_visitor_favorites`) vs `prompts.favorite` cũ (0001, backfill ở 0003; còn được ghi hay không: NOT VERIFIED). Cùng một từ, ba nghĩa.
- **AUD-DOM-001 Ám ảnh kiểu nguyên thủy ở core dùng chung**: `Resource.type: string`, `createResource` ép kiểu `origin as ResourceOrigin` không kiểm tra lúc chạy; timestamp là chuỗi ISO tạo bằng `new Date()` trong hàm domain (đồng hồ không tiêm được → test không tất định). Chấp nhận được với hub nhỏ, nhưng bất biến (type thuộc module đã đăng ký, origin thuộc enum) không được ép ở đâu, kể cả DB (migration không có CHECK).
- **AUD-FE-001 Frontend nguyên khối & race**: `public/app.js` 2.047 dòng, `state` toàn cục, không có `AbortController` (grep: 0) — các request chi tiết/tìm kiếm liên tiếp nhanh (`/api/agents/:id`, `/api/resources/:slug`) có thể render sai thứ tự (A cũ đè C). Chưa tái hiện lúc chạy (NOT VERIFIED).
- **AUD-A11Y-001 Rủi ro accessibility (chỉ xem tĩnh)**: animation "retro-blink" liên tục (`styles.css:263+`) chỉ với một khối `prefers-reduced-motion` — rủi ro WCAG 2.2.2/2.3.1 nếu nhấp nháy >5s không thể tạm dừng; chỉ 13 lần xuất hiện aria/role/label trong HTML+CSS cho trang 933 dòng có modal; handler `onclick`/`onerror` inline. Chưa chạy kiểm tra tương phản/bàn phím.
- **AUD-SUP-001 Dependency**: `npm audit` → 3 lỗ hổng (1 cao, 2 trung bình) đều qua `undici ← miniflare ← wrangler` (devDependencies; không có trong bundle triển khai). Có caret range + lockfile. `allowScripts` ghim esbuild/workerd.
- **AUD-MIG-001 Thực hành migration**: chỉ tiến, không có down/ghi chú rollback; `ALTER TABLE ADD COLUMN` + backfill theo id cứng (0006); trigger cập nhật FTS trên `AFTER UPDATE ON resources` (mọi cột, 0002) chạy ở mỗi lần bật/tắt; không kiểm tra áp 0001→0008 lên DB rỗng cho ra schema code mong đợi (không test). An toàn bảng lớn chưa đặt ra ở quy mô hiện tại (~hàng trăm dòng) — NOT VERIFIED ở quy mô production.
- **AUD-DX-001 Phạm vi typecheck**: `tsconfig` chỉ gồm `src/**`; `scripts/*.mjs`, `public/*.js`, tests không có kiểu/lint; không có ESLint/Prettier; không có luật ranh giới import ngoài test regex.

## P4 — CẢI TIẾN
- Thêm ADR (chưa có; `docs/architecture.md` nêu quyết định nhưng không nêu phương án thay thế/đánh đổi).
- Thêm SLO (khả dụng của `/api/health`, p95 của `/api/resources`).
- Endpoint `/api/architecture` hằng cứng sẽ lệch dần; nên bỏ hoặc sinh tự động.
- Ảnh chụp màn hình (`screenshots/*.png`, 14 file) nằm trong repo → phình repo.
