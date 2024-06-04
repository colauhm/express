import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// 리다이렉트할 포트 번호 설정
const redirectPort = 8080;

// 현재 파일의 URL에서 디렉토리 경로를 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 리다이렉션 미들웨어 추가
app.use((req, res, next) => {
    if (req.hostname && req.port === 443) {
        // 리다이렉트할 URL을 설정
        const redirectUrl = `http://${req.hostname}:${redirectPort}${req.originalUrl}`;
        res.redirect(redirectUrl);
    } else {
        next();
    }
});

// 정적 파일 제공
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect('/html/index.html');
});

// 기본 포트 (80)에서 리다이렉션 처리 서버를 시작합니다.
const redirectServer = express();
redirectServer.use(app);
redirectServer.listen(443, () => {
    console.log('Redirect server is running on port 80 and redirecting to port 8080');
});

// 실제 애플리케이션 서버를 8080 포트에서 시작합니다.
const server = app.listen(redirectPort, () => {
    const host = server.address().address;
    const actualHost = host === '::' ? 'localhost' : host;
    console.log(`Server is running at http://${actualHost}:${redirectPort}`);
});
