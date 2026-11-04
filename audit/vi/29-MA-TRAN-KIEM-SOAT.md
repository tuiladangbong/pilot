# 29 — Ma trận kiểm soát (kiểm toán 2026-11-04)

Độ trưởng thành: 0 không có · 1 tùy tiện · 2 đã định nghĩa · 3 được thực thi · 4 được đo lường · 5 cải tiến liên tục.
Kết quả: PASS / PARTIAL / FAIL / N/A / NOT VERIFIED (giữ nguyên thuật ngữ). Số liệu được đếm từ chính các dòng của file này, không ước lượng.

Lưu ý: cột 'Bằng chứng' và 'Ghi chú' giữ nguyên bản tiếng Anh trong `../29-CONTROL-MATRIX.md` (chứa tên file/ký hiệu mã); bản này chỉ liệt kê kiểm soát và kết quả.

| ID | Miền | Kết quả | Mức |
|---|---|---|---|
| ARCH-01 | Architecture | 3 | Regex guard, bypassable |
| ARCH-02 | Architecture | 3 |  |
| ARCH-03 | Architecture | 2 | Not machine-enforced |
| ARCH-04 | Architecture | 2 | No test |
| ARCH-05 | Architecture | 1 | AUD-ARCH-001 |
| ARCH-06 | Architecture | 2 | AUD-DOC-001 |
| ARCH-07 | Architecture | 2 |  |
| MOD-01 | Modularity | 2 |  |
| MOD-02 | Modularity | 2 |  |
| DOM-01 | Domain | 1 | AUD-DOM-001 |
| DOM-02 | Domain | 2 |  |
| DOM-03 | Domain | 1 |  |
| BIZ-01 | Correctness | 1 | Scoring is heuristic, unversioned |
| DATA-01 | Data | 1 | AUD-DATA-001 |
| DATA-02 | Data | 2 |  |
| DATA-03 | Data | 0 |  |
| DB-01 | Database | 3 |  |
| DB-02 | Database | 2 | FK enforcement in D1 on by default |
| DB-03 | Database | 2 | Old audit claim obsolete |
| DB-04 | Database | 0 |  |
| DB-05 | Database | 1 | AUD-TEST-001 |
| DB-06 | Database | 2 |  |
| DB-07 | Database | 1 | AUD-SEC-006 |
| API-01 | API | 3 |  |
| API-02 | API | 3 |  |
| API-03 | API | 1 |  |
| API-04 | API | 1 | AUD-BUG-001 |
| API-05 | API | 1 | AUD-SYS-001 |
| API-06 | API | 0 |  |
| API-07 | API | 1 |  |
| API-08 | API | 1 |  |
| SEC-01 | Security | 2 | AUD-SEC-002 |
| SEC-02 | Security | 3 |  |
| SEC-03 | Security | 1 | Conditional on flag |
| SEC-04 | Security | 0 | AUD-SEC-003 |
| SEC-05 | Security | 2 | AUD-SEC-004 |
| SEC-06 | Security | 3 |  |
| SEC-07 | Security | 2 | History scan NOT VERIFIED |
| SEC-08 | Security | 0 |  |
| SUP-01 | Supply chain | 3 |  |
| SUP-02 | Supply chain | 1 |  |
| SUP-03 | Supply chain | 1 | AUD-CICD-001 |
| SUP-04 | Supply chain | 3 | Strength |
| QUAL-01 | Code quality | 3 | CI enforced |
| QUAL-02 | Code quality | 0 |  |
| QUAL-03 | Code quality | 0 |  |
| TEST-01 | Testing | 3 |  |
| TEST-02 | Testing | 0 | AUD-TEST-001 |
| TEST-03 | Testing | 3 |  |
| TEST-04 | Testing | 1 |  |
| TEST-05 | Testing | 0 |  |
| FE-01 | Frontend | 1 | NOT VERIFIED at runtime |
| FE-02 | Frontend | 1 | Vanilla JS is policy-compliant |
| UX-01 | UX | 0 |  |
| PERF-01 | Performance | 0 |  |
| PERF-02 | Performance | 0 |  |
| SCALE-01 | Scalability | 2 | See report |
| REL-01 | Reliability | 2 |  |
| REL-02 | Reliability | 1 | AUD-CICD-001 |
| OBS-01 | Observability | 0 | AUD-OBS-001 |
| OBS-02 | Observability | 2 | Not logged |
| OBS-03 | Observability | 2 | Shallow |
| CICD-01 | CI/CD | 3 |  |
| CICD-02 | CI/CD | 0 | AUD-OPS-001 |
| CICD-03 | CI/CD | 0 |  |
| INFRA-01 | Infrastructure | 1 |  |
| INFRA-02 | Infrastructure | 0 |  |
| OPS-01 | Operations | 2 | Untested |
| OPS-02 | Operations | 2 | Not executed here |
| DOC-01 | Documentation | 2 |  |
| DOC-02 | Documentation | 0 |  |
| PRIV-01 | Privacy | – | localStorage only |
| TEN-01 | Multi-tenancy | – |  |
| AI-01 | AI/Automation | 1 | AUD-SEC-001 |
| AI-02 | AI/Automation | 1 |  |

Tổng: 75 kiểm soát — 20 PASS, 22 PARTIAL, 24 FAIL, 7 NOT VERIFIED, 2 N/A.