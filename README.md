# accounts-api-broken（教師用解答，勿於課堂中直接透露）

模組三「實作（維運排錯）」用的刻意寫壞版本，取代 [../api/](../api/) 部署。程式碼本身**沒有任何提示註解**，維持跟真實除錯情境一樣。

## 預期現象

部署後 Pod 會進入 `CrashLoopBackOff`：

- **Events**：`Back-off restarting failed container`
- **Logs**（`oc logs`）：`Startup DB connectivity check failed: ... ECONNREFUSED 127.0.0.1:5432`

## 根本原因（給教師的解答）

`server.js` 讀取的環境變數名稱是 `DB_HOSTNAME`，但部署設定（比照 [../api/README.md](../api/README.md) 的慣例）給的是 `DB_HOST`——變數名稱打錯字，導致程式讀不到正確值、預設連回 `localhost`，連不到資料庫 Pod。

## 帶討論方向

1. 引導學員看 Events 確認是 CrashLoopBackOff，而非資源不足或 Image Pull 錯誤。
2. 看 Logs 找到 `ECONNREFUSED`，判斷是連線問題而非權限問題（與模組二 SCC 案例做對比）。
3. 檢查 Deployment/Secret 裡實際設定的環境變數名稱，跟程式碼期待的變數名稱逐一核對，找出打錯字的地方。
4. 修正方式：改 Deployment 的環境變數名稱為 `DB_HOSTNAME`，或直接換回 [../api/](../api/) 的正確版本重新部署，兩種都可以驗證 Rolling Update。
