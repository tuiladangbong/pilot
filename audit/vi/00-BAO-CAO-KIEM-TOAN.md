# Pilot — Kiểm toán hệ thống độc lập (2026-11-04)

Phạm vi: repo `tuiladangbong/pilot` @ `bb6f0ed`. Phương pháp: rà soát tĩnh toàn bộ `src/`, migration, CI, script, frontend; đã chạy `npm run typecheck` (sạch), `npm test` (37/37 đạt), `npm audit`. **Không thực hiện** (nên là NOT VERIFIED): kiểm tra production, tải/độ trễ lúc chạy, query plan D1, diễn tập khôi phục, quét secret trong lịch sử git, cài đặt WAF/branch protection, kiểm thử trình duyệt/a11y. Không sửa code.
Tệp liên quan: `30-PHAT-HIEN.md`, `29-MA-TRAN-KIEM-SOAT.md`, `32-HIEN-CHUONG-KY-THUAT.md`.

## 1. Tóm tắt điều hành
Pilot là một modular monolith nhỏ, có kỷ luật, thực sự di động được: một Cloudflare Worker, một cơ sở dữ liệu D1, không có dependency runtime, SQL tham số hóa hoàn toàn, thao tác ghi bị chặn mặc định sau token, và các quy tắc kiến trúc trong `AGENTS.md` phần lớn đúng trong code. Điểm yếu không nằm ở thiết kế lõi mà ở xung quanh: **một pipeline chạy không giám sát đăng nội dung bên thứ ba lên production không qua người duyệt**, **một secret dùng chung là toàn bộ mô hình bảo mật**, **không có kiểm chứng chạy được cho persistence/router/migration**, **không có câu chuyện thật về deploy/rollback/quan sát**, và **tài liệu (kể cả bản audit trước) đã lệch khỏi code**.

**Kết luận: CÓ ĐIỀU KIỆN SẴN SÀNG (CONDITIONALLY READY)** (không có P0; 3 P1 đang mở). Với vai trò thư mục công khai rủi ro thấp thì có thể tiếp tục chạy; chưa sẵn sàng để bàn giao cho đội mới hoặc cấp quyền ghi cho ngoài một vận hành viên tin cậy cho đến khi xử lý AUD-SEC-001, AUD-SEC-002 và AUD-OPS-001.

Ma trận kiểm soát: 76 kiểm soát — 20 PASS, 22 PARTIAL, 24 FAIL, 8 NOT VERIFIED, 2 N/A. (Chỉ là số đếm; không đưa phần trăm vì các kiểm soát không được đánh trọng số.)

## 2. Phân loại
Ứng dụng web công khai + API JSON (thư mục/danh mục chủ yếu đọc), đơn tenant, không có tài khoản người dùng cuối, một vai trò curator đặc quyền, cộng pipeline curation tự động (GitHub Actions) và miền AI-resource-hub. Không áp dụng: mobile, game, đa tenant, thanh toán, PII/quyền riêng tư (không lưu PII; favorite của khách nằm trong `localStorage`), message broker.

## 3. Kiểm kê hệ thống
| Thành phần | Loại | Ghi chú |
|---|---|---|
| Worker `src/index.ts` | Điểm vào edge | asset tĩnh, chèn SEO cho `/tools/*`, ủy quyền `/api/*` |
| `adapters/http/router.ts` | Adapter HTTP | 1.267 dòng, mọi route |
| `adapters/http/curatorAuth.ts` | Xác thực | bearer / `X-Curator-Key` / header CF-Access tùy chọn |
| `core/`, `modules/{prompts,tools,workflows,agents}` | Domain + use-case + port | TS thuần, có test |
| `adapters/persistence/d1/*` | Adapter SQL | ~2.900 dòng, FTS5 |
| `platform/cloudflare/*` | Composition root + Env | nơi duy nhất có kiểu CF (cùng adapter D1) |
| D1 `pilot-db` | SQLite | 8 migration, trigger FTS5 |
| `public/` | SPA JS/CSS thuần | app.js 2.047 dòng, styles.css 2.637 dòng |
| `scripts/auto-curate/*` + `auto-curate.yml` | Tự động hóa | HN/GitHub/HF → chấm điểm → đăng → Telegram |
| GitHub Actions `ci.yml` | CI | typecheck + test |
Bên ngoài: API HackerNews, GitHub, HuggingFace, Telegram, dịch vụ favicon DuckDuckGo/Google (hotlink phía client), Cloudflare.

## 4. Bản đồ kiến trúc — dự định vs thực tế
Dự định (`AGENTS.md`, `docs/architecture.md`): modular monolith + hexagonal thực dụng; bảng riêng của module; Cloudflare chỉ ở rìa.
Thực tế: **khớp.** Chiều phụ thuộc `router → use-case → port ← adapter D1`, lắp ghép ở `platform/cloudflare/bootstrap.ts`; không thấy import module-với-module; migration cho mỗi module bảng riêng khóa theo `resources.id`; `resource_relationships` nối các module. Lệch: (a) router (adapter) trên thực tế đóng vai tầng application cho validation/ánh xạ lỗi/phân trang (AUD-ARCH-001); (b) `ResourceRepository` đọc bảng của mọi module qua JOIN, nên "giao tiếp liên module qua interface công khai" được tôn trọng ở mức code nhưng không ở mức dữ liệu (read-model chấp nhận được; chưa được ghi lại); (c) quy tắc kiến trúc chỉ được thực thi bằng quét văn bản regex (`tests/portability.test.mjs`).
Ranh giới tin cậy: Internet → Worker (GET công khai / ghi cần token); Worker → D1; Worker → website công khai tùy ý (lấy metadata, bề mặt SSRF); GitHub Actions → API với token curator; nguồn feed bên thứ ba → pipeline → production.

## 5. Mức sẵn sàng production
Sẵn sàng: auth chặn mặc định, SQL tham số hóa, endpoint health, header request id, CI chặn theo typecheck+test, dependency tối thiểu. Chưa sẵn sàng: deploy/rollback, staging, audit trail, quan sát, đăng tự động không giám sát, bằng chứng khôi phục.

## 6. Độ trưởng thành kỹ thuật
Phần lớn ở mức 1–3: quy tắc được viết (`AGENTS.md`, mức 2), một số được CI thực thi (typecheck, regex portability, test auth: mức 3). Không có gì được đo lường (mức 4): không có coverage, độ trễ, tỉ lệ lỗi hay SLO.

## 7. Bảng điểm theo miền (từ các dòng ma trận)
Mạnh: Kiến trúc 4/7, Modularity 2/2, Database 3/7 (DB-04 NV), Chuỗi cung ứng 2/4 (nhỏ). Yếu (FAIL ≥ PASS): Data, Domain, Testing, Chất lượng code, Frontend, Hiệu năng, Độ tin cậy, Quan sát, Hạ tầng, Tài liệu, AI/Tự động hóa, CI/CD (phía deploy). Có thể tái lập số liệu bằng lệnh grep trong file ma trận.

## 8. Rủi ro hệ thống hàng đầu
1. **SYSTEMIC-TRUST-001**: Quyết định tin cậy dựa vào một secret và một heuristic (token, header CF, điểm chất lượng), không có lớp con người hay danh tính phía sau (AUD-SEC-001/002/003).
2. **SYSTEMIC-VERIFY-001**: Các tầng rủi ro nhất (SQL, migration, router) không có kiểm tra chạy được; quy tắc kiến trúc chỉ quét văn bản (AUD-TEST-001, ARCH-07).
3. **SYSTEMIC-OPS-001**: Khả năng vận hành nằm trên máy một người (`deploy.bat`), runbook chưa kiểm thử, không log/audit (AUD-OPS-001, AUD-OBS-001).
4. **SYSTEMIC-DRIFT-001**: Nhiều bản sao sự thật — dữ liệu (5 nguồn danh mục) và tài liệu (audit cũ, `/api/architecture` hằng cứng) (AUD-DATA-001, AUD-DOC-001).
5. **SYSTEMIC-ERR-001**: Không có chính sách lỗi/validation; điều khiển luồng bằng so khớp chuỗi (AUD-SYS-001, AUD-BUG-001).

## 9–11. Phát hiện
P0: không có. P1: AUD-SEC-001, AUD-SEC-002, AUD-OPS-001. P2: AUD-SEC-003/004, AUD-SYS-001, AUD-ARCH-001, AUD-TEST-001, AUD-DATA-001, AUD-OBS-001, AUD-CICD-001, AUD-DOC-001, AUD-AIOPS-001. P3/P4 xem `30-PHAT-HIEN.md`. Lưu ý: ba mục mà `docs/audit/` cũ gọi là còn mở (secret hardcode, cartesian query, script migration) **đã được sửa trong code** — đã xác minh bằng đọc `curatorAuth.ts`, `D1ResourceRepository.ts`, `package.json`.

## 12. Đánh giá kiến trúc
Điểm mạnh: tính di động có thật và có test; schema riêng của module; port mỏng. Rủi ro: router là file khổng lồ; việc `ResourceDto`/`ResourceRepository` gộp view khiến gắn với cột của mọi module (thêm module thứ 5 phải sửa SELECT 30 cột và mapper — hiện ổn, cần lưu ý ở module thứ 6). Đừng thêm tầng trừu tượng; hãy thêm bảng route và parse dùng chung khi đụng đến router.

## 13. Tính đúng đắn nghiệp vụ
Phép tính quan trọng: chỉ có điểm chất lượng curation (`qualityScorer.computeQualityScore`) và chuẩn hóa URL/host. Điểm là heuristic, không đánh phiên bản, không test, phụ thuộc số liệu bên ngoài lúc chạy (stars/points) → không tái lập được theo thiết kế; chỉ chấp nhận khi nó không còn quyết định việc đăng (AUD-SEC-001). Khuyến nghị golden fixture cho điểm + `normalizeUrl`/`isPrivateOrBlockedHost` (cái sau đã có test).

## 14. Dữ liệu
Nguồn sự thật nên là D1; hiện có năm artifact cạnh tranh (AUD-DATA-001). Dữ liệu dẫn xuất: bảng FTS5 do trigger duy trì (dựng lại được bằng `INSERT INTO fts(fts) VALUES('rebuild')` — chưa được ghi lại). Mơ hồ về favorites (AUD-DATA-002). Không có ràng buộc CHECK cho enum. Không có vấn đề retention/soft-delete (danh mục công khai). Xuất xứ: có cột `origin` (curated/user/discovered) nhưng `sourceMetadata` của pipeline không được lưu — có lưu ở nơi khác hay không: NOT VERIFIED.

## 15. Bảo mật
Tích cực: token chặn mặc định; so sánh thời gian hằng; SQL tham số hóa; đầu vào FTS được làm sạch; redirect SSRF kiểm tra lại; `rel="noopener noreferrer"`; `escapeHtml` dùng rộng; `X-Robots-Tag`. Lỗ hổng: AUD-SEC-001/002/003/004/005/006. Mô hình đe dọa (rút gọn): kẻ tấn công ẩn danh → chỉ đọc + tải tìm kiếm (DoS/chi phí); kẻ trộm token → toàn quyền ghi; feed upstream bị xâm phạm → đầu độc danh mục (đường khả dĩ nhất); CI bị xâm phạm → đánh cắp token; lỗi vận hành → deploy/migration thủ công lệch. Ánh xạ OWASP API Top 10: API2 (mô hình token), API4 (không rate limit, OFFSET sâu), API6 (luồng auto-curation), API8 (header/CSP), API9 (tài liệu cũ/`workers.dev`), API10 (tiêu thụ không an toàn dữ liệu HN/GitHub/HF).

## 16. Kiểm thử
37 test nhanh, tất định, đều đạt; chất lượng tốt cho phần được bao phủ (bất biến domain, chặn auth, predicate SSRF). Thiếu: repository, migration, FTS, auth mức route, ánh xạ lỗi, frontend, pipeline. Không có số liệu coverage. Test kiến trúc bằng regex là hạt giống tốt, chưa phải cổng chặn.

## 17–18. Hiệu năng & khả năng mở rộng (suy luận, không đo)
Bộ dữ liệu ≈ hàng trăm dòng; `/api/tools?limit=500` trả toàn bộ danh mục (frontend tải trong một lần) → payload tăng tuyến tính; ở 10× (vài nghìn) vẫn ổn, ở ~50× lần tải khởi động không phân trang, phân trang `LIMIT/OFFSET` sâu, fallback `LIKE` mỗi request và JSON `null, 2` (thừa byte) trở thành chi phí đầu tiên. Điểm hỏng đầu tiên: endpoint tìm kiếm công khai không rate limit/cache (`no-store` trên listing module) đụng hạn mức đọc D1, trước cả giới hạn khối lượng dữ liệu. D1 là dependency và điểm lỗi đơn duy nhất; CPU Worker không đáng lo. Ngân sách đề xuất: p95 < 300 ms cho `/api/resources`, payload < 200 KB cho lần vẽ đầu (hiện chưa đo).

## 19–20. Độ tin cậy & quan sát
Xử lý lỗi: lỗi không bắt → 500 kèm request id; lấy metadata suy giảm êm; D1 sập → `/api/db-health` 503 nhưng không có fallback/phục vụ bản cũ (`PUBLIC_CACHE_HEADERS` chỉ dùng stale-while-revalidate trên `/resources`). Đăng của pipeline là nhiều lệnh gọi không giao dịch. Quan sát: xem AUD-OBS-001; hiện vận hành viên không trả lời được ai/khi nào/cái gì cho một thay đổi dữ liệu.

## 21–22. CI/CD & hạ tầng
CI: typecheck + test trên PR/push, Node 22, `npm ci`. Thiếu: deploy, smoke test, kiểm tra migration, quét dependency/secret, gia cố permissions, ghim SHA. Hạ tầng: Cloudflare Workers + D1 + tên miền riêng; một môi trường; chưa đặt phơi bày `workers.dev`. Không có container/server để kiểm toán (N/A).

## 23. UX / khả năng truy cập (chỉ xem tĩnh)
Giao diện "Yellow Pages" retro đặc trưng; animation nhấp nháy nhiều và ~13 lần xuất hiện aria/role/label cho thấy accessibility chưa được thiết kế sẵn; xử lý trạng thái loading/empty/error/offline và xác nhận hành động phá hủy chưa kiểm tra sâu → NOT VERIFIED. Dùng axe + duyệt bàn phím trước khi tuyên bố WCAG 2.2 AA.

## 24–25. Tài liệu & vận hành
README, architecture, portability, auto-curation và hai runbook đều có và dễ đọc — trên mức trung bình so với quy mô. Lỗi: audit cũ lỗi thời, không ADR, deploy không được ghi lại, runbook chưa diễn tập, `/api/architecture` hằng cứng. Kỹ sư mới có thể hiểu kiến trúc từ repo, chạy local bằng `npm install`, `npm run db:migrate:local`, `npm run dev` (có tài liệu; chưa chạy trong audit này), nhưng không thể deploy an toàn.

## 26. Bản đồ nợ kỹ thuật
Nợ kiến trúc: router trùng lặp. Nợ dữ liệu: năm bản danh mục, seed trong migration. Nợ test: persistence/router. Nợ bảo mật: một token, không CSP, không audit log. Nợ vận hành: deploy/rollback/quan sát. Nợ tài liệu: audit cũ, không ADR. Nợ dependency: advisory undici chỉ ở dev. Nợ có chủ đích nên giữ: frontend thuần, không framework, không DI container, không microservice.

## 27. Thắng nhanh (rẻ mà thật sự giá trị)
1. Chuyển cron theo lịch sang dry-run/đề xuất; `--publish` chỉ qua dispatch thủ công (AUD-SEC-001). 2. `workers_dev: false`. 3. Helper phân trang an toàn NaN (AUD-BUG-001). 4. Thêm `permissions: contents: read` + ghim SHA cho workflow. 5. Thêm header `nosniff`/`frame-ancestors`/`Referrer-Policy`. 6. Đánh dấu `docs/audit/` là đã bị thay thế. 7. `npm audit fix` (công cụ dev) khi wrangler có bản vá.
Trông dễ nhưng không phải thắng nhanh: định dạng lại/tách `app.js`, đổi tên module.

## 28. Lộ trình (theo thứ tự phụ thuộc)
- **A — An toàn nghiêm trọng**: A1 chặn đăng tự động (AUD-SEC-001); A2 xác minh JWT của Access hoặc bỏ chế độ header, tắt workers.dev (AUD-SEC-002). Công sức N–TB.
- **B — Nền tảng**: B1 phân loại lỗi + parse/validate dùng chung (AUD-SYS-001, AUD-BUG-001) → B2 refactor router thành bảng route (AUD-ARCH-001, phụ thuộc B1); B3 tuyên bố nguồn sự thật dữ liệu, đưa seed ra khỏi migration (AUD-DATA-001); B4 ràng buộc CHECK qua migration mới (AUD-DOM-001).
- **C — Độ tin cậy**: C1 bảng audit log + log có cấu trúc (AUD-OBS-001); C2 quy trình deploy trong repo + deploy/smoke trong CI + diễn tập khôi phục (AUD-OPS-001).
- **D — Quy mô**: D1 header cache cho GET công khai, chặn `limit`/`offset`, quy tắc rate-limit (AUD-SEC-006), đo p95.
- **E — Chất lượng**: E1 test repo/migration/router trên SQLite (AUD-TEST-001, cần B1/B2 để có điểm tựa ổn định); E2 lint + luật ranh giới import; E3 gia cố workflow (AUD-CICD-001); E4 ADR, làm mới tài liệu (AUD-DOC-001).
- **F — Sản phẩm**: F1 CSP + bỏ handler inline (AUD-SEC-003/004, phụ thuộc refactor sự kiện frontend); F2 rà soát a11y, reduced-motion/dừng nhấp nháy (AUD-A11Y-001); F3 sửa AbortController/race (AUD-FE-001).

## 29. Chưa nên refactor
- Đừng tách `app.js` hay dùng framework frontend trước khi quyết định về CSP/handler inline (F1) và có test.
- Đừng viết lại `router.ts` trước khi có phân loại lỗi (B1) và test mức route — nếu không sẽ không có lưới an toàn.
- Đừng thêm module tài nguyên mới trước khi quyết định chiến lược gộp router/DTO (SELECT 30 cột).
- Đừng "sửa" listener Telegram trước khi quyết định cổng duyệt nằm ở Telegram, PR GitHub hay trong ứng dụng (AUD-SEC-001).
- Đừng đụng lịch sử migration (0001–0008); chỉ thêm migration tiến.
- Đừng đưa vào ORM, DI container, queue hay microservice.

## 30. Hiến chương Kỹ thuật
Xem `32-HIEN-CHUONG-KY-THUAT.md`.

## 31. Trả lời 30 câu hỏi (ngắn)
1 Modular monolith, hexagonal, trên Workers+D1. 2 Có (đã xác minh). 3 prompts/tools/workflows/agents trên lõi `resources` chung. 4 Router đóng vai tầng application; join read-model xuyên module. 5 Kỷ luật di động, SQL tham số hóa, auth chặn mặc định, ít dependency. 6 Vận hành, quan sát, độ sâu test, xuất xứ dữ liệu. 7 Xem §8. 8 Deploy, khôi phục, xử lý token, cờ Access. 9 Phần lớn có. 10 Nhiều khả năng có (chưa chạy). 11 Không. 12 Không có tài liệu → chưa xác minh. 13 Có quy trình, chưa từng thực hành → NOT VERIFIED. 14 Điểm không tái lập; predicate URL/SSRF thì có. 15 Có — qua pipeline tự đăng (AUD-SEC-001). 16 Ghi: có (chưa test mức route); đọc: công khai theo thiết kế. 17 Không thấy secret trong file được theo dõi; xoay/phạm vi chưa quản lý; quét lịch sử NOT VERIFIED. 18 Chỉ qua test regex. 19 Có ở mức code. 20 Không (persistence/router). 21 Hầu như không. 22 Không (không log/audit). 23 Tải tìm kiếm công khai/hạn mức đọc D1 và lần gọi khởi động 500 dòng. 24 Như trên cộng giới hạn D1 một DB và payload danh mục. 25 Cơ sở dữ liệu D1 (và máy deploy của một vận hành viên). 26 Cloudflare (D1/Workers); tiếp theo là feed upstream về chất lượng dữ liệu. 27 Frontend thuần/không framework, khối lượng tài liệu MD, phong cách retro. 28 Đăng tự động không giám sát, token dùng chung, thiếu audit trail. 29 AUD-SEC-001, rồi AUD-SEC-002, AUD-OPS-001. 30 Chưa — CONDITIONALLY READY.

## Kết luận cuối: CÓ ĐIỀU KIỆN SẴN SÀNG
Không có P0; ba P1 là vấn đề quy trình/tin cậy hơn là lỗi code. Nền tảng tốt hơn môi trường xung quanh: hãy sửa mô hình tin cậy và khả năng vận hành trước, và bổ sung test chạy được trước mọi refactor.
